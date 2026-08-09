import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Query by email to prevent E11000 duplicate key error
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          authUserId: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
        $setOnInsert: {
          email: session.user.email,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Collect all unique completed dates across all categories
    const completedDatesSet = new Set<string>();

    if (user.categories && Array.isArray(user.categories)) {
      user.categories.forEach((cat: any) => {
        if (Array.isArray(cat.completedDates)) {
          cat.completedDates.forEach((d: string | Date) => {
            if (!d) return;
            const dateObj = new Date(d);
            if (!isNaN(dateObj.getTime())) {
              // Format as ISO Date String YYYY-MM-DD safely
              const formattedDate = dateObj.toISOString().split("T")[0];
              completedDatesSet.add(formattedDate);
            }
          });
        }
      });
    }

    const completedDatesArray = Array.from(completedDatesSet);

    return NextResponse.json({
      name: user.name,
      image: user.image,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      achievements: user.achievements || [],
      categories: user.categories || [],
      completedDates: completedDatesArray,
    });
  } catch (error: any) {
    console.error("Error in GET /api/user/progress:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}