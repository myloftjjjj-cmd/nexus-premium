import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { respond, type Artifact } from "@/lib/nexusGenerator";
import {
  addMemories,
  detectMemoryIntent,
  extractFacts,
  findName,
  forgetMatching,
  loadMemories,
  saveMemories,
  type Memory,
} from "@/lib/nexusMemory";

type Role = "user" | "nexus";

interface ChatMessage {
  id: number;
  role: Role;
  text: string;
  artifact?: Artifact;
}

const starters = [
  "Create a landing page for my bakery",
  "Generate a poem about the sea",
  "Create name ideas for a bike shop",
  "Make a color palette for a fitness app",
];

function downloadArtifact(a: Artifact) {
  const ext = a.language === "html" ? "html" : "txt";
  const blob = new Blob([a.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyArtifact(a: Artifact) {
  try {
    await navigator.clipboard.writeText(a.content);
  } catch {
    /* clipboard unavailable */
  }
}

function NexusMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="nx-chat-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#3DD5FF" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill="none"
        stroke="url(#nx-chat-grad)"
        strokeWidth="2.5"
      />
      <path
        d="M16 34V14L32 34V14"
        fill="none"
        stroke="url(#nx-chat-grad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3" fill="#3DD5FF" />
    </svg>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(() => loadMemories());
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const memoriesRef = useRef(memories);
  memoriesRef.current = memories;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const updateMemories = (list: Memory[]) => {
    memoriesRef.current = list;
    setMemories(list);
    saveMemories(list);
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: ChatMessage = { id: nextId.current++, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    let replyText: string;
    let artifact: Artifact | undefined;
    const current = memoriesRef.current;
    const intent = detectMemoryIntent(trimmed);

    if (intent?.type === "list") {
      replyText = current.length
        ? "Here is what I remember about you:\n• " + current.map((m) => m.text).join("\n• ")
        : "I don't have any memories saved yet. Tell me something about you, like \"my name is Sam\" or \"remember that I like tea\".";
    } else if (intent?.type === "clear") {
      updateMemories([]);
      replyText = "Done. I've forgotten everything I had saved about you.";
    } else if (intent?.type === "forget") {
      const { list, removed } = forgetMatching(current, intent.target);
      if (removed > 0) {
        updateMemories(list);
        replyText = `Okay, I forgot ${removed} memor${removed === 1 ? "y" : "ies"} about "${intent.target}".`;
      } else {
        replyText = `I don't have a memory matching "${intent.target}".`;
      }
    } else if (intent?.type === "name") {
      const name = findName(current);
      replyText = name ? `Your name is ${name}.` : "I don't know your name yet. You can tell me with \"my name is ...\".";
    } else {
      const facts = extractFacts(trimmed);
      const { list, added } = addMemories(current, facts);
      if (added.length) updateMemories(list);

      const result = respond(trimmed);
      artifact = result.artifact;
      replyText = result.text;

      const name = findName(list);
      if (added.length) {
        replyText = `Got it, I'll remember: ${added.join("; ")}.` + (artifact ? "\n\n" + replyText : "");
      } else if (!artifact && name && /\b(hi|hello|hey)\b/i.test(trimmed)) {
        replyText = `Hi ${name}! ${replyText}`;
      }
    }

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "nexus", text: replyText, artifact },
      ]);
      setThinking(false);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const newChat = () => {
    setMessages([]);
    setThinking(false);
    setSidebarOpen(false);
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden text-slate-100 antialiased"
      style={{
        background:
          "radial-gradient(circle at 10% 0%, rgba(168,85,247,0.18), transparent 40%), #070B1F",
      }}
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 flex w-64 flex-col gap-4 border-r border-white/10 bg-[#0E1533] p-4 transition-transform duration-300 md:static md:translate-x-0`}
      >
        <div className="flex items-center gap-2">
          <NexusMark />
          <span className="font-semibold tracking-wide">
            Nexus<span className="text-[#3DD5FF]">-premium</span>
          </span>
        </div>
        <button
          type="button"
          onClick={newChat}
          className="rounded-xl border border-[#3DD5FF]/40 px-3 py-2 text-left text-sm font-medium text-[#3DD5FF] transition hover:bg-[#3DD5FF]/10"
        >
          + New chat
        </button>
        <div className="flex-1 overflow-y-auto text-xs text-slate-500">
          <p className="mb-2 font-semibold uppercase tracking-wider">Recent</p>
          {messages.length > 0 ? (
            <p className="truncate rounded-lg bg-white/5 px-3 py-2 text-slate-300">
              {messages[0].text}
            </p>
          ) : (
            <p>No chats yet</p>
          )}

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold uppercase tracking-wider">Memory ({memories.length})</p>
              {memories.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateMemories([])}
                  className="text-[11px] text-slate-400 hover:text-[#A855F7]"
                >
                  Clear all
                </button>
              )}
            </div>
            {memories.length === 0 ? (
              <p>Nothing saved yet. Tell Nexus something about you.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {memories.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-slate-300"
                  >
                    <span className="break-words">{m.text}</span>
                    <button
                      type="button"
                      aria-label={`Forget ${m.text}`}
                      onClick={() => updateMemories(memories.filter((x) => x.id !== m.id))}
                      className="shrink-0 text-slate-500 hover:text-[#A855F7]"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Link to="/" className="text-xs text-slate-400 hover:text-slate-200">
          ← Back to home
        </Link>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
        />
      )}

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 md:hidden"
          >
            Menu
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <NexusMark size={22} />
            <span className="text-sm font-semibold">Nexus</span>
          </div>
          <span className="hidden text-sm text-slate-400 md:block">Chat with Nexus</span>
          <button
            type="button"
            onClick={newChat}
            className="text-sm text-slate-400 transition hover:text-slate-200"
          >
            New
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-6 pt-10 text-center">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <NexusMark size={56} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">How can Nexus help today?</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Ask a question, or pick a starting point below.
                  </p>
                </div>
                <div className="grid w-full gap-3 sm:grid-cols-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-white/10 bg-[#0E1533] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-[#A855F7]/60 hover:bg-[#A855F7]/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "nexus" && (
                    <div className="mt-1 shrink-0">
                      <NexusMark size={24} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#A855F7]/25 text-slate-100"
                        : "border border-white/10 bg-[#0E1533] text-slate-100"
                    }`}
                  >
                    {m.text}
                    {m.artifact && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#070B1F]">
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                          <span className="truncate text-xs font-medium text-slate-300">
                            {m.artifact.title}
                          </span>
                          <div className="flex shrink-0 gap-3 text-xs">
                            <button
                              type="button"
                              onClick={() => copyArtifact(m.artifact!)}
                              className="text-slate-400 transition hover:text-[#3DD5FF]"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadArtifact(m.artifact!)}
                              className="text-slate-400 transition hover:text-[#A855F7]"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-3 text-xs text-slate-300">
                          {m.artifact.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {thinking && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#3DD5FF]" />
                Nexus is thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/10 px-4 py-3">
          <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-white/10 bg-[#0E1533] p-2 focus-within:border-[#3DD5FF]/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Nexus…"
              aria-label="Message Nexus"
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="rounded-xl bg-gradient-to-r from-[#3DD5FF] to-[#A855F7] px-4 py-2 text-sm font-semibold text-[#070B1F] transition hover:brightness-110 disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-slate-500">
            Nexus-premium can make mistakes. Check important information.
          </p>
        </form>
      </main>
    </div>
  );
}
