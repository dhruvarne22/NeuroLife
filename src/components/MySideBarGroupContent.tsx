"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { SearchIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Note } from '@prisma/client'

import Fuse from "fuse.js";
import NoteSelectBtn from './NoteSelectBtn'
import DeleteNoteBtn from './DeleteNoteBtn'
import { groupofNotesByDay } from '@/action/grouped'


type Props = {
    notes: Note[];
}

function MySideBarGroupContent({notes} : Props) {


    const [searchText, setSearchText] = useState('');
    const [localNotes, setLocalnotes] = useState(notes);

useEffect(() => {
  setLocalnotes(notes);

}, [notes]);


const fuse = useMemo(() => {
    return new Fuse(localNotes, {
        keys: ['text'],
        distance : 2000,
        
        threshold : 0.6
    })
}, [localNotes])

const filteredNotes = searchText ? fuse.search(searchText).map((result)=>result.item) : localNotes;
const grouped = groupofNotesByDay(filteredNotes);
const localDelNote = (noteId : string) => {
  setLocalnotes((prevNotes)=>prevNotes.filter((note) => note.id !== noteId));
}

  return (
<SidebarGroupContent>

    <div  className='relative flex items-center'>
        <SearchIcon className='absolute left-2 size-4'/>
        <Input className='bg-muted pl-8' placeholder='Search About You...' value={searchText} 
        onChange={(e) => setSearchText(e.target.value)}
        />
    </div>


<SidebarMenu className='mt-4 space-y-4'>

{Object.keys(grouped).map((dataLabel)=> (
  <div key={dataLabel}>
    <p className='text-xs font-semibold text-muted-foreground'>{dataLabel}</p>
    {grouped[dataLabel].map((note)=> (
  <SidebarMenuItem key={note.id} className='group/item'>
 <NoteSelectBtn note= {note} />
<DeleteNoteBtn noteId={note.id} localNoteDel={localDelNote}/>
    </SidebarMenuItem>
    ))}
  </div>
))}

 
  


</SidebarMenu>
</SidebarGroupContent>
  )
}

export default MySideBarGroupContent