import React from 'react'
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import AuthForm from '@/components/authForm';


export const metadata: Metadata = {
  title: "SignUp",

};

function SignUpPage() {
  return <div className='mt-20 flex flex-1 flex-col items-center'>
    <Card className='w-full max-w-md'>
      <CardHeader className='mb-4'>
        <CardTitle className='text-center text-3xl'>SignUp</CardTitle>
<AuthForm type='sign-up'/>
      </CardHeader>
  
    </Card>
  </div>
}

export default SignUpPage