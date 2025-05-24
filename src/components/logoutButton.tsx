"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function LogoutButton() {
const router = useRouter();
const [loading, setLoading] = useState(false);



const handleLogout= async () =>{
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    router.push("/login");
}

  return <Button variant='outline' disabled={loading} className='w-24' onClick={handleLogout}>

    {loading ? <Loader2 className='animate-spin'/> : "Logout"}
  </Button>
}

export default LogoutButton