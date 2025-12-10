'use client'

import { ChangeEvent, useEffect } from 'react'
import { Textarea } from './ui/textarea'
import useNote from '@/hooks/use-note'
import { updateNoteAction } from '@/action/note'
import { useSearchParams } from 'next/navigation'

type Props = {
    noteId : string,
    startingNoteText  : string
}

let updateTimeout  : NodeJS.Timeout;


const InputNote = ({noteId ,  startingNoteText} : Props) => {

const noteIdParam = useSearchParams().get("noteId") || "";
    const {noteText , setNoteText} = useNote();

    useEffect(() => {

      if(noteIdParam === noteId){ 

        setNoteText(startingNoteText);
      }
      
    }, [startingNoteText, noteIdParam, noteId, setNoteText])
    


const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

 setNoteText(text);
   
   clearTimeout(updateTimeout);


   updateTimeout = setTimeout( () => {
     //UPDATE NOTES IN BACKEDN
     updateNoteAction(noteId, text);

   }, 1000)
}


  return <Textarea value={noteText}
  className='mb-4 placeholder:text-muted-foreground h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0'
  onChange={handleUpdateNote} placeholder='Type your notes here'/>
}

export default InputNote;