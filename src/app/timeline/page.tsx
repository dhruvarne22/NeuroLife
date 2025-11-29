import { getUserNotes } from '@/action/note'
import Timeline from '@/components/timeline/timeline'
import React from 'react'


async function TimelinePage() {
const grouped = await getUserNotes();

  return (
    <div className='flex'>

        <div className='flex-1 p-10'>
            <h1 className='text-3xl font-semibold mb-8'>My Timeline</h1>

            <Timeline grouped={grouped}/>
        </div>

    </div>
  )
}

export default TimelinePage