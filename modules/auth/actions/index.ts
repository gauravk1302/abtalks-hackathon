"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User"; // Aapke Mongoose User Model ka path

/**
 * MongoDB Mongoose ke zariye user fetch karega
 */
export const getUserById = async (id: string) => {
  try {
    await dbConnect();

    // authUserId (NextAuth ID) ya MongoDB _id dono se check kar raha hai
    const user = await User.findOne({
      $or: [{ authUserId: id }, { _id: id }],
    }).lean();

    if (!user) return null;

    // JSON serializable object return karne ke liye _id ko string mein convert kar rahe hain
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("getUserById Error:", error);
    return null;
  }
};

/**
 * Account/User details fetch karne ke liye (Agar authUserId se search karna ho)
 */
export const getAccountByUserId = async (userId: string) => {
  try {
    await dbConnect();

    const user = await User.findOne({ authUserId: userId }).lean();

    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("getAccountByUserId Error:", error);
    return null;
  }
};

/**
 * Current Session User Return karega
 */
export const currentUser = async () => {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("currentUser Error:", error);
    return null;
  }
};