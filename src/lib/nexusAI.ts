export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

const FUNCTION_SLUG = "nexus-chat";

/**
 * Sends the conversation to the Nexus AI edge function and returns the reply.
 * Throws if the backend is not configured or the request fails, so callers can fall back.
 */
export async function askNexus(messages: AIMessage[], memories: string[]): Promise<string> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!baseUrl || !anonKey) throw new Error("Nexus AI is not configured");

  const res = await fetch(`${baseUrl}/functions/v1/${FUNCTION_SLUG}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ messages, memories }),
  });

  const data = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null;
  if (!res.ok || !data?.reply) throw new Error(data?.error ?? "Nexus AI request failed");
  return data.reply;
}
