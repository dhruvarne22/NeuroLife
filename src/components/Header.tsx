import { shadow } from '@/style/utils'
import Link from 'next/link'
import React from 'react'
import LogoutButton from './logoutButton';
import { Button } from './ui/button';
import { DarkModeToggle } from './darkModeToggle';
import { getUser } from '@/auth/server';
import { HelpCircle, Home, LayoutGrid, Share2, Target } from 'lucide-react';

async function Header() {
  const user = await getUser();
  return (
<header className='relative flex h-24 w-full items-center justify-between bg-popover-500 px-3 sm:px-8'
style={{boxShadow: shadow}}
>
<nav className='flex items-center gap-6 text-muted-foreground'>
<Link href="/" className='hover:text-primary transition'>
<Home size={22}/>
</Link>


<Link href="/timeline" className='hover:text-primary transition'>
<LayoutGrid size={22}/>
</Link>


<Link href="/ask" className='hover:text-primary transition'>
<HelpCircle size={22}/>
</Link>

<Link href="/goal" className='hover:text-primary transition'>
<Share2 size={22}/>
</Link>

<Link href="/persona" className='hover:text-primary transition'>
<Target size={22}/>
</Link>
</nav>
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