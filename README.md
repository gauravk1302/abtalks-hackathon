Markdown
# ABTalks - 60-Day Coding Challenge 🚀

Designed specifically for Indian college students, **ABTalks** is a platform to build daily coding habits, push commits to GitHub, share proof of work on LinkedIn, and build a public learning streak to get noticed by recruiters.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Authentication:** NextAuth.js
* **UI Components:** Radix UI / Shadcn UI primitives
* **Icons:** Lucide React

---

## 📂 Project Flow & Routes

The application follows a clean and robust user flow optimized for college students and recruiters:

1. **Landing Page (`/`)**: Public overview page explaining the 60-day challenge and benefits.
2. **Sign In (`/sign-in`)**: Secure authentication page for students.
3. **Student Dashboard (`/dashboard`)**: Central hub showing user progress, leaderboards, achievements, and calendar streaks.
4. **Challenge Day (`/day/12`)**: Specific day detail page featuring tasks and a proof-of-work submission form (GitHub commits & LinkedIn posts).

---

## ⚙️ Getting Started & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/abtalks-challenge.git](https://github.com/your-username/abtalks-challenge.git)
   cd abtalks-challenge
Install dependencies:

Bash
npm install
Set up environment variables:
Create a .env file in the root directory and add your NextAuth and database credentials:

Code snippet
AUTH_SECRET=your_nextauth_secret_here
DATABASE_URL=your_database_connection_string_here
Run the development server:

Bash
npm run dev
Open http://localhost:3000 with your browser to see the application.

🔒 Security & Middleware
Protected routes like /dashboard require authentication and will automatically redirect unauthenticated users to /sign-in.

Logged-in users are restricted from accessing auth pages directly.

📄 License
This project is built for the 60-Day Coding Challenge. All rights reserved.