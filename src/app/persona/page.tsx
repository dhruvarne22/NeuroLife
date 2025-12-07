import { analyzeUserPersona } from '@/action/persona'
import React from 'react'

async function Persona() {

const persona = await analyzeUserPersona(30);
if(!persona){
    return <div className='p-6 text-red-500'>Unable to generate your persona.</div>
}

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-8'>
<div>
    <h1 className='text-3xl font-bold'>
        {persona.character}
    </h1>
    <p className='text-muted-foreground italic'>
        {persona.movie}
    </p>
    <p className='mt-4 text-lg'>{persona.funny_reason}</p>
</div>

<section>
    <h2 className='text-xl font-semibold mb-2'>Your Traits</h2>

    <div className='flex flex-wrap gap-2'>
        {persona.traits.map((t)=>(
 <span className='px-3 py-1 text-sm rounded-full border-2' key={t}>{t}</span>
        ))}
       
     
    </div>
</section>

<section>
    <h2 className='text-xl font-semibold mb-2'>Advice For You</h2>
    <ul className='list-disc ml-6 space-y-2'>
     {persona.advice.map((a,i)=> (
        <li key={i}>{a}</li>
     ))}
    </ul>
</section>

<section>
    <h2 className='text-xl font-semibold mb-2'>Your Metrics</h2>

    <div className='grid grid-cols-3 gap-4'>
        <div className='border p-3 rounded'>
            <p className='text-sm text-muted-foreground'>Notes (30 days)</p>
            <p className='text-xl font-bold'>{persona.metrics.notesCount}</p>
        </div>


         <div className='border p-3 rounded'>
            <p className='text-sm text-muted-foreground'>Completed Goals</p>
            <p className='text-xl font-bold'>{persona.metrics.completedGoalsCount}</p>
        </div>

        <div className='border p-3 rounded'>
            <p className='text-sm text-muted-foreground'>Completion Rate</p>
            <p className='text-xl font-bold'>{(persona.metrics.completionRate * 100).toFixed(0)}</p>
        </div>
    </div>
</section>

    </div>
  )
}

export default Persona