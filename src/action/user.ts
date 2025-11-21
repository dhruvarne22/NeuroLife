"use server";
import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

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
