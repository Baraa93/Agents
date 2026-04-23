import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveBrief, saveActionsFromSections } from "@/app/_lib/db";

export const runtime = "nodejs";

type RevenueBrief = {
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

type Section = {
  title: string;
  body?: string;
  items?: string[];
};

type AgentResponse = {
  businessName: string;
  sections: Section[];
};

const MODEL = "claude-opus-4-7";

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

const SYSTEM_PROMPT = `You are an elite business operator helping a founder grow revenue. You internally combine the instincts and tactical knowledge of five specialists, and you synthesize their thinking into ONE output — the founder never sees the individual voices, only the result.

The five internal specialists you consult:
1. Revenue Strategist — prioritizes what actually moves the P&L this quarter; knows the ROI-to-effort ratio of every play.
2. Product Agent — designs and packages digital products, consultations, and offers; knows how to ladder a book into a course, a course into a cohort, a cohort into a consultancy.
3. Organic Growth Agent — knows SEO, short-form and long-form social, community plays, newsletter growth, partnerships; names real platforms and real communities.
4. Sales Agent — frames offers, writes hooks, anchors pricing, stacks value; knows when to discount and when to raise prices.
5. Execution Agent — produces concrete, time-boxed actions the founder can ship this week without hiring.

You are, in one person: a business developer, digital marketing strategist, growth hacker, product strategist, and salesman. You have been in the trenches of Shopify, email (Klaviyo/ConvertKit/Beehiiv), YouTube, podcasts, paid coaching, info products, consultations, and agency services. You speak in specifics, not buzzwords.

Your operating principles:
- Revenue leverage first. Ask "what will move the P&L the most this month?" before anything else.
- Ground every recommendation in the founder's actual assets, audience, and constraints. No recommendations that require capital or team they don't have.
- Name real channels, tools, platforms, price points, and numbers.
- Never write "consider X", "you could explore Y", or "it might be worth thinking about Z". Pick a direction and commit.
- If a section has no strong answer given the inputs, say so explicitly as the first item — don't pad.
- Read like a brief from a founder's chief of staff, not a marketing textbook.

Output format: a single JSON object matching the schema provided in the user message. No preamble, no markdown fences, no commentary.`;

const sectionsSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
  },
  required: ["sections"],
  additionalProperties: false,
};

function buildUserPrompt(brief: Required<RevenueBrief>): string {
  return `A founder has given you their context. Produce the deliverable below.

FOUNDER CONTEXT
- Business: ${brief.businessName}
- Main revenue goal (next 30–90 days): ${brief.mainRevenueGoal}
- Target audience: ${brief.targetAudience}
- What they sell today: ${brief.existingOffers}
- Current book (on Shopify): ${brief.currentBook || "none / not mentioned"}
- Available assets (audience size, content library, relationships, capital): ${brief.availableAssets || "not specified"}
- Founder's strengths: ${brief.strengths || "not specified"}
- Preferred channels: ${brief.preferredChannels || "not specified"}
- Constraints (time, budget, team): ${brief.constraints || "not specified"}
- Notes: ${brief.notes || "none"}

OUTPUT FORMAT — return a JSON object with a "sections" array containing EXACTLY these 12 sections, in this order:

1.  { "title": "Executive Revenue Priority", "body": "3–5 sentences naming the single most important revenue lever for the next 30 days and the reasoning." }
2.  { "title": "Best Thing to Sell First", "body": "3–4 sentences naming the ONE offer to push first and why — grounded in their current assets." }
3.  { "title": "Book Sales Plan", "items": ["specific tactic — expected impact", "..."] }   // 5–8 tactics to move the existing book on Shopify
4.  { "title": "Consultation Growth Plan", "items": ["specific tactic — how it drives paid calls", "..."] }   // 5–8 tactics
5.  { "title": "Lead Magnet Opportunities", "items": ["lead magnet idea — who it captures — where to gate it", "..."] }   // 4–6
6.  { "title": "New Digital Product Ideas", "items": ["product concept — price point — why it would sell", "..."] }   // 3–5
7.  { "title": "Organic Distribution Plan", "items": ["channel — specific play — cadence", "..."] }   // 5–8, name real platforms/communities
8.  { "title": "Email Capture / Nurture Direction", "items": ["tactic — role in the funnel", "..."] }   // 4–6
9.  { "title": "Sales Angles and Offer Framing", "items": ["angle / hook — when to use it", "..."] }   // 5–7
10. { "title": "Execution Recommendations", "items": ["concrete build / tool / system — why it matters", "..."] }   // 4–6
11. { "title": "7-Day Action Plan", "items": ["Day 1 — ...", "Day 2 — ...", "Day 3 — ...", "Day 4 — ...", "Day 5 — ...", "Day 6 — ...", "Day 7 — ..."] }   // exactly 7, one per day
12. { "title": "30-Day Growth Focus", "items": ["Week 1 — objective — expected outcome", "Week 2 — ...", "Week 3 — ...", "Week 4 — ..."] }   // exactly 4, one per week

Rules:
- Use the founder's actual products, audience, and channels as anchors. Don't invent business facts.
- If a section genuinely doesn't apply (e.g. no book → the Book Sales Plan would be padding), make the first item: "Skip — [specific reason]" instead of fabricating tactics.
- Keep items tight and scannable (one line each when possible).
- Respond with the JSON object only — no preamble, no markdown fences.`;
}

function normalizeSections(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s): Section | null => {
      if (!s || typeof s !== "object") return null;
      const obj = s as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      if (!title) return null;
      const body = typeof obj.body === "string" ? obj.body.trim() : undefined;
      const items = Array.isArray(obj.items)
        ? obj.items
            .filter((x): x is string => typeof x === "string")
            .map((x) => x.trim())
            .filter(Boolean)
        : undefined;
      if (!body && (!items || items.length === 0)) return null;
      return { title, body, items };
    })
    .filter((s): s is Section => s !== null);
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: RevenueBrief;
  try {
    body = (await req.json()) as RevenueBrief;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { businessName, existingOffers, targetAudience, mainRevenueGoal } =
    body;

  if (!businessName || !existingOffers || !targetAudience || !mainRevenueGoal) {
    return NextResponse.json(
      {
        error:
          "businessName, existingOffers, targetAudience, and mainRevenueGoal are required.",
      },
      { status: 400 }
    );
  }

  const brief: Required<RevenueBrief> = {
    businessName,
    existingOffers,
    targetAudience,
    mainRevenueGoal,
    currentBook: body.currentBook ?? "",
    preferredChannels: body.preferredChannels ?? "",
    strengths: body.strengths ?? "",
    availableAssets: body.availableAssets ?? "",
    constraints: body.constraints ?? "",
    notes: body.notes ?? "",
  };

  try {
    const response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: sectionsSchema },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(brief) }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    if (!textBlock) {
      return NextResponse.json(
        { error: "Model response contained no text block." },
        { status: 502 }
      );
    }

    let parsed: { sections?: unknown };
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Please try again." },
        { status: 502 }
      );
    }

    const sections = normalizeSections(parsed?.sections);
    if (sections.length === 0) {
      return NextResponse.json(
        { error: "Model returned no usable sections. Please try again." },
        { status: 502 }
      );
    }

    const result: AgentResponse = { businessName, sections };
    try {
      const briefId = saveBrief({
        businessName,
        mainRevenueGoal,
        brief,
        response: result,
      });
      saveActionsFromSections(briefId, sections);
    } catch (e) {
      console.error("Failed to persist brief:", e);
    }
    return NextResponse.json(result);
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
          err instanceof Error
            ? err.message
            : "Unknown error running the agent.",
      },
      { status: 500 }
    );
  }
}
