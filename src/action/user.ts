"use server";
import { createClient, getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


// ------------------ SIGNUP ACTION ------------------
export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    // Check if email already exists in your custom `User` table
    const tableUser = await prisma.user.findUnique({
      where: { email },
    });

    if (tableUser) {
      return { errorMessage: "User already exists. Please login." };
    }

    // Create user in Supabase Auth
    const { data, error } = await auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("User ID not found after sign up");

    // Mirror user into your custom `User` table using the same ID
    await prisma.user.create({
      data: {
        id: userId, // Must match auth.users.id
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    console.error("Signup Error:", error);
    return handleError(error);
  }
};

// ------------------ LOGIN ACTION ------------------
export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("User ID not found after login");

    // Optional: Ensure the user exists in your custom User table
    const userInTable = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userInTable) {
      return { errorMessage: "User account is corrupted. Please contact support." };
    }

    return { errorMessage: null };
  } catch (error) {
    console.error("Login Error:", error);
    return handleError(error);
  }
};

// ------------------ LOGOUT ACTION ------------------
export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};




export const askNeuroAi = async (newQuestion : string[], responses : string[])=>{
  const user  = await getUser();

  if(!user) throw new Error("You must be logged in to chat with NeuroAI!");

  const notes = await prisma.note.findMany({
    where : {authorId : user.id},
    orderBy : {createdAt : 'desc'},
    select : {text : true, createdAt : true,updatedAt:  true}
  });


  if(notes.length === 0) {
    return "No notes has been created yet!";
  }

  const formattedNotes = notes.map((note)=>
    `
    Text : ${note.text}
    Created at : ${note.createdAt}
    Last updated at : ${note.updatedAt}
    `.trim(),
  ).join("\n")

  const messages : ChatCompletionMessageParam[] = [
{
  role : "developer",
  content : `
    You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
  `
}
  ];

 for (let i=0; i<newQuestion.length; i++){
messages.push({role : "user", content : newQuestion[i]});

if(responses.length > i){
  messages.push({role : "assistant", content : responses[i]});  
 }
 }


 const client = new OpenAI({apiKey : process.env.OPENAI_API_KEY});

 const completions = await client.chat.completions.create({
  model : "gpt-4o-mini",
  messages
 });

 return completions.choices[0].message.content || "A problem has occrred";

 
 
}