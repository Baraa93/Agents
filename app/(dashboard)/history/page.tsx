import Link from "next/link";
import { listBriefs } from "@/app/_lib/db";

export const dynamic = "force-dynamic";

function formatWhen(iso: string): string {
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: now.getFullYear() === d.getFullYear() ? undefined : "numeric",
  });
}

export default function HistoryPage() {
  const briefs = listBriefs();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            History
          </div>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Past revenue briefs
          </h1>
          <p className="mt-2 max-w-xl text-white/60">
            Every brief you&apos;ve run, with the plan the agent returned.
          </p>
        </div>
        <Link
          href="/revenue-agent"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:scale-[1.02]"
        >
          + New brief
        </Link>
      </header>

      {briefs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h3 className="text-sm font-semibold text-white">No briefs yet</h3>
          <p className="mt-1 text-sm text-white/50">
            Run your first brief and it&apos;ll show up here.
          </p>
          <Link
            href="/revenue-agent"
            className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
          >
            Create a brief →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {briefs.map((b) => (
            <li key={b.id}>
              <Link
                href={`/history/${b.id}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-white/45">
                      <span className="font-mono">#{b.id}</span>
                      <span>·</span>
                      <span>{formatWhen(b.created_at)}</span>
                    </div>
                    <div className="mt-1.5 truncate text-base font-semibold text-white">
                      {b.business_name}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-white/60">
                      {b.main_revenue_goal}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
