"use server"
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { Note } from "@prisma/client";
import {endOfDay, format, isToday, isYesterday, startOfDay} from "date-fns";
import {OpenAI} from "openai";
export const updateNoteAction = async (noteId : string , text : string) => {
try {
    
    const user  = await getUser();

    if(!user) throw Error("Login to update Note");
console.log("noteidDDD");
console.log(noteId);

    await prisma.note.update({
        where : {id : noteId},
        data : {text}
    });

    return {errorMessage : null}
} catch (error) {
    console.log("9error");
    console.log(error);
    return handleError(error);
}



}






export const createNoteAction = async (noteid : string) => {
try {
    
    const user  = await getUser();

    if(!user) throw Error("Login to update Note");

    await prisma.note.create({
        
        data : {
            id :noteid,
            authorId : user.id,
            text : ""
        }
    });

    return {errorMessage : null}
} catch (error) {

    console.log(error);
    return handleError(error);
}





}



export const deleteNoteAction = async (noteId: string) => { 
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};




export async function groupNotesByDate(notes: Note[]){
const groups : any = {};

notes.forEach((note)=> {
  const d = new Date(note.createdAt);

  let label = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "dd MMM, yyyy");

  if(!groups[label]) groups[label] = [];
  groups[label].push(note);
})

return groups;

}


export async function getUserNotes() {
  const user = await getUser();
  if (!user) throw Error("Login to view notes");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });


  const groupedSummaries = await summarisedNotesByDay(notes);

  return groupedSummaries;
}



export async function summarisedNotes(notes: Note[]){
  const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

  return await Promise.all(notes.map(async (note)=>{
    const prompt = `You are a helpful assistant. Summarize the user's daily note into a short and clear paragraph.

Requirements:
- Capture the main activities done throughout the day.
- Highlight important events, emotions, or achievements.
- Use a friendly, natural tone.
- Keep the summary between 2-4 sentences.
- Do NOT add anything extra that the user did not mention.
- Output only the final summary text without headings or bullet points.

Here is the user's note:
${note.text}`;



const res = await client.chat.completions.create({
    model : "gpt-4o-mini",
    messages: [{role: "user", content: prompt}],
    max_completion_tokens : 50
  });

  return {...note, summary : res.choices[0].message.content || note.text}


  }

  
))
}






export async function summarisedNotesByDay(notes: Note[]) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log("🔄 Starting summarisedNotesByDay...");
  console.log("📝 Total notes received:", notes.length);

  // 1. Group notes by date
  const grouped: Record<string, Note[]> = {};

  notes.forEach((note) => {
    const d = new Date(note.createdAt);
    const label = isToday(d)
      ? "Today"
      : isYesterday(d)
      ? "Yesterday"
      : format(d, "dd MMM, yyyy");

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(note);
  });

  console.log("📅 Grouped by date:", Object.keys(grouped));

  // 2. Summarize each date group
  const result: Record<string, any> = {};

for (const date of Object.keys(grouped)) {
  console.log(`\n=== 📌 Processing date: ${date} ===`);

  const notesOfDay = grouped[date];

  const cachedSummary = notesOfDay.find((n) => n.summary)?.summary;

 const needsRegen = notesOfDay.some((n) => {
  if (!n.summaryUpdatedAt) return true;

  const diff = Math.abs(n.updatedAt.getTime() - n.summaryUpdatedAt.getTime());

  // ⛔ Ignore tiny differences caused by updateMany
  if (diff < 20) return false;

  return true;
});

  console.log("📊 Notes:", notesOfDay.length);
  console.log("🔍 Cached summary exists:", cachedSummary ? "YES" : "NO");
  console.log("🔄 Needs regeneration:", needsRegen ? "YES" : "NO");

  // If summary exists and nothing changed → reuse it
  if (cachedSummary && !needsRegen) {
    console.log("⛔ Using cached summary");
    result[date] = { summary: cachedSummary, notes: notesOfDay };
    continue;
  }

  console.log("⚡ Summary missing or outdated → generating new summary...");

  const combinedText = notesOfDay.map((n) => n.text).join("\n\n");

  const prompt = 
`You are a helpful assistant. Summarize the user's activities for this day.

Requirements:
- Capture the main activities done throughout the day.
- Highlight important events, emotions, or achievements.
- Friendly, natural tone.
- 3–5 sentences.
- Do NOT invent details.
- Output only the summary.

Here are all notes for the day:
${combinedText}`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 100,
  });

  const summary = res.choices[0].message.content || "";

  console.log("✅ New summary generated");

  // Update all notes of the day
  await prisma.note.updateMany({
    where: {
      id: { in: notesOfDay.map((n) => n.id) },
    },
    data: {
      summary,
      summaryUpdatedAt: new Date(),
    },
  });

  console.log("💾 Summary saved to DB");

  result[date] = {
    summary,
    notes: notesOfDay,
  };
}


  console.log("\n🏁 Finished summarisedNotesByDay()");
  return result;
}



