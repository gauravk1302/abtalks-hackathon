import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChallengeTask from "@/models/ChallengeTask";
import User from "@/models/User";
import { auth } from "@/auth";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getISTMidnightUTC(referenceDate: Date = new Date()): Date {
  const shifted = new Date(referenceDate.getTime() + IST_OFFSET_MS);
  return new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate())
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const { category, id } = await params;
  await dbConnect();

  const task = await ChallengeTask.findOne({ category, day: Number(id) });

  if (!task) {
    return NextResponse.json({ error: "Task not found for this category" }, { status: 404 });
  }

  return NextResponse.json(task, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const { category, id } = await params;
  const body = await request.json();
  const day = Number(id);

  await dbConnect();

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ authUserId: session.user.id });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 1. User ki category check karo
  let categoryProgress = user.categories.find((c: any) => c.category === category);

  if (!categoryProgress) {
    user.categories.push({
      category,
      currentDay: 1,
      completedDays: [],
      completedDates: [],
      startedAt: new Date(),
    });
    categoryProgress = user.categories[user.categories.length - 1];
  }

  if (!Array.isArray(categoryProgress.completedDates)) {
    categoryProgress.completedDates = [];
  }

  const todayIST = getISTMidnightUTC();

  // 🔒 LOGIC: Check karo ki kya is Category mein AAJ task ho chuka hai?
  const alreadyCompletedToday = categoryProgress.completedDates.some((d: Date | string) => {
    const compDate = new Date(d);
    return compDate.getTime() === todayIST.getTime();
  });

  if (alreadyCompletedToday) {
    return NextResponse.json(
      {
        error: "Completed today's task!",
        alreadyCompletedToday: true,
        message: "You have already completed today's task for this category. Come back tomorrow!",
      },
      { status: 400 }
    );
  }

  // 2. Task status Database mein mark completed karo
  const task = await ChallengeTask.findOneAndUpdate(
    { category, day },
    {
      status: "completed",
      githubUrl: body.githubUrl,
      linkedinUrl: body.linkedinUrl,
      imageUrl: body.imageUrl || "",
    },
    { returnDocument: "after" }
  );

  if (!task) {
    return NextResponse.json({ error: "Task not found to update" }, { status: 404 });
  }

  // 3. User progress update karo
  if (!categoryProgress.completedDays.includes(day)) {
    categoryProgress.completedDays.push(day);
    categoryProgress.completedDates.push(todayIST);
  }

  // Next day unlock handle
  if (day === categoryProgress.currentDay) {
    categoryProgress.currentDay = Math.min(day + 1, 60);
  }

  // ⚡ STREAK & BREAK LOGIC (IST Safe)
  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  let streakBroken = false;

  if (!lastActive || lastActive.getTime() !== todayIST.getTime()) {
    const yesterday = new Date(todayIST);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    if (lastActive && lastActive.getTime() === yesterday.getTime()) {
      // Continuous streak maintained
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      // Streak tut gayi hai kyunki beech me gap aa gaya tha ya pehla task hai
      streakBroken = lastActive !== null; // Agar pehle se koi active date thi aur kal ki nahi thi toh tut gayi
      user.currentStreak = 1; // Fresh start from 1
    }

    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    user.lastActiveDate = todayIST;
  }

  user.markModified("categories");
  await user.save();

  return NextResponse.json({ 
    success: true, 
    task, 
    currentStreak: user.currentStreak,
    streakBroken 
  });
}