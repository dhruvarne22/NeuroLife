"use client"

import { Note } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { SidebarMenuButton } from './ui/sidebar';
import Link from 'next/link';
import useNote from '@/hooks/use-note';
import { useSearchParams } from 'next/navigation';

type Props = {
    note : Note;
}

function NoteSelectBtn({note} : Props) {
const noteId = useSearchParams().get("noteId") || "";

const {noteText : selectedNoteText} = useNote();
const [useGlobalNoteText , setUseGlobalNoteText] = useState(false);
const [localNoteText, setLocalNoteText] = useState(note.text);


useEffect(() => {
    console.log("setUseGlobalNoteText");
    console.log(useGlobalNoteText);
  if(noteId === note.id){
    setUseGlobalNoteText(true);
  }else{
    setUseGlobalNoteText(false);
  }

  console.log("setUseGlobalNoteText");
    console.log(useGlobalNoteText);
}, [noteId, note.id])


useEffect(() => {
    if(useGlobalNoteText){

        setLocalNoteText(selectedNoteText);
    
    }
}, [selectedNoteText, useGlobalNoteText])



const blankNoteText = "EMPTY NOTE";

let noteText = localNoteText || blankNoteText;
if(useGlobalNoteText){
    noteText = selectedNoteText || blankNoteText;
}



  return (
    <SidebarMenuButton asChild className='items-start gap-0 pr-12'>
<Link href={`/?noteId=${note.id}`} className='flex h-fit flex-col'>
<p className='w-full overflow-hidden truncate text-ellipsis whitespace-nowrap'>
    {noteText}
</p>
{/* <p className='text-muted-foreground text-xs'>
    {note.updatedAt.toLocaleDateString()}
</p> */}
</Link>

        </SidebarMenuButton>
  )
}

export default NoteSelectBtn