/**
 * app/api/leaderboard/route.ts
 *
 * Returns all users ranked by total completed tasks (across all
 * categories), tie-broken by who reached that count sooner
 * (earlier lastActiveDate), then alphabetically by name.
 */

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
  await dbConnect();
  const session = await auth();

  const users = await User.find({});

  const ranked = users.map((u: any) => {
    const totalCompleted = (u.categories || []).reduce(
      (sum: number, c: any) => sum + (c.completedDays?.length || 0),
      0
    );

    return {
      authUserId: u.authUserId,
      name: u.name || "Anonymous",
      image: u.image,
      totalCompleted,
      lastActiveDate: u.lastActiveDate || u.updatedAt || null,
    };
  });

  ranked.sort((a, b) => {
    // 1. Jyada tasks complete kiye — upar
    if (b.totalCompleted !== a.totalCompleted) {
      return b.totalCompleted - a.totalCompleted;
    }

    // 2. Same count — jisne pehle (jaldi) complete kiya, upar
    const aTime = a.lastActiveDate ? new Date(a.lastActiveDate).getTime() : Infinity;
    const bTime = b.lastActiveDate ? new Date(b.lastActiveDate).getTime() : Infinity;
    if (aTime !== bTime) {
      return aTime - bTime;
    }

    // 3. Phir naam, A-Z
    return a.name.localeCompare(b.name);
  });

  const withRank = ranked.map((u, i) => ({ ...u, rank: i + 1 }));

  return NextResponse.json({
    leaderboard: withRank,
    currentUserId: session?.user?.id || null,
  });
}