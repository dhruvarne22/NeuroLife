'use client'


import React, { ChangeEvent, useEffect } from 'react'
import { Textarea } from './ui/textarea'
import useNote from '@/hooks/use-note'
import { updateNoteAction } from '@/action/note'

type Props = {
    noteId : string,
    startingNoteText  : string
}

let updateTimeout  : NodeJS.Timeout;


const InputNote = ({noteId ,  startingNoteText} : Props) => {


    const {noteText , setNoteText} = useNote();


const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
console.log(text);
 setNoteText(text);
console.log("UPDATING NOTE FROM WITHOUT DEBOUNCE");   
   clearTimeout(updateTimeout);


   updateTimeout = setTimeout( () => {
     //UPDATE NOTES IN BACKEDN
     updateNoteAction(noteId, text);
console.log("UPDATING NOTE FROM DEBOUNCE");
   }, 1000)
}


  return <Textarea value={noteText}
  className='mb-4 placeholder:text-muted-foreground h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0'
  onChange={handleUpdateNote} placeholder='Type your notes here'/>
}

export default InputNote