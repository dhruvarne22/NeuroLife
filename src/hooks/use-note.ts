"use client"

import { NoteProviderContext } from "@/components/providers/NoteProvider";
import { useContext } from "react"

function useNote(){
    const context = useContext(NoteProviderContext);

    if(!context) throw new Error("Error occur useNote");

    return context;
}

export default useNote;