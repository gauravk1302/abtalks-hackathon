/**
 * app/api/category-activity/route.ts
 *
 * For each category, returns up to 4 users who most recently
 * completed a task in that category (sorted by their latest
 * completedDates entry), plus a total solver count.
 */

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const CATEGORIES = ["development", "dsa", "system-design", "mern"];
const MAX_AVATARS = 4;

export async function GET() {
  await dbConnect();

  const users = await User.find({});

  const categoryActivity: Record<
    string,
    { avatars: { name: string; image?: string }[]; total: number }
  > = {};

  for (const cat of CATEGORIES) {
    const solvers = users
      .map((u: any) => {
        const catProgress = (u.categories || []).find((c: any) => c.category === cat);
        if (
          !catProgress ||
          !Array.isArray(catProgress.completedDates) ||
          catProgress.completedDates.length === 0
        ) {
          return null;
        }

        const latest = catProgress.completedDates.reduce(
          (max: Date, d: Date) => (new Date(d) > max ? new Date(d) : max),
          new Date(0)
        );

        return { name: u.name || "Anonymous", image: u.image, latest };
      })
      .filter(Boolean) as { name: string; image?: string; latest: Date }[];

    // Most recently active solver first
    solvers.sort((a, b) => b.latest.getTime() - a.latest.getTime());

    categoryActivity[cat] = {
      avatars: solvers.slice(0, MAX_AVATARS).map(({ name, image }) => ({ name, image })),
      total: solvers.length,
    };
  }

  return NextResponse.json({ categoryActivity });
}