import { Note } from "@prisma/client";
import { format } from "date-fns";

export  function groupofNotesByDay(notes : Note[]) : Record<string,Note[]>{
const group : Record<string, Note[]> = {};

notes.forEach((note)=>{
    const d = new Date(note.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let label = "";
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    const isYesterday = d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();

    if(isToday) label = "Today";
    else if (isYesterday) label = "Yesterday";
    else label = format(d, "dd MMM yyyy");

    if(!group[label]) group[label] = [];
    group[label].push(note);

});

return group;
}