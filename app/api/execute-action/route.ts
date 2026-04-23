import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAction, getBrief, saveDraft } from "@/app/_lib/db";

export const runtime = "nodejs";

const MODEL = "claude-opus-4-7";

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

const SYSTEM_PROMPT = `You are a hands-on execution agent working for a founder. You produce the ACTUAL deliverable — not advice about how to create the deliverable.

Given the founder's business context and one specific action they need to complete, write the real thing:
- If the action is "send a newsletter", write the newsletter (subject + body).
- If the action is "draft a landing page", write the landing page copy (headline + sub + sections + CTA).
- If the action is "record a video", write the full script (hook → body → CTA).
- If the action is "post on Instagram", write the caption (+ 3 alternative hooks for A/B testing).
- If the action is "email 10 people", write the cold email template (subject + body + two variants).
- If the action genuinely requires the founder to do something only they can do (a phone call, a physical task), produce the preparation brief for it: talking points, the one-pager, the checklist.

Rules:
- Pick the single most plausible deliverable format for this action. If ambiguous, produce the one with highest commercial leverage.
- Ground every sentence in the founder's actual business, audience, and offers — use their details, not generic placeholders.
- Write the thing as they'd ship it. No "you could write something like..." — just write it.
- Output clean Markdown. Start with a ### heading naming the deliverable. No preamble, no meta-commentary, no "Here's your draft".`;

type RequestBody = {
  actionId?: number;
  userNotes?: string;
};

type ParsedBrief = {
  businessName?: string;
  existingOffers?: string;
  currentBook?: string;
  targetAudience?: string;
  mainRevenueGoal?: string;
  preferredChannels?: string;
  strengths?: string;
  availableAssets?: string;
  constraints?: string;
  notes?: string;
};

function buildUserPrompt(brief: ParsedBrief, task: string, userNotes?: string) {
  const detail = (label: string, v?: string) =>
    v && v.trim() ? `- ${label}: ${v.trim()}` : null;

  const context = [
    detail("Business", brief.businessName),
    detail("Main revenue goal", brief.mainRevenueGoal),
    detail("Target audience", brief.targetAudience),
    detail("Existing offers", brief.existingOffers),
    detail("Current book", brief.currentBook),
    detail("Available assets", brief.availableAssets),
    detail("Founder's strengths", brief.strengths),
    detail("Preferred channels", brief.preferredChannels),
    detail("Constraints", brief.constraints),
    detail("Notes", brief.notes),
  ]
    .filter(Boolean)
    .join("\n");

  return `BUSINESS CONTEXT
${context}

ACTION TO EXECUTE
${task}

${userNotes?.trim() ? `FOUNDER NOTES ON THIS DRAFT\n${userNotes.trim()}\n` : ""}
Produce the deliverable in Markdown.`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.actionId || !Number.isInteger(body.actionId)) {
    return NextResponse.json(
      { error: "actionId is required." },
      { status: 400 }
    );
  }

  const action = getAction(body.actionId);
  if (!action) {
    return NextResponse.json({ error: "Action not found." }, { status: 404 });
  }

  const briefRow = getBrief(action.brief_id);
  if (!briefRow) {
    return NextResponse.json(
      { error: "Parent brief not found." },
      { status: 404 }
    );
  }

  let brief: ParsedBrief = {};
  try {
    brief = JSON.parse(briefRow.brief_json);
  } catch {
    // fall through with empty brief; model still has the action text
  }

  try {
    const response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(brief, action.task, body.userNotes),
        },
      ],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    const output = textBlock?.text?.trim() ?? "";
    if (!output) {
      return NextResponse.json(
        { error: "Model returned empty output." },
        { status: 502 }
      );
    }

    let draftId: number | null = null;
    try {
      draftId = saveDraft({
        actionId: action.id,
        output,
        userNotes: body.userNotes,
      });
    } catch (e) {
      console.error("Failed to save draft:", e);
    }

    return NextResponse.json({ draftId, output });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Anthropic API key is invalid or missing." },
        { status: 401 }
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by Anthropic. Please retry in a moment." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error (${err.status}): ${err.message}` },
        { status: err.status ?? 500 }
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unknown error drafting action.",
      },
      { status: 500 }
    );
  }
}
