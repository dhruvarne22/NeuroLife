import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { OpenAI } from "openai";
import { parse } from "path";

type PersonaResult = {
    character: string;
    movie: string;
    funny_reason: string;
    traits: string[];
    advice: string[];
    metrics: {
        notesCount: number;
        completedGoalsCount: number;
        completionRate: number;
    }
}


function safeJSONparse(s: string) {
    try {
        return JSON.parse(s);
    } catch {
        const start = s.indexOf("{");
        const end = s.lastIndexOf("}");

        if (start !== -1 && end !== -1 && end > start) {
            try {
                return JSON.parse(s.slice(start, end + 1));
            } catch {
                return null;
            }
        }

        return null;
    }
};



export async function analyzeUserPersona(days = 30): Promise<PersonaResult | null> {
   
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const user = await getUser();
        if (!user) return null;

        const since = new Date();
        since.setDate(since.getDate() - days);


        const notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
                createdAt: { gte: since }
            },
            orderBy: { createdAt: 'desc' }
        });


        const userGoals = await prisma.userGoal.findFirst({
            where: { userId: user.id }
        })

        const goalsText = userGoals?.goalsText ?? "";

        const notesText = notes.map((n) => `(${new Date(n.createdAt).toLocaleDateString()}) ${n.text} )`).join("\n\n");


        let payload = `USER GOALS:\n${goalsText}\n\n---\nLAST ${days} DAYS NOTE:\n${notesText}`;


        if (payload.length > 100_000) {
            payload = `USER GOALS:\n${goalsText}\n\n---\nLAST ${days} DAYS NOTE:(TRUNCATED):\n` + notes.slice(0, 50).map((n) => `(${new Date(n.createdAt).toLocaleDateString()}) ${n.text} )`).join("\n\n");
        }


        // --- PROMPT ---
        const prompt = `
You are a fun, humorous, deeply insightful Bollywood-style personality analyst.

Your job:
Analyze the user's GOALS + last ${days} DAYS of NOTES and choose the ONE Bollywood movie character who best represents their current mindset, habits, motivations, patterns, and internal personality.

🎭 IMPORTANT:
- You are NOT restricted to any character list.
- You may choose ANY Bollywood character from ANY era (old, new, iconic, underrated).
- You MUST base your reasoning ONLY on real evidence found in their notes/goals.
- Your "funny_reason" must reference real user behavior, patterns, or phrases.
- Do NOT invent events or goals they never wrote.

⛔ DO NOT:
- Do not use Western movie characters.
- Do not pick real actors (must be a CHARACTER).
- Do not guess or hallucinate. Stay grounded in user data.
- Do not output analysis text — ONLY JSON.

🎭 OUTPUT STRICT JSON ONLY (no commentary):

{
  "character": "<Bollywood character name>",
  "movie": "<Movie name>",
  "funny_reason": "<humorous explanation using real evidence only>",
  "traits": ["trait1", "trait2", "trait3"],
  "advice": ["tip 1", "tip 2", "tip 3"],
  "metrics": {
    "notesCount": <integer>,
    "completedGoalsCount": <integer>,
    "completionRate": <float>
  }
}

📌 CHARACTER SELECTION GUIDELINES (flexible — not rules):
- If user is disciplined, hardworking → could be someone like Kabir Khan, Sultan, Milkha Singh, Rancho
- If emotional or intense → could be Kabir Singh, Jordan (Rockstar), Devdas
- If joyful, chaotic, spontaneous → could be Geet (Jab We Met), Alia from Dear Zindagi, Bittu from Band Baaja Baaraat
- If philosophical or confused → could be Bunny, Ayan, Ved (Tamasha)
- If caring or warm → could be Munna Bhai, Piku, Baghban family characters
- If overachiever → could be Phunsukh Wangdu, Shahrukh's coach characters
- If ambition-driven → could be Guru (Guru), Raghuveer from Swades, or even Rocky Handsome
- If chaotic, clueless but trying → could be Circuit, Babu Rao (Hera Pheri)

These are EXAMPLES only — you can choose ANY Bollywood character as long as the reasoning is grounded in REAL user text.

SPECIAL CASE:
If notes and goals are too empty or unclear, pick a funny “mismatched” character like:
- Jadoo (Koi Mil Gaya)
- Baburao (Hera Pheri)
- Rajpal Yadav characters
…with a comedic reason like “Bro, there wasn't enough data, so I picked someone who's also confused.”

Now analyze the text below and choose the MOST APPROPRIATE Bollywood character based SOLELY on the evidence:

${payload}
`;


        try {
            const res = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_completion_tokens: 800
            });


            const raw = res.choices?.[0]?.message?.content ?? "";
            const parsed = safeJSONparse(raw);

            if (!parsed) {
                console.log("Personal JSON parsed failed", raw.slice(0, 180));
                const completedMatches = goalsText.match(/completed|done|finished|\b\d{1,2}[\/\-]\d{1,2}\b/gi) || [];

                return {
                    character: "Jadoo",
                    movie: "Koi Mil Gaya",
                    "funny_reason": "Bro, I don;t have enough data. Please communicate with Earth more.",
                    traits: [],
                    advice: ["Write more detailed goals and notes for better analysis", "Try to check your internet connectivity", "Reload the page"],
                    metrics: {
                        notesCount: notes.length,
                        completedGoalsCount: completedMatches.length,
                        completionRate: 0,
                    }
                }

            }

            parsed.metrics = parsed.metrics ?? {};

            const completedMatches =
                goalsText.match(/completed|done|finished|\b\d{1,2}[\/\-]\d{1,2}\b/gi) || [];

            parsed.metrics.notesCount = parsed.metrics.notesCount ?? notes.length;
            parsed.metrics.completedGoalsCount = parsed.metrics.completedGoalsCount ?? completedMatches.length;

            parsed.metrics.completionRate = typeof parsed.metrics.completionRate === "number" ? parsed.metrics.completionRate : parsed.metrics.notesCount > 0 ? parsed.metrics.completedGoalsCount / parsed.metrics.notesCount : 0;

            return parsed as PersonaResult;

        }catch(error) {
            handleError(error);
            return null;
        }




}
