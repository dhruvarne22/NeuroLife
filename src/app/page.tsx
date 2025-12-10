import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import CreateNewNote from "@/components/CreateNewNote";
import InputNote from "@/components/InputNote";
import { v4 as uuidv4 } from "uuid";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
  // 1. Authenticate user
  const authUser = await getUser();
  if (!authUser) {
    redirect("/login");
  }

  // Normalize user shape for components
  const user = {
    id: authUser.id,
    name: "NeuroLife User",
    email: authUser.email ?? "",
  };

  // 2. Determine noteId from URL
  const rawNoteId = searchParams.noteId;
  const noteId = Array.isArray(rawNoteId)
    ? rawNoteId[0]
    : rawNoteId || "";

  // 3. If no noteId → autoselect or create note
  if (!noteId) {
    const latestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    let resolvedNoteId = latestNote?.id;

    // If user has *no notes*, create a new one
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

    // Redirect to page with noteId in URL
    redirect(`/?noteId=${resolvedNoteId}`);
  }

  // 4. Load the note content
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user.id,
    },
  });

  // If somehow invalid noteId → redirect to newest
  if (!note) {
    redirect("/");
  }

  // 5. Render UI
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
