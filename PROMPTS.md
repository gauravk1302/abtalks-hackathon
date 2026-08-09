# ABTalks Next.js Coding Challenge - Complete Session Documentation & Prompts

This document contains the complete technical specifications, component architectures, bug fixes, and the **exact verbatim prompts** provided during the development of the **nextcode** Next.js platform dashboard[cite: 1].

---

## 1. Project Overview & Tech Stack
* **Framework:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI (`react-day-picker` v9)[cite: 1].
* **Backend & Database:** Node.js, Mongoose, MongoDB, Better-Auth, Clerk[cite: 1].
* **Core Objective:** Building a 60-day coding challenge tracker where users submit daily proofs of work across multiple learning tracks (DSA, Development, System Design, MERN) to maintain streaks and view analytics[cite: 1].

---

## 2. Exact User Prompts & Implementation Mapping

### A. Graph & Progress Tracking Prompts
* **Exact User Prompt:**
  > *"graph mein 4 categories ke hisab se show karein week ka 2 categoreis ka kaam ho gya 50% and jinka hua hai jaise dsa develpomment ka hua to woh point pe disply ho y axis 1,2,3,4 ki ho essa uch"*
* **Implementation Response:**
  * Configured multi-category progress mapping across 4 distinct learning pillars.
  * Adjusted Y-axis scaling (1, 2, 3, 4) to accurately reflect completed categories and weekly milestones (e.g., 50% completion when 2 out of 4 tracks are finished).

### B. Database Integration & UI Color Refinement Prompts
* **Exact User Prompt:**
  > *"database se fetch kar random nhi chal rha hai ajj do kaam kiy ahai mern ka to hai hi nhi section and iska ui mein update kar use more colors"*
* **Implementation Response:**
  * Replaced mock/random data hooks with live backend API database queries (`/api/user/progress`).
  * Added the missing **MERN stack section** into the active tasks and tracking modules.
  * Overhauled the UI color scheme to incorporate vibrant accents, contrasting track tags, and richer palette definitions across components.

---

## 3. Core Component Architecture

### A. Side Calendar & Streak Flame Badges
* **File:** `modules/dashboard/components/calender-section/side-calender.tsx`[cite: 1]
* **Details:** 
  * Designed a custom side schedule grid matching the `#0F0E17` dark aesthetic[cite: 1].
  * Overrode Shadcn's `DayButton` component to render custom SVG flame badge components (`StreakFlameIcon`) on completed streak dates[cite: 1].
  * Forced `!bg-transparent` styling to eliminate default Shadcn white highlight boxes over active days[cite: 1].

### B. Streak Date Logic & Timezone Handling
* **File:** `modules/dashboard/lib/streak-dates.ts`[cite: 1]
* **Details:** 
  * Robustly handles both standard `Date` objects and ISO string formats (`YYYY-MM-DD`)[cite: 1].
  * Applied strict IST midnight offset conversion (`+5:30`) in backend API routes (`app/api/day/[category]/[id]/route.ts`) to prevent date shifting on late-night submissions[cite: 1].

### C. Tasks Panel & Hero Grid Layout
* **Files:** `modules/dashboard/components/tasks-section/task-panel.tsx`, `hero-section-2.tsx`[cite: 1]
* **Details:** 
  * Implemented folder-tab SVG shapes (`FolderTabShape`), progress indicators, and status badges[cite: 1].
  * Configured a responsive 5-column grid (`lg:grid-cols-5`, 3:2 ratio split) to balance the streak summary card and calendar alongside active tracks[cite: 1].

---

## 4. Bug Fixes & Troubleshooting History

1. **Missing Flame Icons:** Connected `fetchUserProgress` to pull actual completed dates instead of passing an empty mock array (`streakDates = []`)[cite: 1].
2. **Type Mismatch Errors:** Fixed strict `.getFullYear()` runtime failures by validating string-based API dates safely in `isStreakDay`[cite: 1].
3. **Mongoose Schema Alignment:** Updated submission endpoints (`/api/day/[category]/[id]`) to push IST-adjusted dates straight into `completedDates: Date[]`[cite: 1].
4. **UI Overlays:** Cleaned up default white selection boxes on the calendar component using inline style overrides[cite: 1].
# User Prompts

- "graph mein 4 categories ke hisab se show karein week ka 2 categoreis ka kaam ho gya 50% and jinka hua hai jaise dsa  develpomment ka hua to woh point pe disply ho y axis  1,2,3,4  ki ho essa uch"

- "database se fetch kar random nhi chal rha hai ajj do kaam kiy ahai mern ka to hai hi nhi  section and iska ui mein update kar use more colors"

- "calendar mein date ke niche dot ki jagah custom flame icon dikhana hai agar streak complete hai toh, aur woh white box highlight hata de aaj ki date pe"

- "backend se date late night submit karne par agle din shift ho rahi hai, usko IST midnight ke hisab se fix kar"

- "leaderboard ke top 3 users ke liye podium structure aur crown badge add kar de styling ke sath"

- "essa karna hai niche images jaise aa rhi hai na usme esse hi karna hai images img1 ans img2 se save hai public folder mein niche images ka stle iske image wali neche ke jaisa karna hai lagake de baki ui improve karna hai logic nhi thik hai and isme ek chhez uske uppar aa rhi hai usko bhi dekh lena h plz"

- "graph mein 4 categories ke hisab se show karein week ka 2 categoreis ka kaam ho gya 50% and jinka hua hai jaise dsa  develpomment ka hua to woh point pe disply ho y axis  1,2,3,4  ki ho essa uch"

- "database se fetch kar random nhi chal rha hai ajj do kaam kiy ahai mern ka to hai hi nhi  section and iska ui mein update kar use more colors"

- "essa karna hai niche images jaise aa rhi hai na usme esse hi karna hai images img1 ans img2 se save hai public folder mein niche images ka stle iske image wali neche ke jaisa karna hai lagake de baki ui improve karna hai logic nhi thik hai and isme ek chhez uske uppar aa rhi hai usko bhi dekh lena h plz"

- "yha vatar aa rhe hai jo user recently solve karta jaye inhe unka avatar show hota rhe aur hai bas 4 hi show karein jada nhi"

- "leader board mein view all ka option ka bhi use kar lena 7 user dikhe top 3 to hai hii and uske nicche appp khud and then kuch usrs and view all pe sab dikhe"

- "4 categories hai usme se ek hi kar sakte ho din mein matlab har categories mein ek hiii kar paoge"

- "lekin woh to defined hai already to yeah error kyu hai :\New folder (2)\nextcode>npx tsx scripts/completed-dates.ts
Migration failed: TypeError: (0 , import_db.default) is not a function
    at main (D:\New folder (2)\nextcode\lib\db.ts:47:9)
    at User (D:\New folder (2)\nextcode\lib\db.ts:83:1)
    at Object.<anonymous> (D:\New folder (2)\nextcode\lib\db.ts:86:2)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)
    at Object.transformer (D:\New folder (2)\nextcode\node_modules\tsx\dist\register-CeSc3Ioe.cjs:9:3619)
    at Module.load (node:internal/modules/cjs/loader:1481:32)
    at Module._load (node:internal/modules/cjs/loader:1300:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1504:12)
D:\New folder (2)\nextcode>npx tsx scripts/completed-dates.ts
D:\New folder (2)\nextcode\lib\db.ts:6
  throw new Error(\"Please define the MONGODB_URI environment variable inside .env.local\");
        ^
Error: Please define the MONGODB_URI environment variable inside .env.local
    at mongoose (D:\New folder (2)\nextcode\lib\db.ts:6:9)
    at Object.<anonymous> (D:\New folder (2)\nextcode\lib\db.ts:28:16)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)
    at Object.transformer (D:\New folder (2)\nextcode\node_modules\tsx\dist\register-CeSc3Ioe.cjs:9:3619)
    at Module.load (node:internal/modules/cjs/loader:1481:32)
    at Module._load (node:internal/modules/cjs/loader:1300:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1504:12)
    at require (node:internal/modules/helpers:152:16)
Node.js v24.11.1
D:\New folder (2)\nextcode>"

- "isme images jo diaplay ho rhi hai unko ache se rakhna hai matlab ui de ache se dikhe woh and baki ksi chez ko hat mat lagana h"

- "Purane test data ko clean karne ke liye database mein user document ke completedDates array ya test records ko ek baar reset kar lo."

- "Ensure karo ki side-calender.tsx mein !bg-transparent aur inline backgroundColor: 'transparent' applied hai taaki calendar ka default white highlight override ho jaye."