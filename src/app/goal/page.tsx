"use client"
import { getUserGoals, saveUserGoals } from '@/action/goal';
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils';

import React, { ChangeEvent, useEffect, useState } from 'react'


let updatedTimeout : NodeJS.Timeout;

function Goal() {
const [goalsText , setGoalsText] = useState("");
const [loading, setLoading ] = useState(true);
const [savingState, setSavingState] = useState<"idle" | "saving" | "saved">("idle");
useEffect(()=>{
    async function load(){
        const data = await getUserGoals();
        if(data) setGoalsText(data.goalsText || "");

        setLoading(false);
    }

    load();
}, []);


const handleGoalsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setGoalsText(text);
setSavingState("saving");

clearTimeout(updatedTimeout);

updatedTimeout = setTimeout(async() => {
await saveUserGoals(text);
setSavingState("saved");

setTimeout(()=> setSavingState("idle"), 1500);
}, 1000);

};

if(loading) return <p className='p-4'>Loading Goals...</p>


  return (
    <div className='flex flex-col h-screen p-6'>
        <div className='mb-4 flex items-center justify-between'>
<div>

        <h1 className='text-2xl font-bold'>Specify Your Goal</h1>
        <p className='text-muted-foreground'>
            Write anything - current goals,complted goals, future goals
        </p>
</div>


<span className={cn("text-sm transition-opacity", savingState === "saving" && "opacity-100 text-yellow-500", savingState === "saved" && "opacity-100 text-green-500", savingState === "idle" && "opacity-0")}>

{savingState === "saving" ? "Saving..." : savingState === "saved" ? "Saved ✅" : ""}

</span>

        </div>

        <div className='flex-1'>
            <Textarea
            value={goalsText}
onChange={handleGoalsChange}
            placeholder={
                `Write your goals in anys style:\n\n1.Learn Driving\n2.Gain Muscles\n\nCompleted:\n1. Learned Cricket - 12 Dec 2025
                `
            }

            className='w-full h-full resize-none px-4 py-3 text-base border rounded-md'
            />
        </div>

    </div>
  )
}

export default Goal