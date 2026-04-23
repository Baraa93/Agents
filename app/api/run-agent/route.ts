import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

type ServiceType = "strategy" | "content" | "ads";

type ClientBrief = {
  clientName?: string;
  website?: string;
  industry?: string;
  market?: string;
  serviceType?: ServiceType;
  businessGoal?: string;
  targetAudience?: string;
  offer?: string;
  notes?: string;
};

type Normalized = Required<
  Pick<
    ClientBrief,
    | "clientName"
    | "industry"
    | "market"
    | "serviceType"
    | "businessGoal"
    | "targetAudience"
  >
> &
  Pick<ClientBrief, "website" | "offer" | "notes">;

type Section = {
  title: string;
  body?: string;
  items?: string[];
};

type AgentResponse = {
  agent: ServiceType;
  clientName: string;
  sections: Section[];
};

const MODEL = "claude-opus-4-7";

const SERVICES: Record<
  ServiceType,
  { persona: string; structure: string }
> = {
  strategy: {
    persona: "a senior marketing strategist at a digital agency",
    structure: `Produce a JSON object with a "sections" array containing EXACTLY these sections in this order:
1. { "title": "Brand & Business Overview", "body": "2-3 sentence summary" }
2. { "title": "Positioning Direction", "body": "2-4 sentences with a clear, opinionated positioning angle" }
3. { "title": "Target Audience Summary", "body": "2-3 sentence profile" }
4. { "title": "Core Funnel Outline", "items": ["stage — what happens here", ...] }
5. { "title": "Recommended Channels", "items": ["channel — why it fits this client", ...] }
6. { "title": "KPIs to Watch", "items": ["KPI — target/benchmark", ...] }
7. { "title": "Key Next Steps", "items": ["concrete action this week", ...] }`,
  },
  content: {
    persona: "a senior content strategist at a digital marketing agency",
    structure: `Produce a JSON object with a "sections" array containing EXACTLY these sections in this order:
1. { "title": "Content Pillars", "items": ["pillar — short description", ...] } (3-5 pillars)
2. { "title": "10 Content Ideas", "items": ["idea 1", ..., "idea 10"] } (exactly 10)
3. { "title": "Hooks & Post Angles", "items": ["hook", ...] } (6-10 hooks)
4. { "title": "Tone Suggestions", "body": "2-3 sentences describing voice, tone, pacing" }
5. { "title": "CTA Suggestions", "items": ["CTA line", ...] } (5-8 CTAs)`,
  },
  ads: {
    persona: "a senior paid media strategist at a digital marketing agency",
    structure: `Produce a JSON object with a "sections" array containing EXACTLY these sections in this order:
1. { "title": "Campaign Objective Recommendation", "body": "recommended objective and why it fits the goal" }
2. { "title": "Funnel Structure", "items": ["stage — placement/asset", ...] }
3. { "title": "Audience Suggestions", "items": ["audience — reasoning", ...] }
4. { "title": "Creative Angle Ideas", "items": ["angle — hook", ...] }
5. { "title": "Offer Suggestions", "items": ["offer — why it converts", ...] }
6. { "title": "KPI / Tracking Recommendations", "items": ["KPI — benchmark or tool", ...] }`,
  },
};

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

function buildUserPrompt(brief: Normalized) {
  const cfg = SERVICES[brief.serviceType];
  return `A new client brief just landed. Produce a deliverable the account team can act on today.

CLIENT BRIEF
- Client: ${brief.clientName}
- Website: ${brief.website || "not provided"}
- Industry: ${brief.industry}
- Market: ${brief.market}
- Business goal: ${brief.businessGoal}
- Target audience (as provided): ${brief.targetAudience}
- Current offer: ${brief.offer || "not provided"}
- Notes: ${brief.notes || "none"}

OUTPUT FORMAT
${cfg.structure}

RULES
- Be specific to this client, industry, and market. No generic platitudes.
- Prefer concrete numbers, tools, channels, and examples over vague advice.
- Keep each item tight and scannable (one line when possible).`;
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

  let body: ClientBrief;
  try {
    body = (await req.json()) as ClientBrief;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    serviceType,
    clientName,
    industry,
    market,
    businessGoal,
    targetAudience,
  } = body;

  if (!serviceType || !(serviceType in SERVICES)) {
    return NextResponse.json(
      { error: "serviceType must be one of: strategy, content, ads." },
      { status: 400 }
    );
  }
  if (!clientName || !industry || !market || !businessGoal || !targetAudience) {
    return NextResponse.json(
      {
        error:
          "clientName, industry, market, businessGoal, and targetAudience are required.",
      },
      { status: 400 }
    );
  }

  const brief: Normalized = {
    clientName,
    industry,
    market,
    serviceType,
    businessGoal,
    targetAudience,
    website: body.website,
    offer: body.offer,
    notes: body.notes,
  };

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: sectionsSchema },
      },
      system: SERVICES[serviceType].persona,
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

    const result: AgentResponse = {
      agent: serviceType,
      clientName,
      sections,
    };
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
          err instanceof Error ? err.message : "Unknown error running agent.",
      },
      { status: 500 }
    );
  }
}
