import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type Body = {
  projectName?: string;
  idea?: string;
  targetUsers?: string;
  coreGoal?: string;
  preferredStack?: string;
};

type Normalized = {
  projectName: string;
  idea: string;
  targetUsers: string;
  coreGoal: string;
  preferredStack: string;
};

const MODEL = "gpt-4o-mini";

function taskPlanPrompt(b: Normalized) {
  return `You are a senior product engineer. Produce a concrete, actionable TASK PLAN in Markdown for shipping the first working version of this product.

Project: ${b.projectName}
Idea: ${b.idea}
Target users: ${b.targetUsers}
Core goal: ${b.coreGoal}
Preferred stack: ${b.preferredStack || "not specified"}

Format:
- A 2–3 sentence intro paragraph
- Phased milestones (Phase 1 — MVP, Phase 2, Phase 3) each with a checkbox task list
- Each task: imperative tense, one line, concrete
- A short "Risks & unknowns" section at the end

Use tight, specific language. No filler.`;
}

function constitutionPrompt(b: Normalized) {
  return `You are writing the PROJECT CONSTITUTION for a new product — a living document that captures the principles, guardrails, and non-negotiables the team commits to.

Project: ${b.projectName}
Idea: ${b.idea}
Target users: ${b.targetUsers}
Core goal: ${b.coreGoal}
Preferred stack: ${b.preferredStack || "not specified"}

Structure in Markdown with these sections:
1. Purpose — one paragraph on why this product exists
2. Principles — 5–7 bulleted product/engineering principles specific to this idea
3. Non-goals — what this product will NOT try to be
4. Decision framework — how tradeoffs are resolved
5. Definition of done — what "shipped" means here

Be opinionated. Tailor to the specific product.`;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { projectName, idea, targetUsers, coreGoal, preferredStack = "" } =
    body;

  if (!projectName || !idea || !targetUsers || !coreGoal) {
    return NextResponse.json(
      {
        error:
          "projectName, idea, targetUsers, and coreGoal are required fields.",
      },
      { status: 400 }
    );
  }

  const normalized: Normalized = {
    projectName,
    idea,
    targetUsers,
    coreGoal,
    preferredStack,
  };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const [taskPlanRes, constRes] = await Promise.all([
      openai.chat.completions.create({
        model: MODEL,
        temperature: 0.5,
        messages: [{ role: "user", content: taskPlanPrompt(normalized) }],
      }),
      openai.chat.completions.create({
        model: MODEL,
        temperature: 0.5,
        messages: [{ role: "user", content: constitutionPrompt(normalized) }],
      }),
    ]);

    const taskPlan = taskPlanRes.choices[0]?.message?.content?.trim() ?? "";
    const projectConstitution =
      constRes.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ taskPlan, projectConstitution });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error generating project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
