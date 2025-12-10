"use client"
import  Link  from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { CardContent, CardFooter } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { signUpAction } from '@/action/user'

import { loginAction } from '../action/user'
import { showErrorToast, showSuccessToast } from '@/lib/toast-utils'
import { toast } from 'sonner'


type Props ={
    type: "login" | "sign-up"
}

function AuthForm({type} : Props) {
const isLoginForm = type === "login";


const handleSubmit =  async (formData : FormData)=>{



const email = formData.get('email') as string;
const password = formData.get('password') as string;

let  errorMessage = null;

if(isLoginForm){

  errorMessage = (await loginAction(email, password)).errorMessage;


}else{
  errorMessage = (await signUpAction(email, password)).errorMessage;


}

console.log("errorMessage23323424");
console.log(errorMessage);
toast.error("Error occured", {description : errorMessage});
if(!errorMessage){


if(isLoginForm){
toast.success("Logged in successfully", {description : "Welcome back to Neurolife!"});


}else{
  toast.info("Plesae confirm your email", {description : `Check your inbox ${email}`});


}
  
}else{
toast.error("Error Occured", {description : errorMessage});

  console.log(errorMessage);
}




}

  return <form className='flex flex-col gap-4' action={handleSubmit}>

          <CardContent className='grid w-full items-center gap-4'>


<div className='flex flex-col space-y-1.5'>

            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' placeholder='Enter your email' type='email' required />
            </div>
<div className='flex flex-col space-y-1.5'>
               <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' placeholder={isLoginForm ? 'Enter your password' : 'Set your password'} type='password' required />
            </div>
          </CardContent>
              <CardFooter className='mt-4 flex flex-col gap-6'>
        <Button>
        {isLoginForm ? 'Login' : 'Sign Up'} 
        </Button>
<p className='text-xs '>
{isLoginForm ? "Do not have an account?" : 'Already have an account?'}       <Link href={isLoginForm ? "/sign-up" : "/login"} className='text-blu-500 underline'>{isLoginForm ? "Register" : "Login"}</Link>
</p>
  
      </CardFooter>
        </form>
}

export default AuthForm