import { getUser } from '@/auth/server';
import MySideBarGroupContent from './MySideBarGroupContent';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './ui/sidebar'
import { Note } from '@prisma/client';
import { prisma } from '@/db/prisma';

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
          Your Life x NeuroLife
        </SidebarGroupLabel>

        <MySideBarGroupContent notes={notes}/>
        </SidebarGroup>
      </SidebarContent> 
  </Sidebar>
  )
}

export default AppSideBar;