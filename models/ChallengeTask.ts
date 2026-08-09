import mongoose, { Schema, models, model } from "mongoose";

export type TaskStatus = "completed" | "pending" | "running" | "review" | "missed";

export interface IChallengeTask {
  category: string;   // "dsa", "development", "system-design", "mern"
  day: number;         // 1 to 60
  title: string;
  description: string;
  status: TaskStatus;
  githubUrl?: string;
  linkedinUrl?: string;
  userId?: mongoose.Types.ObjectId; // auth aane ke baad use hoga
  imageUrl?: string;
}

const ChallengeTaskSchema = new Schema<IChallengeTask>(
  {
    category: { type: String, required: true, index: true },
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "running", "review", "missed"],
      default: "pending",
    },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// Ek category ke andar ek day sirf ek hi baar exist kare
ChallengeTaskSchema.index({ category: 1, day: 1 }, { unique: true });

export default models.ChallengeTask || model<IChallengeTask>("ChallengeTask", ChallengeTaskSchema);