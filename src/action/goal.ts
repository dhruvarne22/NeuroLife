"use server"

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";


export async function getUserGoals(){
  
    const user = await getUser();

    if(!user) return null;

    return prisma.userGoal.findFirst({
        where : {userId : user.id}
    });

 
}


export async function saveUserGoals(goalText : string)
{
  const user = await getUser();

    if(!user) return null;

    const existing = await prisma.userGoal.findFirst({
        where : {userId : user.id}
    });

    if(existing){
        return prisma.userGoal.update({
            where : {id : existing.id},
            data : { goalsText : goalText}
        });
    }
    return prisma.userGoal.create({
        data : {userId : user.id, goalsText :   goalText}
    })

}