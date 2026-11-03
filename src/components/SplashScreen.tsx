import { useEffect, useState } from "react";
import NexusLogo from "@/components/NexusLogo";

const SPLASH_MS = 2600;

/** Full-screen Nexus-premium loading screen shown when the app opens. */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setLeaving(true), SPLASH_MS);
    const hide = window.setTimeout(() => setVisible(false), SPLASH_MS + 600);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Nexus-premium"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden bg-[#070B1F] transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="nx-splash-glow pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.35),rgba(61,213,255,0.15)_45%,transparent_70%)] blur-2xl" />

      {/* Rotating neon rings */}
      <div className="relative flex items-center justify-center">
        <span className="nx-splash-ring absolute h-44 w-44 rounded-full border border-[#3DD5FF]/40 border-t-[#3DD5FF] border-r-transparent" />
        <span className="nx-splash-ring-rev absolute h-56 w-56 rounded-full border border-[#A855F7]/30 border-b-[#A855F7] border-l-transparent" />
        <div className="nx-splash-logo relative">
          <NexusLogo size={112} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xl font-semibold tracking-wide text-slate-100">
          Nexus<span className="text-[#3DD5FF]">-premium</span>
        </p>
        <p className="nx-splash-text text-xs text-slate-400">Powered by Nexus AI</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="nx-splash-bar h-full rounded-full bg-gradient-to-r from-[#3DD5FF] to-[#A855F7]" />
      </div>

      <style>{`
        @keyframes nx-splash-spin { to { transform: rotate(360deg); } }
        @keyframes nx-splash-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes nx-splash-logo-in {
          0% { opacity: 0; transform: scale(0.6) rotate(-12deg); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes nx-splash-bar { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes nx-splash-text { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
        @keyframes nx-splash-glow-pulse { 0%,100% { transform: scale(1); opacity: .7; } 50% { transform: scale(1.12); opacity: 1; } }
        .nx-splash-ring { animation: nx-splash-spin 2.4s linear infinite; }
        .nx-splash-ring-rev { animation: nx-splash-spin-rev 3.6s linear infinite; }
        .nx-splash-logo { animation: nx-splash-logo-in 900ms cubic-bezier(.2,.8,.2,1) both; }
        .nx-splash-bar { animation: nx-splash-bar 2.4s ease-in-out forwards; }
        .nx-splash-text { animation: nx-splash-text 1.6s ease-in-out infinite; }
        .nx-splash-glow { animation: nx-splash-glow-pulse 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nx-splash-ring, .nx-splash-ring-rev, .nx-splash-text, .nx-splash-glow { animation: none; }
        }
      `}</style>
    </div>
  );
}
