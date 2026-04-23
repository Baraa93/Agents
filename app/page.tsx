export default function Home() {
  const pillars = [
    {
      title: "Blueprint",
      text: "Initialize project memory with a clear task plan and project constitution so every build starts with structure, not chaos.",
    },
    {
      title: "Link",
      text: "Connect your universal remotes like Supabase, Zapier, and research tools so the system can think, fetch, and act.",
    },
    {
      title: "Architect",
      text: "Build frontend and backend logic with specialized agents working in parallel instead of one slow linear flow.",
    },
    {
      title: "Style",
      text: "Apply premium UI/UX standards with sharper layouts, richer visuals, and interactions that make the product feel alive.",
    },
    {
      title: "Trigger",
      text: "Deploy fast with Vercel and prepare the system for automations, scheduled tasks, and production workflows.",
    },
  ];

  const swarm = [
    "Scope the mission into right-sized tasks",
    "Wire dependencies and unblock agents automatically",
    "Assign the right model to the right task",
    "Run in parallel and monitor conflicts early",
    "Merge, validate, and ship cleanly",
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.14),transparent_25%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.12),transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              Vibe coding for builders who want speed and standards
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Agents is the operating system for building beautiful, functional AI products faster.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              From messy ideas to production-ready workflows. Plan the system,
              connect the tools, build in parallel, upgrade the UI, and ship.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#framework"
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Explore the framework
              </a>
              <a
                href="#swarm"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See how the swarm works
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-white/50">Core idea</p>
              <h3 className="mt-2 text-2xl font-semibold">Brain + Builder</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Deep research, structured execution, deployment, and iteration —
                in one system.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-white/50">Built for</p>
              <h3 className="mt-2 text-2xl font-semibold">Speed with standards</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Not just fast shipping. Clean architecture, strong UX, and a
                process you can repeat.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-white/50">End result</p>
              <h3 className="mt-2 text-2xl font-semibold">From tractor to unicorn</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Functional is not enough. The goal is beautiful, usable, and
                production-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="framework" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            The five-step blast
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            A system to take any product from rough concept to deployable experience.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80">
                {item.title.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:px-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">
              NotebookLM connection
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Research deeply. Build directly.
            </h2>
            <p className="mt-4 leading-8 text-white/70">
              The Brain + Builder setup connects deep research with real
              execution. Extract modules, scripts, notes, comparisons, and
              structured knowledge, then turn that into something usable.
            </p>
            <div className="mt-8 grid gap-4">
              {["Install the connection", "Trigger research flows", "Turn findings into outputs", "Optimize token use with source-aware retrieval"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300/80">
              UI/UX Pro Max
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Build interfaces that look expensive.
            </h2>
            <p className="mt-4 leading-8 text-white/70">
              Great systems fail when the product looks generic. This layer
              upgrades the surface: layout patterns, visual identity,
              micro-interactions, and audits for accessibility, clarity, and SEO.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Skeleton: Bento grids, SaaS heroes, conversion sections",
                "Skin: Glassmorphism, aurora glow, modern dark mode",
                "Soul: reveals, border beams, motion, hover states",
                "Audit: fix weak UX, weak SEO, and hidden accessibility issues",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="swarm" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Claude swarm framework
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Stop using one agent like a bottleneck.
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-white/70">
              The playbook is simple: scope the mission, wire dependencies,
              assign the right models, run in parallel, and merge cleanly.
              Faster work is not enough if the output is messy. The point is
              controlled speed.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="space-y-4">
              {swarm.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-white/75">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Ready to build
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Agents helps you turn ideas into systems people can actually use.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              Plan it. Connect it. Build it. Style it. Trigger it.
              Then keep improving from a stronger foundation.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#framework"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Start with the framework
            </a>
            <a
              href="#swarm"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore the swarm
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}