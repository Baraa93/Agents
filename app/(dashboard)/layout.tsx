"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SVGProps } from "react";

type Icon = (props: SVGProps<SVGSVGElement>) => ReactNode;

type NavItem = {
  label: string;
  href?: string;
  icon: Icon;
  soon?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: IconDash },
  { label: "Revenue agent", href: "/revenue-agent", icon: IconSpark },
  { label: "History", href: "/history", icon: IconRuns },
  { label: "Agency intake", href: "/new-client", icon: IconUsers },
  { label: "Settings", icon: IconGear, soon: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen text-white">
      <DashboardBackground />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/5 bg-[#0a0a10]/80 backdrop-blur-xl lg:flex">
        <div className="px-5 pb-8 pt-6">
          <Logo />
        </div>

        <div className="px-3 pb-3">
          <Link
            href="/revenue-agent"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <IconSpark className="h-4 w-4" />
            Run revenue agent
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-2">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.href === pathname;
              const Icon = item.icon;
              if (item.soon) {
                return (
                  <li key={item.label}>
                    <div className="flex cursor-default items-center justify-between rounded-lg px-3 py-2 text-sm text-white/30">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/40">
                        Soon
                      </span>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3">
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-white">
                Your agency
              </div>
              <div className="truncate text-[11px] text-white/40">
                Signed in
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-[#0a0a10]/85 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <Link
          href="/revenue-agent"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black"
        >
          <IconSpark className="h-3.5 w-3.5" />
          Run agent
        </Link>
      </div>

      <main className="relative flex-1 pt-14 lg:pl-[240px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400" />
        <div className="absolute inset-[3px] rounded-[5px] bg-[#0a0a10]" />
        <div className="absolute inset-[5px] rounded-[3px] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Agents
      </span>
    </div>
  );
}

function DashboardBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#07070b]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% -10%, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% -10%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
    </div>
  );
}

function IconDash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13A4 4 0 0 1 16 11" />
    </svg>
  );
}
function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}
function IconRuns(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}
function IconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
