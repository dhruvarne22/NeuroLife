"use server"
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const updateNoteAction = async (noteId : string , text : string) => {
try {
    
    const user  = await getUser();

    if(!user) throw Error("Login to update Note");
console.log("noteidDDD");
console.log(noteId);

    await prisma.note.update({
        where : {id : noteId},
        data : {text}
    });

    return {errorMessage : null}
} catch (error) {
    console.log("9error");
    console.log(error);
    return handleError(error);
}



}






export const createNoteAction = async (noteid : string) => {
try {
    
    const user  = await getUser();

    if(!user) throw Error("Login to update Note");

    await prisma.note.create({
        
        data : {
            id :noteid,
            authorId : user.id,
            text : ""
        }
    });

    return {errorMessage : null}
} catch (error) {

    console.log(error);
    return handleError(error);
}





}



export const deleteNoteAction = async (noteId: string) => { 
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};