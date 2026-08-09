import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get Logged in User ID (Clerk/Better-Auth se)
    // const user = await getAuthUser();

    // 2. Database Query: Fetch all tasks where status is "completed"
    // Eg: const completedTasks = await db.tasks.find({ userId: user.id, status: "completed" });
    
    // MOCK DB RESPONSE - (Isko apne actual DB call se replace kar dena)
    const mockCompletedDatesFromDB = [
      "2026-08-01T00:00:00Z",
      "2026-08-02T00:00:00Z",
      "2026-08-04T00:00:00Z"
    ];
    
    // 3. Calculate Stats
    const currentDay = mockCompletedDatesFromDB.length;
    const totalDays = 60;
    const completionRate = Math.round((currentDay / totalDays) * 100);

    return NextResponse.json({
      completedDates: mockCompletedDatesFromDB, // Array of date strings
      currentDay: currentDay,
      totalDays: totalDays,
      completionRate: completionRate
    });

  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}