import mongoose, { Schema, models, model } from "mongoose";

export interface ICategoryProgress {
  category: string;          // "dsa", "development", "system-design", "mern"
  currentDay: number;        // student abhi kaunse din pe hai
  completedDays: number[];   // kaunse din (number) complete ho chuke
  completedDates: Date[];    // 👈 NEW: usi din ki actual calendar date
  startedAt: Date;
}

export interface IUser {
  authUserId: string;        // NextAuth session.user.id se link
  email: string;
  name?: string;
  image?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;     // streak calculate karne ke liye
  categories: ICategoryProgress[];
  achievements: string[];    // e.g. "7-Day Streak", "First Submission"
}

const CategoryProgressSchema = new Schema<ICategoryProgress>(
  {
    category: { type: String, required: true },
    currentDay: { type: Number, default: 1 },
    completedDays: { type: [Number], default: [] },
    completedDates: { type: [Date], default: [] }, // 👈 NEW
    startedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    categories: { type: [CategoryProgressSchema], default: [] },
    achievements: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema, "app_users");