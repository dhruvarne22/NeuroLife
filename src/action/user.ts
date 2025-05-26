"use server"
import { createClient } from "@/auth/server"

export const signUpAction = async (email: string ,password : string) => {


    try {
        
        const {auth} = await createClient();

    const {data , error } = await auth.signUp({
        email, password
    });


    if(error) throw error;

    const userid = data.user?.id;

    if(!userid) throw new Error("User ID not found after sign up");


    return {errorMessage  :null};
    } catch (error) {
        console.log(error);
     return {errorMessage : error};   
    }
    
}