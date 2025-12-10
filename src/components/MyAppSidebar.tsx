import { getUser } from '@/auth/server';
import MySideBarGroupContent from './MySideBarGroupContent';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './ui/sidebar'
import { Note } from '@prisma/client';
import { prisma } from '@/db/prisma';
import Image from 'next/image';
import Link from 'next/link';

async function AppSideBar() {

const user = await getUser();


let notes : Note[] = [];

if(user){
  notes = await prisma.note.findMany({
    where : {authorId : user.id},
    orderBy : {updatedAt : 'desc'}
  })
}

  return (
 

  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className='mb-2 mt-2 text-lg'>
<Link className="flex items-end gap-2 mb-4 mb-2" href="/">
<h1 className='flex flex-col pb-1 text-xl font-semibold leading-6'>NeuroLife<span className='text-xs'>Made By CWD</span></h1>
</Link>

        </SidebarGroupLabel> 

        <MySideBarGroupContent notes={notes}/>
        </SidebarGroup>
      </SidebarContent> 
      <SidebarFooter>
        <div className='flex items-center gap-3'>
          <div
           className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden'
          >
            <Image src="https://e7.pngegg.com/pngimages/318/144/png-clipart-iron-man-avatar-iron-man-cartoon-avatar-superhero-icon-superhero-phone-icon-comics-face.png" alt='avatar' width={40} height={40} className='object-cover'/>
          </div>
          <div>
            <p className='text-sm font-semibold'>{user.email}</p>
          </div>
        </div>
      </SidebarFooter>
  </Sidebar>

  
  
  )
}

export default AppSideBar;