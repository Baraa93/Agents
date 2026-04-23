"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const specialists = [
  {
    title: "Revenue Strategist",
    desc: "Prioritizes what moves the P&L this month — ROI over vanity.",
    gradient: "from-violet-400/50 via-fuchsia-400/30 to-cyan-400/30",
  },
  {
    title: "Product",
    desc: "Packages books, courses, consultations, cohorts, and info products.",
    gradient: "from-fuchsia-400/50 via-pink-400/30 to-violet-400/30",
  },
  {
    title: "Organic Growth",
    desc: "SEO, social, newsletters, communities — real channels, real plays.",
    gradient: "from-cyan-400/50 via-emerald-400/30 to-violet-400/30",
  },
  {
    title: "Sales",
    desc: "Angles, hooks, offer framing, pricing anchors, value stacking.",
    gradient: "from-amber-400/50 via-orange-400/30 to-fuchsia-400/30",
  },
  {
    title: "Execution",
    desc: "Concrete, time-boxed actions you ship this week — no team required.",
    gradient: "from-emerald-400/50 via-cyan-400/30 to-violet-400/30",
  },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-white/45">{today}</div>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Revenue control room
          </h1>
          <p className="mt-2 max-w-xl text-white/60">
            One agent. Five specialists under the hood. Tell it about your
            business and get a commercially useful plan in minutes.
          </p>
        </div>
        <Link
          href="/revenue-agent"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:scale-[1.02]"
        >
          Run revenue agent
          <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </header>

      {/* Hero CTA card */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <Link
          href="/revenue-agent"
          className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 backdrop-blur-xl transition hover:from-white/[0.08]"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-400/30 opacity-70 blur-3xl transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-500/25 to-violet-500/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Start here
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Brief the Revenue Agent.
            </h2>
            <p className="mt-3 text-white/65">
              Drop in your business, offers, audience, and constraints. The
              agent internally consults a revenue strategist, product agent,
              organic growth agent, sales agent, and execution agent — and
              returns one synthesized plan: best thing to sell first, book
              sales plan, lead magnets, 7-day actions, 30-day focus.
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-white">
              Open the brief
              <span className="transition group-hover:translate-x-0.5">→</span>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* Stats */}
      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue sessions"
          value="—"
          hint="Connect persistence to track"
        />
        <StatCard
          label="Active offers"
          value="—"
          hint="Book, consultations, services…"
        />
        <StatCard
          label="Avg. session"
          value="~20s"
          hint="Per revenue brief"
        />
      </section>

      {/* Under-the-hood */}
      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-white">
            Under the hood
          </h2>
          <span className="text-xs text-white/40">
            Five specialist lenses, one voice
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {specialists.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${s.gradient} opacity-60 blur-2xl`}
              />
              <div className="relative">
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secondary tools */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-white">
            Agency tools
          </h2>
          <span className="text-xs text-white/40">Client work</span>
        </div>
        <Link
          href="/new-client"
          className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">
                Agency client intake
              </div>
              <p className="mt-1 text-sm text-white/55">
                The older per-service flow — Strategy, Content, or Ads — for
                when you&apos;re doing client work rather than your own.
              </p>
            </div>
            <span className="text-sm text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white">
              Open →
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/40">{hint}</div>
    </div>
  );
}
