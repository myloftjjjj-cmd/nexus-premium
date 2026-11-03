import React from "react";

const navy = "#070B1F";
const panel = "#0E1533";
const neonBlue = "#3DD5FF";
const neonPurple = "#A855F7";

const messages = [
  { from: "user", text: "Plan a launch page for my coffee brand." },
  {
    from: "nexus",
    text: "Done. I drafted 4 sections: hero, menu, story, and a signup form. Want me to start with the hero?",
  },
];

const workflow = [
  { step: "Understand", done: true },
  { step: "Design", done: true },
  { step: "Build", done: false },
  { step: "Publish", done: false },
];

function NexusLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="nx-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor={neonBlue} />
          <stop offset="1" stopColor={neonPurple} />
        </linearGradient>
      </defs>
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill="none"
        stroke="url(#nx-grad)"
        strokeWidth="2.5"
      />
      <path
        d="M16 34V14L32 34V14"
        fill="none"
        stroke="url(#nx-grad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3" fill={neonBlue} />
    </svg>
  );
}

export default function Index() {
  return (
    <div
      className="min-h-screen w-full text-slate-100 antialiased"
      style={{
        background: `radial-gradient(circle at 15% 0%, rgba(168,85,247,0.25), transparent 45%), radial-gradient(circle at 90% 100%, rgba(61,213,255,0.18), transparent 40%), ${navy}`,
      }}
    >
      <style>{`
        @keyframes nx-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes nx-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        @keyframes nx-glow { 0%,100% { box-shadow: 0 0 18px rgba(61,213,255,.35); } 50% { box-shadow: 0 0 30px rgba(168,85,247,.55); } }
        .nx-float { animation: nx-float 5s ease-in-out infinite; }
        .nx-pulse { animation: nx-pulse 1.4s ease-in-out infinite; }
        .nx-glow { animation: nx-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto flex max-w-md flex-col gap-6 px-5 pb-10 pt-6 sm:max-w-2xl">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NexusLogo size={36} />
            <span className="text-lg font-semibold tracking-wide">
              Nexus<span className="text-[#3DD5FF]">-premium</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-[#A855F7]/60"
          >
            Settings
          </button>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center gap-4 pt-4 text-center">
          <div className="nx-float nx-glow rounded-3xl border border-white/10 bg-white/5 p-4">
            <NexusLogo size={72} />
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Meet <span className="bg-gradient-to-r from-[#3DD5FF] to-[#A855F7] bg-clip-text text-transparent">Nexus</span>,
            <br /> your AI builder
          </h1>
          <p className="max-w-sm text-sm text-slate-400">
            Describe what you want. Nexus plans, designs, and builds it with you.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-[#3DD5FF] to-[#A855F7] px-5 py-2.5 text-sm font-semibold text-[#070B1F] transition hover:brightness-110"
            >
              Start a project
            </button>
            <button
              type="button"
              className="rounded-xl border border-[#3DD5FF]/40 px-5 py-2.5 text-sm font-semibold text-[#3DD5FF] transition hover:bg-[#3DD5FF]/10"
            >
              Voice chat
            </button>
          </div>
        </section>

        {/* Chat preview */}
        <section
          className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4"
          style={{ background: panel }}
          aria-label="Chat preview"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "user"
                    ? "bg-[#A855F7]/20 text-slate-100"
                    : "border border-[#3DD5FF]/20 bg-[#3DD5FF]/10 text-slate-100"
                }`}
              >
                {m.from === "nexus" && (
                  <span className="mb-1 block text-xs font-semibold text-[#3DD5FF]">Nexus</span>
                )}
                {m.text}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="nx-pulse h-2 w-2 rounded-full bg-[#3DD5FF]" />
            Nexus is preparing the next step…
          </div>
        </section>

        {/* Workflow */}
        <section className="rounded-2xl border border-white/10 p-4" style={{ background: panel }}>
          <h2 className="mb-4 text-sm font-semibold text-slate-300">Project workflow</h2>
          <ol className="grid grid-cols-4 gap-2">
            {workflow.map((w, i) => (
              <li key={w.step} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    w.done
                      ? "bg-gradient-to-br from-[#3DD5FF] to-[#A855F7] text-[#070B1F]"
                      : "border border-white/15 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[11px] text-slate-400">{w.step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500">
          Nexus-premium · Powered by Nexus AI
        </footer>

        {/* What's next */}
        <section className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
          <h2 className="mb-2 font-semibold text-slate-300">What's next?</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Sign-in and saved projects</li>
            <li>Working voice chat with Nexus</li>
            <li>Settings and theme options</li>
            <li>Android app packaging under the Nexus-premium name</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
