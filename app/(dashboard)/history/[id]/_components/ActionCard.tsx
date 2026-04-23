"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { setActionStatus } from "@/app/_actions/actions";
import type { ActionRow, ActionStatus, DraftRow } from "@/app/_lib/db";

type Props = {
  action: ActionRow;
  briefId: number;
  initialDraft: DraftRow | null;
};

export function ActionCard({ action, briefId, initialDraft }: Props) {
  const [status, setStatus] = useState<ActionStatus>(action.status);
  const [, startTransition] = useTransition();
  const [draft, setDraft] = useState<{ output: string; created_at: string } | null>(
    initialDraft
      ? { output: initialDraft.output, created_at: initialDraft.created_at }
      : null
  );
  const [showDraft, setShowDraft] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleStatus = (next: ActionStatus) => {
    if (next === status) return;
    setStatus(next);
    startTransition(() => {
      setActionStatus(action.id, next, briefId);
    });
  };

  const handleDraft = async (regenerate = false) => {
    setGenerating(true);
    setError(null);
    if (!regenerate) setShowDraft(true);
    try {
      const res = await fetch("/api/execute-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId: action.id }),
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
      if (typeof data?.output !== "string") {
        setError("Unexpected response from server.");
        return;
      }
      setDraft({ output: data.output, created_at: new Date().toISOString() });
      setShowDraft(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard denied — silent
    }
  };

  const statusTone: Record<ActionStatus, string> = {
    open: "border-white/10",
    done: "border-emerald-400/30 bg-emerald-400/[0.04]",
    skipped: "border-white/5 opacity-60",
  };

  const taskClass =
    status === "done"
      ? "text-white/60 line-through decoration-emerald-400/40"
      : "text-white/90";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-xl transition ${statusTone[status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Day {action.day}
          </div>
          <p className={`mt-2 text-sm leading-6 ${taskClass}`}>{action.task}</p>
        </div>
        <StatusSwitch status={status} onChange={handleStatus} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!draft && !showDraft && (
          <button
            type="button"
            onClick={() => handleDraft(false)}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15 disabled:opacity-60"
          >
            {generating ? "Drafting…" : "Draft it"}
            <span>→</span>
          </button>
        )}
        {draft && (
          <>
            <button
              type="button"
              onClick={() => setShowDraft((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              {showDraft ? "Hide draft" : "Show draft"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => handleDraft(true)}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-60"
            >
              {generating ? "Regenerating…" : "Regenerate"}
            </button>
          </>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100"
        >
          {error}
        </div>
      )}

      <AnimatePresence initial={false}>
        {showDraft && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              {draft ? (
                <div className="whitespace-pre-wrap text-sm leading-6 text-white/80">
                  {draft.output}
                </div>
              ) : generating ? (
                <div className="text-sm text-white/50">
                  Drafting the deliverable…
                </div>
              ) : (
                <div className="text-sm text-white/50">No draft yet.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function StatusSwitch({
  status,
  onChange,
}: {
  status: ActionStatus;
  onChange: (next: ActionStatus) => void;
}) {
  const options: Array<{ id: ActionStatus; label: string; cls: string }> = [
    { id: "open", label: "Open", cls: "text-white/70" },
    { id: "done", label: "Done", cls: "text-emerald-300" },
    { id: "skipped", label: "Skip", cls: "text-white/40" },
  ];
  return (
    <div className="flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5">
      {options.map((opt) => {
        const active = status === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
              active ? `bg-white/10 ${opt.cls}` : "text-white/40 hover:text-white/70"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
