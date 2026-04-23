"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ServiceType = "strategy" | "content" | "ads";

type Section = { title: string; body?: string; items?: string[] };
type AgentResponse = {
  agent: ServiceType;
  clientName: string;
  sections: Section[];
};

type FormState = {
  clientName: string;
  website: string;
  industry: string;
  market: string;
  serviceType: ServiceType;
  businessGoal: string;
  targetAudience: string;
  offer: string;
  notes: string;
};

const initialForm: FormState = {
  clientName: "",
  website: "",
  industry: "",
  market: "",
  serviceType: "strategy",
  businessGoal: "",
  targetAudience: "",
  offer: "",
  notes: "",
};

const services: Array<{
  id: ServiceType;
  title: string;
  description: string;
  gradient: string;
}> = [
  {
    id: "strategy",
    title: "Strategy Agent",
    description:
      "Positioning, funnel, channels, KPIs — end-to-end direction.",
    gradient: "from-violet-400/40 via-fuchsia-400/30 to-cyan-400/30",
  },
  {
    id: "content",
    title: "Content Agent",
    description: "Pillars, 10 ideas, hooks, tone, and CTAs ready to ship.",
    gradient: "from-cyan-400/40 via-emerald-400/30 to-violet-400/30",
  },
  {
    id: "ads",
    title: "Ads Agent",
    description: "Objective, funnel, audiences, angles, offers, tracking.",
    gradient: "from-fuchsia-400/40 via-amber-400/30 to-violet-400/30",
  },
];

function isServiceType(v: string | null): v is ServiceType {
  return v === "strategy" || v === "content" || v === "ads";
}

export default function NewClientPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentResponse | null>(null);

  // Pre-select agent via ?service= query param
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get("service");
    if (isServiceType(svc)) {
      setForm((f) => ({ ...f, serviceType: svc }));
    }
  }, []);

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const selectService = (id: ServiceType) => {
    setForm((f) => ({ ...f, serviceType: id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run-agent", {
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

      if (!data?.agent || !Array.isArray(data?.sections)) {
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

  const selectedService =
    services.find((s) => s.id === form.serviceType) ?? services[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
      <header className="mb-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Client intake
        </div>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">
          New client brief
        </h1>
        <p className="mt-2 max-w-xl text-white/60">
          Drop the essentials, pick an agent, and get a concrete deliverable
          your team can act on today.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-white/70">
            Service
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {services.map((s) => {
              const active = form.serviceType === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectService(s.id)}
                  aria-pressed={active}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-white/25 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.gradient} blur-2xl transition ${
                      active
                        ? "opacity-100"
                        : "opacity-40 group-hover:opacity-70"
                    }`}
                  />
                  <div className="relative flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full transition ${
                        active ? "bg-white" : "bg-white/30"
                      }`}
                    />
                    <span className="font-semibold">{s.title}</span>
                  </div>
                  <p className="relative mt-2 text-sm text-white/60">
                    {s.description}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Client name"
            name="clientName"
            value={form.clientName}
            onChange={updateField}
            placeholder="Acme Co."
            required
          />
          <Field
            label="Website"
            name="website"
            value={form.website}
            onChange={updateField}
            placeholder="https://acme.com"
            type="url"
          />
          <Field
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={updateField}
            placeholder="DTC skincare"
            required
          />
          <Field
            label="Market"
            name="market"
            value={form.market}
            onChange={updateField}
            placeholder="US / UAE / EU"
            required
          />
        </div>

        <TextareaField
          label="Business goal"
          name="businessGoal"
          value={form.businessGoal}
          onChange={updateField}
          placeholder="What does the client want out of the next 90 days?"
          required
        />
        <TextareaField
          label="Target audience"
          name="targetAudience"
          value={form.targetAudience}
          onChange={updateField}
          placeholder="Who are they trying to reach? Demographics, psychographics, pain points."
          required
        />
        <TextareaField
          label="Current offer"
          name="offer"
          value={form.offer}
          onChange={updateField}
          placeholder="What's the main product, service, or offer?"
        />
        <TextareaField
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={updateField}
          placeholder="Anything else the agent should know — constraints, past campaigns, tone of voice."
        />

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Running agent…" : `Run ${selectedService.title}`}
            {!loading && <span>→</span>}
          </button>
          {loading && (
            <span className="text-sm text-white/50">
              Usually 5–15 seconds…
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
  const label =
    result.agent === "strategy"
      ? "Strategy"
      : result.agent === "content"
        ? "Content"
        : "Ads";

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
          {label} output · {result.clientName}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {result.sections.map((section, i) => (
          <motion.article
            key={`${section.title}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
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
          </motion.article>
        ))}
      </div>
    </motion.section>
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
