import { getUser } from "@/auth/server";
import CreateNewNote from "@/components/CreateNewNote";
import InputNote from "@/components/InputNote";
import { prisma } from "@/db/prisma";


type Props = {
  searchParams : Promise<{[key:string] : string | string[] | undefined}>
}

export default async function Home({searchParams} : Props) {
const noteIdparam = (await searchParams).noteId;
const noteid = Array.isArray(noteIdparam) ? noteIdparam[0] : noteIdparam || "";

const authUser = await getUser();

const user = authUser
  ? {
      id: authUser.id,
      name: "NeuroLife User",  
      email: authUser.email ?? "",
    }
  : null;

const note = await prisma.note.findUnique({
  where : {id : noteid, authorId : user?.id}
})


  return (
 <div className="flex h-full flex-col items-center gap-4">
<div className="flex w-full max-w-4xl justify-end gap-2">
  
<CreateNewNote user={user}/>
</div>

<InputNote noteId={noteid} startingNoteText={note?.text || ""}/>
 </div>
  );
}
