"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'

import { useRouter } from 'next/navigation';
import {v4 as uuidv4} from "uuid";
import { createNoteAction } from '@/action/note';
import { Loader2 } from 'lucide-react';
import { User } from '@prisma/client';
import { toast } from 'sonner';

type Props = {
    user : User | null;
}
const CreateNewNote = ({user} : Props) => {

const router = useRouter();

const [loading , setloading] = useState(false);
const handleCreateNoteBtn = async () => {
    if(!user){
        
router.push("/login")
    }else{

        toast.success("Note Created Successfully", {description : "Note has been created succesfully"})

        setloading(true);
        const uuid = uuidv4();
        console.log("I AM RUNNING FOR BOW");
        await createNoteAction(uuid);
        router.push(`/?noteId=${uuid}`)
        setloading(false);
    }
}


  return (
   <Button

   onClick={handleCreateNoteBtn}
   variant= "secondary"
   className = "w-24"
   disabled={loading}
   >
    
    {loading  ? <Loader2 className = "animate-spin"/>: "New Note"}
   
   </Button>
  )
}

export default CreateNewNote

