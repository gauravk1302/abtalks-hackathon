/**
 * scripts/fix-completed-dates.ts
 *
 * One-time migration: re-normalizes every `completedDates` entry across
 * all users/categories into the correct IST-midnight-as-UTC format.
 *
 * Run once with: npx tsx scripts/fix-completed-dates.ts
 */

// Running via `npx tsx` directly (not through `next dev`) means Next.js's
// automatic env-file loading doesn't happen — load it explicitly, before
// anything else is imported.
for (const envFile of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(envFile);
    break;
  } catch {
    // file doesn't exist — try the next one
  }
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getISTMidnightUTC(referenceDate: Date): Date {
  const shifted = new Date(referenceDate.getTime() + IST_OFFSET_MS);
  return new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate())
  );
}

async function main() {
  // Dynamic imports (not static `import`) so lib/db.ts only runs — and
  // reads process.env.MONGODB_URI — AFTER loadEnvFile() above has run.
  // Static imports get hoisted above everything else in the file, which
  // is what caused "MONGODB_URI not defined" even with loadEnvFile first.
  const { default: dbConnect } = await import("../lib/db");
  const { default: User } = await import("../models/User");

  await dbConnect();

  const users = await User.find({});
  let usersTouched = 0;
  let datesFixed = 0;

  for (const user of users) {
    let userChanged = false;

    for (const cat of user.categories) {
      if (!Array.isArray(cat.completedDates)) continue;

      const fixed = cat.completedDates.map((d: Date) => {
        const before = new Date(d).getTime();
        const after = getISTMidnightUTC(new Date(d));
        if (after.getTime() !== before) {
          datesFixed++;
          userChanged = true;
        }
        return after;
      });

      cat.completedDates = fixed;
    }

    if (userChanged) {
      user.markModified("categories");
      await user.save();
      usersTouched++;
    }
  }

  console.log(`Done. Users updated: ${usersTouched}. Dates fixed: ${datesFixed}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});