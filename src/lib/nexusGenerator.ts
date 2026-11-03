export interface Artifact {
  title: string;
  language: string;
  content: string;
}

export interface NexusReply {
  text: string;
  artifact?: Artifact;
}

const GENERATE_RE = /\b(generate|create|make|build|write|design|draft|compose|produce)\b/i;
const GREETING_RE = /^\s*(hi|hello|hey|good (morning|afternoon|evening))\b/i;
const HELP_RE = /\b(help|what can you do|how do you work)\b/i;

export function isGenerateRequest(prompt: string): boolean {
  return GENERATE_RE.test(prompt);
}

function extractTopic(prompt: string): string {
  const cleaned = prompt
    .toLowerCase()
    .replace(
      /\b(please|can you|could you|i want you to|i want|i need|would you|for me|generate|create|make|build|write|design|draft|compose|produce|a|an|the|some|simple|short|new|my|me)\b/g,
      " ",
    )
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "my project";
}

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function makeWebsite(topic: string): Artifact {
  const t = esc(titleCase(topic));
  const year = new Date().getFullYear();
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #070B1F; color: #e2e8f0; line-height: 1.6; }
    header, section { padding: 64px 24px; text-align: center; }
    h1 { font-size: clamp(2rem, 6vw, 3.5rem); background: linear-gradient(90deg, #3DD5FF, #A855F7); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .cards { display: grid; gap: 16px; max-width: 900px; margin: 0 auto; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .card { background: #0E1533; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
    .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; border-radius: 999px; background: linear-gradient(90deg, #3DD5FF, #A855F7); color: #070B1F; font-weight: 700; text-decoration: none; }
    footer { text-align: center; padding: 24px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <h1>${t}</h1>
    <p>Welcome to ${t}. Discover what we do and why it matters.</p>
    <a class="btn" href="#contact">Get started</a>
  </header>
  <section>
    <div class="cards">
      <div class="card"><h3>Simple</h3><p>Clear and easy to use from the first visit.</p></div>
      <div class="card"><h3>Fast</h3><p>Built to load quickly on any phone or computer.</p></div>
      <div class="card"><h3>Trusted</h3><p>Designed to earn confidence with every detail.</p></div>
    </div>
  </section>
  <section id="contact">
    <h2>Ready to start?</h2>
    <p>Get in touch today.</p>
  </section>
  <footer>&copy; ${year} ${t}</footer>
</body>
</html>`;
  return { title: `${titleCase(topic)} landing page`, language: "html", content };
}

function makePoem(topic: string): Artifact {
  const t = titleCase(topic);
  const content = `${t}

In quiet hours, the thoughts take flight,
Like stars that wake before the night.
${t} shines bright in every line,
A gentle spark, a path to shine.

Hold on to hope and take the first step,
Each small beginning carries a promise kept.`;
  return { title: `Poem about ${topic}`, language: "text", content };
}

function makeStory(topic: string): Artifact {
  const t = titleCase(topic);
  const content = `${t}

Once upon a time, in a place not far from here, there was a story waiting to be told about ${topic}.

At first, nobody paid it much attention. But one morning, a curious person noticed a small detail that changed everything. They followed it, step by step, and discovered something new.

By the end of the day, the whole town knew the name of ${topic}, and the story continued long after the lights went out.`;
  return { title: `Story about ${topic}`, language: "text", content };
}

function makeIdeas(topic: string): Artifact {
  const t = titleCase(topic);
  const names = [
    `${t} Hub`,
    `Nova ${t}`,
    `${t} Pulse`,
    `Prime ${t}`,
    `${t} Studio`,
    `Aurora ${t}`,
    `${t} Forge`,
    `Vertex ${t}`,
  ];
  const content = names.map((n, i) => `${i + 1}. ${n}`).join("\n");
  return { title: `Name ideas for ${topic}`, language: "text", content };
}

function makePlan(topic: string): Artifact {
  const t = titleCase(topic);
  const content = `Plan for ${t}

1. Define the goal
   Write one sentence describing what success looks like.

2. Know your audience
   List who will use it and what they need most.

3. Build a first version
   Focus on the core idea only. Keep it simple.

4. Test with real people
   Gather feedback and note what is confusing.

5. Improve and launch
   Fix the top issues, then share it with the world.

6. Measure and grow
   Track results weekly and adjust the plan.`;
  return { title: `Plan for ${topic}`, language: "text", content };
}

function makeDescription(topic: string): Artifact {
  const t = titleCase(topic);
  const content = `${t} brings together quality, simplicity, and style. Designed for people who value their time, it makes everyday tasks easier and more enjoyable. Try it once and see the difference.`;
  return { title: `Description for ${topic}`, language: "text", content };
}

function makePalette(topic: string): Artifact {
  const content = `Color palette for ${topic}

Midnight Navy   #070B1F  (background)
Deep Blue       #0E1533  (cards)
Neon Blue       #3DD5FF  (highlights)
Electric Purple #A855F7  (accents)
Soft White      #E2E8F0  (text)
Muted Slate     #64748B  (secondary text)`;
  return { title: `Color palette for ${topic}`, language: "text", content };
}

export function generateArtifact(prompt: string): Artifact {
  const p = prompt.toLowerCase();
  const topic = extractTopic(prompt);

  if (/\b(website|web ?site|landing ?page|web ?page|html|homepage|home page)\b/.test(p)) {
    return makeWebsite(topic);
  }
  if (/\b(poem|poetry|rhyme|verse)\b/.test(p)) return makePoem(topic);
  if (/\b(story|tale|fiction)\b/.test(p)) return makeStory(topic);
  if (/\b(name|names|slogan|brand)\b/.test(p)) return makeIdeas(topic);
  if (/\b(palette|colors?|colours?|theme)\b/.test(p)) return makePalette(topic);
  if (/\b(description|caption|bio|product)\b/.test(p)) return makeDescription(topic);
  return makePlan(topic);
}

export function respond(prompt: string): NexusReply {
  if (isGenerateRequest(prompt)) {
    const artifact = generateArtifact(prompt);
    return {
      text: `Here is your ${artifact.title.toLowerCase()}. You can copy it or download it below.`,
      artifact,
    };
  }
  if (GREETING_RE.test(prompt)) {
    return {
      text: "Hi, I'm Nexus. Ask me to create something, like \"create a landing page for a bakery\" or \"generate a poem about the sea\".",
    };
  }
  if (HELP_RE.test(prompt)) {
    return {
      text: "I can chat with you and create things for you. Try:\n• Create a website for a coffee shop\n• Generate a poem about the moon\n• Make a plan for learning Spanish\n• Write a story about a lost dog\n• Create name ideas for a bike shop\n• Make a color palette for a fitness app",
    };
  }
  return {
    text: "I'm here to help. If you want me to make something, start your message with words like \"create\" or \"generate\" and describe it in simple language.",
  };
}
