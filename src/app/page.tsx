import { getUser } from "@/auth/server";
import CreateNewNote from "@/components/CreateNewNote";
import InputNote from "@/components/InputNote";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

export default async function Home(props: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {

  const searchParams = await props.searchParams; 

  const rawUser = await getUser();

  // User not logged in (should not happen because middleware protects this)
  if (!rawUser) {
    redirect("/login");
  }

  const user = {
    id: rawUser.id,
    name: rawUser.name ?? "NeuroLife User",
    email: (rawUser as any).email ?? "",
  };

  // Extract noteId from URL
  const noteIdParam = searchParams.noteId;
  const noteId = Array.isArray(noteIdParam) ? noteIdParam[0] : noteIdParam || "";

  // ⚡ If no noteId in URL → determine what to do
  if (!noteId) {
    // Fetch latest note
    const latestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestNote) {
      redirect(`/?noteId=${latestNote.id}`);
    }

    // No note found → create one
    const newNote = await prisma.note.create({
      data: {
        authorId: user.id,
        text: "",
      },
    });

    redirect(`/?noteId=${newNote.id}`);
  }

  // Load the note from DB
  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <CreateNewNote user={user} />
      </div>

      <InputNote noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}
