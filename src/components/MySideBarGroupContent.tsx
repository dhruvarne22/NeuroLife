"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { SearchIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Note } from '@prisma/client'
import Link from 'next/link'
import Fuse from "fuse.js";
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

  return (
<SidebarGroupContent>

    <div  className='relative flex items-center'>
        <SearchIcon className='absolute left-2 size-4'/>
        <Input className='bg-muted pl-8' placeholder='Search About You...' value={searchText} 
        onChange={(e) => setSearchText(e.target.value)}
        />
    </div>


<SidebarMenu className='mt-4'>



    {filteredNotes.map((note)=> (
  <SidebarMenuItem key={note.id} className='group/item'>
    <SidebarMenuButton asChild className={`items-start gap-0 pr-12 bg-sidebar-accent/50`}>
   <Link href={`/?noteId=${note.id}`} className='flex h-fit flex-col'>
<p className='w-full overflow-hidden truncate text-ellipsis whitespace-nowrap'>{note.text}</p>
   </Link>
   </SidebarMenuButton>
    </SidebarMenuItem>
    ))}

  


</SidebarMenu>
</SidebarGroupContent>
  )
}

export default MySideBarGroupContent