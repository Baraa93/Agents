"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/* Background — animated glows + faint grid                            */
/* ------------------------------------------------------------------ */
function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#07070b]" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black 35%, transparent 75%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-600/40 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0.25 }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full bg-cyan-500/30 blur-[140px]"
      />
      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-[-200px] left-1/3 h-[600px] w-[600px] rounded-full bg-fuchsia-600/25 blur-[160px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400" />
        <div className="absolute inset-[3px] rounded-[5px] bg-[#07070b]" />
        <div className="absolute inset-[5px] rounded-[3px] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Agents
      </span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
      </span>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
function Nav() {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(1100px,95vw)] -translate-x-1/2">
      <nav className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <Logo />
        <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <a className="transition hover:text-white" href="#framework">
            Framework
          </a>
          <a className="transition hover:text-white" href="#architecture">
            Architecture
          </a>
          <a className="transition hover:text-white" href="#swarm">
            Swarm
          </a>
          <a className="transition hover:text-white" href="#cta">
            Pricing
          </a>
        </div>
        <a
          href="#cta"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Get started
          <span className="transition group-hover:translate-x-0.5">→</span>
        </a>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-36 sm:pt-44">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid items-center gap-14 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.div variants={fadeUp}>
            <Pill>New · Agents v1.0 — shipping soon</Pill>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            An operating system for building{" "}
            <span className="bg-gradient-to-br from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              beautiful
            </span>
            ,{" "}
            <span className="bg-gradient-to-br from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
              functional AI products
            </span>{" "}
            — faster.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-8 text-white/65"
          >
            Agents is the end-to-end framework for AI builders. Research,
            architect, style, and ship production-grade agent systems without
            the plumbing.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:scale-[1.02]"
            >
              Start building free
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#framework"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <PlayIcon /> Watch the 2 min demo
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center gap-5 text-xs text-white/40"
          >
            <div>Trusted by teams at</div>
            <div className="flex flex-wrap items-center gap-5 font-medium text-white/55">
              <span>Linear</span>
              <span>Vercel</span>
              <span>Anthropic</span>
              <span>Figma</span>
              <span>Ramp</span>
            </div>
          </motion.div>
        </div>

        {/* 3D card stack */}
        <div className="relative lg:col-span-5">
          <div
            className="relative mx-auto h-[440px] w-full max-w-[480px]"
            style={{ perspective: "1200px" }}
          >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-400/30 blur-3xl" />
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-6 w-[280px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(-6deg) rotateY(12deg)",
              }}
            >
              <MiniAgentCard variant="blueprint" />
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { y: [0, 10, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="absolute right-0 top-1/2 w-[280px] -translate-y-1/2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(6deg) rotateY(-10deg)",
              }}
            >
              <MiniAgentCard variant="run" />
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="absolute bottom-0 left-12 w-[280px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(-10deg) rotateY(6deg)",
              }}
            >
              <MiniAgentCard variant="style" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MiniAgentCard({
  variant,
}: {
  variant: "blueprint" | "run" | "style";
}) {
  if (variant === "blueprint") {
    return (
      <div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          blueprint.md
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-3/4 rounded bg-white/10" />
          <div className="h-2 w-5/6 rounded bg-white/10" />
          <div className="h-2 w-2/3 rounded bg-white/10" />
          <div className="h-2 w-1/2 rounded bg-gradient-to-r from-violet-400/70 to-fuchsia-400/40" />
        </div>
      </div>
    );
  }
  if (variant === "run") {
    return (
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">agent.run()</span>
          <span className="text-emerald-400">● active</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-[11px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            researcher · parsing sources
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-[11px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
            architect · drafting plan
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-[11px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
            builder · writing code
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-xs text-white/50">style.theme</div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {["#8b5cf6", "#22d3ee", "#f472b6", "#fde68a", "#34d399"].map((c) => (
          <div
            key={c}
            className="aspect-square rounded-md"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-6 w-16 rounded-full bg-white text-center text-[10px] leading-6 text-black">
          Primary
        </div>
        <div className="h-6 w-16 rounded-full border border-white/15 text-center text-[10px] leading-6 text-white/70">
          Ghost
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Framework (Blueprint / Link / Architect / Style / Trigger)          */
/* ------------------------------------------------------------------ */
const frameworkSteps = [
  {
    n: "01",
    title: "Blueprint",
    desc: "Turn intent into a structured spec. Define goals, inputs, outputs, and guardrails before a line of code.",
  },
  {
    n: "02",
    title: "Link",
    desc: "Wire models, tools, data, and memory. Agents resolves the connections for you.",
  },
  {
    n: "03",
    title: "Architect",
    desc: "Compose multi-agent systems with typed message flow and deterministic fallbacks.",
  },
  {
    n: "04",
    title: "Style",
    desc: "Design system, themes, motion. Ship product-grade surfaces without a designer in the loop.",
  },
  {
    n: "05",
    title: "Trigger",
    desc: "Schedule, webhook, cron, or real-time. Run agents wherever your users are.",
  },
];

function Framework() {
  return (
    <section
      id="framework"
      className="relative mx-auto w-full max-w-7xl px-6 py-28"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="mb-14 flex flex-col items-start gap-4"
      >
        <motion.div variants={fadeUp}>
          <Pill>The framework</Pill>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Five deliberate steps from idea to{" "}
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            shipped agent
          </span>
          .
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-lg text-white/60"
        >
          A repeatable playbook that replaces the chaos of hand-rolled agent
          stacks.
        </motion.p>
      </motion.div>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        {frameworkSteps.map((step, i) => (
          <motion.li
            key={step.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl ${
              i % 2 === 1 ? "lg:translate-y-6" : ""
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-400/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-white/40">{step.n}</span>
              <StepGlyph index={i} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{step.desc}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

function StepGlyph({ index }: { index: number }) {
  const common = "h-5 w-5 text-white/70";
  switch (index) {
    case 0:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M4 10h16M10 4v16" />
        </svg>
      );
    case 1:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
    case 2:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 21l9-18 9 18z" />
          <path d="M3 21h18" />
        </svg>
      );
    case 3:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      );
    case 4:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M13 2L3 14h7v8l10-12h-7z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Brain + Builder                                                     */
/* ------------------------------------------------------------------ */
function BrainBuilder() {
  const reduce = useReducedMotion();
  return (
    <section
      id="architecture"
      className="relative mx-auto w-full max-w-7xl px-6 py-28"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="mb-14 flex flex-col items-start gap-4"
      >
        <motion.div variants={fadeUp}>
          <Pill>Architecture</Pill>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Research and execution,{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
            bonded by design
          </span>
          .
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-lg text-white/60"
        >
          The Brain and the Builder operate as one mind. Context, evidence, and
          decisions flow continuously — no stitching required.
        </motion.p>
      </motion.div>

      <div className="relative grid gap-6 lg:grid-cols-2">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-28 w-40 -translate-x-1/2 -translate-y-1/2 lg:block"
          viewBox="0 0 200 140"
          fill="none"
        >
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 10 70 C 60 10, 140 130, 190 70"
            stroke="url(#beam)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 6"
            animate={reduce ? undefined : { strokeDashoffset: [0, -20] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> NotebookLM
            / Brain
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white">
            Read the world, remember the why
          </h3>
          <p className="mt-3 text-white/60">
            Ingest docs, URLs, audio, and code. The Brain builds a private
            knowledge graph your agents can reason over — with citations and
            version history.
          </p>
          <BrainNodes />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Agent
            Builder
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white">
            Turn knowledge into motion
          </h3>
          <p className="mt-3 text-white/60">
            Compile your spec into a running system. Agents writes the code,
            wires the APIs, deploys the surface, and watches it in production.
          </p>
          <BuilderPreview />
        </motion.div>
      </div>
    </section>
  );
}

function BrainNodes() {
  const nodes: [number, number][] = [
    [80, 40],
    [320, 30],
    [60, 150],
    [340, 160],
    [200, 180],
  ];
  return (
    <div className="relative mt-8 h-48">
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="brain-core">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#22d3ee" />
          </radialGradient>
        </defs>
        <g stroke="rgba(34,211,238,0.35)" strokeWidth="1">
          {nodes.map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2="200" y2="100" />
          ))}
        </g>
        {nodes.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="5"
            fill="#22d3ee"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
        <circle cx="200" cy="100" r="10" fill="url(#brain-core)" />
      </svg>
    </div>
  );
}

function BuilderPreview() {
  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[11px] leading-5 text-white/70">
      <div className="mb-3 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <div>
        <span className="text-violet-300">const</span> agent ={" "}
        <span className="text-cyan-300">createAgent</span>({"{"}
      </div>
      <div className="pl-4">
        <span className="text-fuchsia-300">name</span>:{" "}
        <span className="text-emerald-300">&quot;support-triage&quot;</span>,
      </div>
      <div className="pl-4">
        <span className="text-fuchsia-300">brain</span>: brain.knowledge,
      </div>
      <div className="pl-4">
        <span className="text-fuchsia-300">tools</span>: [linear, slack, email],
      </div>
      <div className="pl-4">
        <span className="text-fuchsia-300">style</span>: theme.agents,
      </div>
      <div>{"}"});</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Claude SWARM (Scope / Wire / Assign / Run / Merge)                  */
/* ------------------------------------------------------------------ */
const swarmSteps = [
  {
    n: "01",
    title: "Scope",
    desc: "Define the shared goal and the delta each agent owns.",
  },
  {
    n: "02",
    title: "Wire",
    desc: "Stream typed events between agents over a common bus.",
  },
  {
    n: "03",
    title: "Assign",
    desc: "Route tasks by capability, budget, and priority — dynamically.",
  },
  {
    n: "04",
    title: "Run",
    desc: "Parallel execution with back-pressure, retries, and replay.",
  },
  {
    n: "05",
    title: "Merge",
    desc: "Reconcile outputs deterministically into a single artifact.",
  },
];

function Swarm() {
  const reduce = useReducedMotion();
  return (
    <section
      id="swarm"
      className="relative mx-auto w-full max-w-7xl px-6 py-28"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="mb-14 flex flex-col items-start gap-4"
      >
        <motion.div variants={fadeUp}>
          <Pill>Claude SWARM</Pill>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          A whole team of agents,{" "}
          <span className="bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
            coordinating in lockstep
          </span>
          .
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-lg text-white/60"
        >
          When one agent isn&apos;t enough, SWARM spins up a coordinated mesh —
          then collapses the results back into a single coherent output.
        </motion.p>
      </motion.div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-white/25 to-transparent md:block" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-[54px] hidden h-[3px] w-24 bg-gradient-to-r from-transparent via-violet-400 to-transparent md:block"
          animate={reduce ? undefined : { x: ["-10%", "110%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(2px)" }}
        />
        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-5"
        >
          {swarmSteps.map((step) => (
            <motion.li
              key={step.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-400/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                  <span className="font-mono text-lg font-semibold text-white/90">
                    {step.n}
                  </span>
                </div>
              </div>
              <div className="mt-5 text-center">
                <div className="text-lg font-semibold text-white">
                  {step.title}
                </div>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  {step.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative mx-auto w-full max-w-5xl px-6 pb-32 pt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-10 text-center backdrop-blur-xl sm:p-16"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <h2 className="relative text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Build the product you see in your head.
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/60">
          Start free. Ship your first agent tonight. Scale when you&apos;re
          ready.
        </p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition hover:scale-[1.02]"
          >
            Start building free →
          </a>
          <a
            href="#"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Talk to sales →
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-white/40 sm:flex-row">
        <Logo />
        <div>© {new Date().getFullYear()} Agents. All rights reserved.</div>
        <div className="flex gap-5">
          <a className="hover:text-white" href="#">
            Privacy
          </a>
          <a className="hover:text-white" href="#">
            Terms
          </a>
          <a className="hover:text-white" href="#">
            Changelog
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <main className="relative flex-1">
        <Hero />
        <Framework />
        <BrainBuilder />
        <Swarm />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
