import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import CreateNewNote from "@/components/CreateNewNote";
import InputNote from "@/components/InputNote";
import { v4 as uuidv4 } from "uuid";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // 1. Authenticate user
  const authUser = await getUser();
  if (!authUser) {
    redirect("/login");
  }

  const user = {
    id: authUser.id,
    name: "NeuroLife User",
    email: authUser.email ?? "",
  };

  // 2. Extract noteId safely
  const rawNoteId = searchParams?.noteId;
  const noteId = Array.isArray(rawNoteId)
    ? rawNoteId[0]
    : rawNoteId || "";

  // 3. Auto-select latest note if none
  if (!noteId) {
    const latestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    let resolvedNoteId = latestNote?.id;

    if (!resolvedNoteId) {
      const newNote = await prisma.note.create({
        data: {
          id: uuidv4(),
          authorId: user.id,
          text: "",
        },
      });
      resolvedNoteId = newNote.id;
    }

    redirect(`/?noteId=${resolvedNoteId}`);
  }

  // 4. Load note
  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  if (!note) {
    redirect("/");
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <CreateNewNote user={user} />
      </div>

      <InputNote
        noteId={noteId}
        startingNoteText={note.text || ""}
      />
    </div>
  );
}
