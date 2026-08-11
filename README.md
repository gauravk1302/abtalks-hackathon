# ABTalks - 60-Day Coding Challenge 🚀

Designed specifically for Indian college students, **ABTalks** is a platform to build daily coding habits, push commits to GitHub, share proof of work on LinkedIn, and build a public learning streak to get noticed by recruiters.

**🔗 Live Demo:** [abtalks-hackathon-xgjj.vercel.app](https://abtalks-hackathon-xgjj.vercel.app)

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Authentication:** NextAuth.js
* **Database:** MongoDB Atlas (Mongoose)
* **UI Components:** Radix UI / Shadcn UI primitives
* **Icons:** Lucide React

---

## 📂 Project Flow & Routes

The application follows a clean and robust user flow optimized for college students and recruiters:

1. **Landing Page (`/`)** — Public overview page explaining the 60-day challenge and benefits.
2. **Sign In (`/sign-in`)** — Secure authentication page for students (Google & GitHub).
3. **Student Dashboard (`/dashboard`)** — Central hub showing user progress, leaderboards, achievements, and calendar streaks.
4. **Challenge Day (`/day/[category]/[id]`)** — Category-specific day detail page featuring tasks and a proof-of-work submission form (GitHub commits & LinkedIn posts).

---

## ⚙️ Getting Started & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/abtalks-challenge.git
   cd abtalks-challenge
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your credentials:

   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   AUTH_SECRET=your_nextauth_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🔒 Security & Middleware

* Protected routes like `/dashboard` require authentication and will automatically redirect unauthenticated users to `/sign-in`.
* Logged-in users are restricted from accessing auth pages directly.

---

## 📄 License

This project is built for the 60-Day Coding Challenge. All rights reserved.
