"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Section = { title: string; body?: string; items?: string[] };
type AgentResponse = { businessName: string; sections: Section[] };

type FormState = {
  businessName: string;
  existingOffers: string;
  currentBook: string;
  targetAudience: string;
  mainRevenueGoal: string;
  preferredChannels: string;
  strengths: string;
  availableAssets: string;
  constraints: string;
  notes: string;
};

const initialForm: FormState = {
  businessName: "",
  existingOffers: "",
  currentBook: "",
  targetAudience: "",
  mainRevenueGoal: "",
  preferredChannels: "",
  strengths: "",
  availableAssets: "",
  constraints: "",
  notes: "",
};

const specialists = [
  { label: "Revenue Strategist", tone: "text-violet-300" },
  { label: "Product", tone: "text-fuchsia-300" },
  { label: "Organic Growth", tone: "text-cyan-300" },
  { label: "Sales", tone: "text-amber-300" },
  { label: "Execution", tone: "text-emerald-300" },
];

export default function RevenueAgentPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentResponse | null>(null);

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run-revenue-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : `Request failed (${res.status}).`
        );
        return;
      }
      if (!data?.businessName || !Array.isArray(data?.sections)) {
        setError("Unexpected response from the server.");
        return;
      }
      setResult(data as AgentResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Revenue agent
        </div>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Grow revenue, not noise
        </h1>
        <p className="mt-2 max-w-xl text-white/60">
          Tell the agent about your business, audience, and constraints. It
          thinks like a chief of staff — synthesizing strategy, product, growth,
          sales, and execution into one commercially useful plan.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {specialists.map((s) => (
            <span
              key={s.label}
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium ${s.tone}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {s.label}
            </span>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <SectionTitle>Business basics</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <Field
              label="Business name"
              name="businessName"
              value={form.businessName}
              onChange={updateField}
              placeholder="e.g. Baraa's Growth Studio"
              required
            />
            <TextareaField
              label="Main revenue goal"
              name="mainRevenueGoal"
              value={form.mainRevenueGoal}
              onChange={updateField}
              placeholder="e.g. Hit $15k/mo in combined book + consultation revenue over the next 60 days"
              required
            />
            <TextareaField
              label="Target audience"
              name="targetAudience"
              value={form.targetAudience}
              onChange={updateField}
              placeholder="Who buys from you today and who you want to reach next — demographics, psychographics, where they hang out."
              required
            />
          </div>
        </section>

        <section>
          <SectionTitle>What you already have</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <TextareaField
              label="Existing offers"
              name="existingOffers"
              value={form.existingOffers}
              onChange={updateField}
              placeholder="Everything you currently sell — book, course, consultations, agency services, price points."
              required
            />
            <TextareaField
              label="Current book (on Shopify)"
              name="currentBook"
              value={form.currentBook}
              onChange={updateField}
              placeholder="Title, topic, price, any current monthly sales / traffic figures."
            />
            <TextareaField
              label="Available assets"
              name="availableAssets"
              value={form.availableAssets}
              onChange={updateField}
              placeholder="Audience size (IG/YT/email), content library, testimonials, relationships, capital."
            />
            <TextareaField
              label="Founder's strengths"
              name="strengths"
              value={form.strengths}
              onChange={updateField}
              placeholder="What you're great at — writing, video, one-to-one, selling, systems, design…"
            />
          </div>
        </section>

        <section>
          <SectionTitle>Preferences & constraints</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <Field
              label="Preferred channels"
              name="preferredChannels"
              value={form.preferredChannels}
              onChange={updateField}
              placeholder="e.g. Instagram, YouTube, email, podcasts"
            />
            <TextareaField
              label="Constraints"
              name="constraints"
              value={form.constraints}
              onChange={updateField}
              placeholder="Time per week, budget, team size, anything off-limits (e.g. no paid ads this month)."
            />
            <TextareaField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="Anything else the agent should know."
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Thinking through it…" : "Run revenue agent"}
            {!loading && <span>→</span>}
          </button>
          {loading && (
            <span className="text-sm text-white/50">
              Usually 15–30 seconds — it&apos;s consulting five specialists.
            </span>
          )}
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-10 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100"
        >
          <div className="font-semibold">Run failed</div>
          <div className="mt-1 text-red-200/90">{error}</div>
        </div>
      )}

      {result && <ResultPanel result={result} />}
    </div>
  );
}

function ResultPanel({ result }: { result: AgentResponse }) {
  const [hero, subHero, ...rest] = result.sections;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-14 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="text-xs uppercase tracking-[0.2em] text-white/40">
          Revenue plan · {result.businessName}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {hero && <HeroCard section={hero} accent="violet" delay={0} />}
      {subHero && <HeroCard section={subHero} accent="cyan" delay={0.04} />}

      <div className="grid gap-5 lg:grid-cols-2">
        {rest.map((section, i) => (
          <SectionCard key={`${section.title}-${i}`} section={section} i={i} />
        ))}
      </div>
    </motion.section>
  );
}

function HeroCard({
  section,
  accent,
  delay,
}: {
  section: Section;
  accent: "violet" | "cyan";
  delay: number;
}) {
  const glow =
    accent === "violet"
      ? "from-violet-500/30 via-fuchsia-500/20 to-transparent"
      : "from-cyan-500/30 via-emerald-500/20 to-transparent";
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
    >
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${glow} blur-2xl`}
      />
      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {section.title}
        </div>
        {section.body && (
          <p className="mt-3 text-lg leading-8 text-white/85">{section.body}</p>
        )}
        {section.items && section.items.length > 0 && (
          <ul className="mt-3 space-y-2">
            {section.items.map((item, j) => (
              <li
                key={j}
                className="flex gap-2 text-base leading-7 text-white/80"
              >
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

function SectionCard({ section, i }: { section: Section; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.04 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70" />
      <h3 className="text-lg font-semibold text-white">{section.title}</h3>
      {section.body && (
        <p className="mt-3 text-sm leading-6 text-white/75">{section.body}</p>
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
    </motion.article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <div className="h-px w-6 bg-white/25" />
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
        {required && <span className="ml-1 text-violet-400">*</span>}
      </span>
      <input
        {...props}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function TextareaField({
  label,
  required,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
        {required && <span className="ml-1 text-violet-400">*</span>}
      </span>
      <textarea
        {...props}
        required={required}
        className="min-h-[110px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
      />
    </label>
  );
}
