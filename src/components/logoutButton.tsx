"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logOutAction } from '@/action/user';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function LogoutButton() {
const router = useRouter();
const [loading, setLoading] = useState(false);



const handleLogout= async () =>{
    setLoading(true);
   await logOutAction();
setLoading(false);
    router.push("/login");
}

  return <Button variant='outline' disabled={loading} className='w-24' onClick={handleLogout}>

    {loading ? <Loader2 className='animate-spin'/> : "Logout"}
  </Button>
}

export default LogoutButton