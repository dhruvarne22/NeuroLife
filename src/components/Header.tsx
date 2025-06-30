import { shadow } from '@/style/utils'
import Link from 'next/link'
import React from 'react'
import LogoutButton from './logoutButton';
import { Button } from './ui/button';
import { DarkModeToggle } from './darkModeToggle';
import { getUser } from '@/auth/server';

async function Header() {
  const user = await getUser();
  return (
<header className='relative flex h-24 w-full items-center justify-between bg-popover-500 px-3 sm:px-8'
style={{boxShadow: shadow}}
>
<Link className="flex items-end gap-2" href="/">
<h1 className='flex flex-col pb-1 text-2xl font-semibold leading-6'>NeuroLife<span className='text-xs'>Made By CWD</span></h1>
</Link>

<div className = 'flex gap-4'>
 
  {user ?
   (<LogoutButton/>)
    : (
<>
<Button asChild>
  <Link href="/sign-up" className='hidden sm:block'>
  SignUp
  </Link>
</Button>

<Button asChild>
  <Link href="/login" className='outline'>
  Login
  </Link>
</Button>
</>

  )}


  <DarkModeToggle/>

</div>
</header>
  )
}

export default Header