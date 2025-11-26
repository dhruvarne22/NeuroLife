import React, { startTransition, useTransition } from 'react'
import { Button } from './ui/button'
import { Loader2, Trash2 } from 'lucide-react'

import { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,  AlertDialog, AlertDialogContent, AlertDialogTrigger } from './ui/alert-dialog'
import { deleteNoteAction } from '@/action/note'
import { useRouter, useSearchParams } from 'next/navigation'
type Props= {
    noteId : string;
    localNoteDel : (noteId: string) => void;
}
function DeleteNoteBtn({noteId , localNoteDel} : Props) {

const [isDeleting, startTransition] = useTransition();
const noteIdparam = useSearchParams().get("noteId") || "";
    const router = useRouter();



    const deleteNote = () =>{

startTransition(async ()=>{
     
    const {errorMessage} =     await deleteNoteAction(noteId);

    console.log(noteId);
    console.log(noteIdparam);
if(!errorMessage){

    localNoteDel(noteId);

    if(noteId === noteIdparam){
router.replace('/');
    }
}else{
    console.log(errorMessage);
}

})
    
    }


  return (



    <AlertDialog>
<AlertDialogTrigger asChild>

   <Button className='absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3 ' variant="ghost">

    <Trash2/>
   </Button>
</AlertDialogTrigger>


     <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          onClick={deleteNote}
          className='bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24'>{isDeleting ? <Loader2 className='animate-spin'/> : "Delete"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteNoteBtn