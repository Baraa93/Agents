"use client";

import { useState } from "react";

export default function NewProjectPage() {
  const [form, setForm] = useState({
    projectName: "",
    idea: "",
    targetUsers: "",
    coreGoal: "",
    preferredStack: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | {
    taskPlan: string;
    projectConstitution: string;
  }>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (
        typeof data?.taskPlan !== "string" ||
        typeof data?.projectConstitution !== "string"
      ) {
        setError("The server returned an unexpected response.");
        return;
      }

      setResult({
        taskPlan: data.taskPlan,
        projectConstitution: data.projectConstitution,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold">Create a New Project</h1>
        <p className="mt-3 text-white/70">
          Turn an idea into a task plan and project constitution.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/70">Project Name</label>
            <input
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              placeholder="Agents"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Idea</label>
            <textarea
              name="idea"
              value={form.idea}
              onChange={handleChange}
              className="min-h-[140px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              placeholder="Describe your product idea..."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Target Users</label>
            <input
              name="targetUsers"
              value={form.targetUsers}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              placeholder="Startup founders, marketers, builders..."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Core Goal</label>
            <input
              name="coreGoal"
              value={form.coreGoal}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              placeholder="Turn ideas into production-ready systems"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Preferred Stack</label>
            <input
              name="preferredStack"
              value={form.preferredStack}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              placeholder="Next.js, Supabase, OpenAI, Vercel"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Project"}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            <div className="font-semibold text-red-100">
              Generation failed
            </div>
            <div className="mt-1 text-red-200/90">{error}</div>
          </div>
        )}

        {result && (
          <div className="mt-12 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Task Plan</h2>
              <pre className="mt-4 whitespace-pre-wrap text-sm text-white/80">
                {result.taskPlan}
              </pre>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Project Constitution</h2>
              <pre className="mt-4 whitespace-pre-wrap text-sm text-white/80">
                {result.projectConstitution}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
