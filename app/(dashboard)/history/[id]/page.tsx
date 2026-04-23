import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrief } from "@/app/_lib/db";

export const dynamic = "force-dynamic";

type Section = { title: string; body?: string; items?: string[] };

type AgentResponse = {
  businessName: string;
  sections: Section[];
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

const BRIEF_LABELS: Record<keyof ParsedBrief, string> = {
  businessName: "Business",
  mainRevenueGoal: "Main revenue goal",
  targetAudience: "Target audience",
  existingOffers: "Existing offers",
  currentBook: "Current book",
  availableAssets: "Available assets",
  strengths: "Strengths",
  preferredChannels: "Preferred channels",
  constraints: "Constraints",
  notes: "Notes",
};

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const row = getBrief(id);
  if (!row) notFound();

  let brief: ParsedBrief = {};
  let response: AgentResponse = { businessName: row.business_name, sections: [] };
  try {
    brief = JSON.parse(row.brief_json);
    response = JSON.parse(row.response_json);
  } catch {
    // stored JSON is corrupt — render what we have
  }

  const date = new Date(
    row.created_at.endsWith("Z") ? row.created_at : row.created_at + "Z"
  ).toLocaleString();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
      >
        ← History
      </Link>

      <header className="mb-10 mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Brief #{row.id} · {date}
        </div>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {row.business_name}
        </h1>
        <p className="mt-2 max-w-xl text-white/60">{row.main_revenue_goal}</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-white">
          Brief inputs
        </h2>
        <dl className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          {(Object.keys(BRIEF_LABELS) as Array<keyof ParsedBrief>).map((k) => {
            const value = brief[k];
            if (!value || !value.trim()) return null;
            return (
              <div key={k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {BRIEF_LABELS[k]}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-white/75">
                  {value}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-white">Plan</h2>
        {response.sections.length === 0 ? (
          <p className="text-sm text-white/50">
            No plan data stored for this brief.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {response.sections.map((section, i) => (
              <article
                key={`${section.title}-${i}`}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70" />
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>
                {section.body && (
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {section.body}
                  </p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm leading-6 text-white/75"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
