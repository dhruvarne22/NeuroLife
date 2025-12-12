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
console.log("noteid home");
console.log(noteid);

  const rawUser = await getUser();

  // ⭐ Normalize to the structure CreateNewNote expects
  const user = rawUser
    ? {
        id: rawUser.id,
        name: "NeuroLife User",
        email: (rawUser as any).email ?? "",
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
