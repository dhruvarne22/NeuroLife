export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getUser } from "@/auth/server";
import CreateNewNote from "@/components/CreateNewNote";
import InputNote from "@/components/InputNote";


export default async function Home(props: any) {

  const searchParams = await Promise.resolve(props.searchParams ?? {});

  // Auth
  const rawUser = await getUser();
  if (!rawUser) {
    redirect("/login");
  }

  const user = {
    id: rawUser.id,
    name: "NeuroLife User",
    email: (rawUser as any).email ?? "",
  };

  // Extract noteId
  const noteIdParam = searchParams?.noteId;
  const noteId = Array.isArray(noteIdParam) ? noteIdParam[0] : noteIdParam || "";

  // If no noteId, find latest or create new and redirect
  if (!noteId) {
    const latest = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latest) {
      redirect(`/?noteId=${latest.id}`);
    }

    const newNote = await prisma.note.create({
      data: { authorId: user.id, text: "" },
    });

    redirect(`/?noteId=${newNote.id}`);
  }

  // Load the note for rendering
  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <CreateNewNote user={user} />
      </div>

      <InputNote noteId={noteId} startingNoteText={note?.text ?? ""} />
    </div>
  );
}
