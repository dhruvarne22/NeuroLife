'use client'


import React, { ChangeEvent, useEffect } from 'react'
import { Textarea } from './ui/textarea'
import useNote from '@/hooks/use-note'

type Props = {
    noteId : string,
    startingNoteText  : string
}

let updateTimeout  : NodeJS.Timeout;


const InputNote = ({noteId ,  startingNoteText} : Props) => {


    const {noteText , setNoteText} = useNote();
 useEffect(() => {
    setNoteText(startingNoteText)
  }, [startingNoteText]) 


const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
console.log(text);
 
console.log("UPDATING NOTE FROM WITHOUT DEBOUNCE");   
   clearTimeout(updateTimeout);


   updateTimeout = setTimeout(() => {
     //UPDATE NOTES IN BACKEDN
     
console.log("UPDATING NOTE FROM DEBOUNCE");
   }, 1000)
}


  return <Textarea value={noteText}
  
  onChange={handleUpdateNote} placeholder='Type your notes here'/>
}

export default InputNote