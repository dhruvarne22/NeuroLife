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


export async function getUserNotes(){
  const user = await getUser();
  if(!user) throw Error("Login to view notes");

  const notes = await prisma.note.findMany({
    where  : {authorId : user.id,

 
    },
     
    orderBy : {createdAt : "desc"}
  });

  const summarised = await summarisedNotes(notes);


  const grouped = groupNotesByDate(summarised);

  return grouped;
  
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
