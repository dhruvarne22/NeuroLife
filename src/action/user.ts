"use server"
import { createClient } from "@/auth/server"
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const signUpAction = async (email: string, password: string) => {


    try {

        const { auth } = await createClient();
const tableUser = await prisma.user.findFirst({
    where : {
        email : email
    }
});

console.log("tableUser");
console.log(tableUser);

if(tableUser){
    console.log("ERORORRO");
    return {errorMessage  : "User already exists. Please login."}
}


        const { data, error } = await auth.signUp({
            email, password
        });


        if (error) throw error;

        const userid = data.user?.id;
const user = data.user;
        if (!userid) throw new Error("User ID not found after sign up");

await prisma.user.create(
    {
    
    data : {
id : userid,
email
}

}

);






        return { errorMessage: null };
    } catch (error) {
        console.log("error11111");
        console.log(error);
         return handleError(error);
    }

}


export const loginAction = async (email: string, password: string) => {

    try {

        const { auth } = await createClient();

        const { data, error } = await auth.signInWithPassword({
            email, password
        });


        if (error) throw error;

        const userid = data.user?.id;

        if (!userid) throw new Error("User ID not found after login");



const user = data.user;
if(!user){
    return {errorMessage : "User not found. Please sign up."}
}



        console.log("LOGGED IN SUCCESS");





        return { errorMessage: null };
    } catch (error) {
        console.log(error);
      return handleError(error);
    }
}


export const logOutAction = async () => {

    try {
            const {auth} = await createClient();

    const {error} = await auth.signOut();

    if(error) throw error;

    return {errorMessage : null};
    } catch (error) {
        return {errorMessage : error};
    }

}