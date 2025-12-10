"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logOutAction } from '@/action/user';
import { toast } from 'sonner';


function LogoutButton() {
const router = useRouter();
const [loading, setLoading] = useState(false);



const handleLogout= async () =>{
  const id = toast.loading("Logging you out!", {description : "See you soon!"})
    setLoading(true);
   await logOutAction();
setLoading(false);
toast.dismiss(id);
    router.push("/login");
}

  return <Button variant='outline' disabled={loading} className='w-24' onClick={handleLogout}>

    {loading ? <Loader2 className='animate-spin'/> : "Logout"}
  </Button>
}

export default LogoutButton