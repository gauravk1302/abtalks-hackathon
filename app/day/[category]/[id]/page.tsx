"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle } from "lucide-react";

interface TaskData {
  day: number;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "review" | "missed";
  githubUrl?: string;
  linkedinUrl?: string;
  imageUrl?: string;
}

// 🎨 Exactly matching category Meta Colors
const categoryThemes: Record<string, { primary: string; text: string }> = {
  development: { primary: "#C6E98F", text: "text-[#1E2C47]" },
  dsa: { primary: "#22D3EE", text: "text-[#1E2C47]" },
  "system-design": { primary: "#E8D7F1", text: "text-[#1E2C47]" },
  mern: { primary: "#FFCB77", text: "text-[#1E2C47]" },
  default: { primary: "#31C3EE", text: "text-[#1E2C47]" },
};

export default function ChallengeDayPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = use(params);

  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Image handling states
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const currentTheme = categoryThemes[category.toLowerCase()] || categoryThemes.default;

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/day/${category}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTask(data);
          if (data.githubUrl) setGithubUrl(data.githubUrl);
          if (data.linkedinUrl) setLinkedinUrl(data.linkedinUrl);
          if (data.imageUrl) setImageUrl(data.imageUrl);
        } else {
          setTask(null);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [category, id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/day/${category}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl, linkedinUrl, imageUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setTask(data.task);

        // 🔄 Real-time calendar & streak update trigger
        window.dispatchEvent(new Event('progress-updated'));

        if (data.streakBroken) {
          alert("⚠️ Last Streak Broken!! Don't worry, from now new streak will start. Keep pushing! 🔥");
        } else {
          alert("🎯 Challenge Submitted Successfully! Streak maintained! 🔥");
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error submitting proof:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center p-4"
        style={{ backgroundColor: '#0B0A10' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${currentTheme.primary} transparent transparent transparent` }}
          ></div>
          <p 
            className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-400 animate-pulse"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            Loading Task...
          </p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div 
        className="min-h-screen text-white p-4 sm:p-6 flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0B0A10' }}
      >
        <div className="bg-[#151320] p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] border border-white/10 text-center max-w-md w-full shadow-2xl">
          <h1 
            className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-white"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            Task Not Found
          </h1>
          <p 
            className="text-xs sm:text-sm font-medium text-gray-400 mb-6 sm:mb-8 leading-relaxed"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            No task exists for Day {id} in {category.toUpperCase()}.
          </p>
          <Link
            href="/dashboard"
            className={`px-6 sm:px-8 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider transition hover:brightness-110 inline-block ${currentTheme.text}`}
            style={{ backgroundColor: currentTheme.primary, fontFamily: "'Libre Franklin', sans-serif" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white flex justify-center items-center p-3 sm:p-6 md:p-8"
      style={{ backgroundColor: '#0B0A10' }}
    >
      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-[#151320] border border-white/10 rounded-[20px] sm:rounded-[28px] p-4 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col my-auto">

        {/* Top Accent Line */}
        <div
          className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
          style={{ color: currentTheme.primary }}
        ></div>

        <div className="relative z-10 flex-grow flex flex-col">

          {/* Top Navigation & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-10">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition uppercase tracking-wider w-fit"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-md shadow-sm ${currentTheme.text} w-fit`}
                style={{ backgroundColor: currentTheme.primary, fontFamily: "'Libre Franklin', sans-serif" }}
              >
                {category.replace("-", " ")} • Day {id}
              </span>
            </div>
          </div>

          {/* Task Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 
                className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Libre Franklin', sans-serif" }}
              >
                {task.title}
              </h1>

              {/* Dynamic Status Indicator */}
              <div className="flex items-center gap-2 shrink-0 bg-[#0B0A10] px-3.5 py-2 rounded-xl border border-white/5 w-fit">
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C6E98F]" />
                ) : (
                  <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                )}
                <span
                  className={`text-xs sm:text-[13px] font-extrabold tracking-wide uppercase ${
                    task.status === "completed" ? "text-[#C6E98F]" : "text-gray-400"
                  }`}
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <p 
              className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl font-medium opacity-90 mt-3 sm:mt-4"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              {task.description}
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-8 sm:mb-10"></div>

          {/* Proof of Work Submission Form */}
          <div className="flex-grow">
            <h2 
              className="text-base sm:text-lg font-black tracking-tight text-white mb-5 sm:mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ color: currentTheme.primary }}
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z" />
              </svg>
              Submit Your Proof of Work
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              {/* URLs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label 
                    className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    GitHub / Commit URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#0B0A10] border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all shadow-inner"
                    style={{ 
                      borderColor: githubUrl ? currentTheme.primary : "",
                      fontFamily: "'Rubik', sans-serif"
                    }}
                  />
                </div>

                <div>
                  <label 
                    className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    LinkedIn Post URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/posts/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-[#0B0A10] border border-white/10 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all shadow-inner"
                    style={{ 
                      borderColor: linkedinUrl ? currentTheme.primary : "",
                      fontFamily: "'Rubik', sans-serif"
                    }}
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label 
                  className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  Screenshot / Proof Image{" "}
                  <span className="text-gray-500 normal-case tracking-normal">(Optional)</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed border-white/10 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all hover:bg-white/5 ${
                    imageUrl ? "bg-white/5" : "bg-[#0B0A10]"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />

                  {imageUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      {/* Image Preview */}
                      <div className="relative w-full max-w-sm h-40 sm:h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <Image src={imageUrl} alt="Proof preview" fill className="object-cover" />
                      </div>
                      <p 
                        className="text-xs font-bold text-gray-400 uppercase tracking-wider"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                      >
                        {fileName || "Image attached"} •{" "}
                        <span
                          className="text-white hover:underline cursor-pointer"
                          style={{ color: currentTheme.primary }}
                        >
                          Change
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#151320] border border-white/10 flex items-center justify-center mb-1 shadow-md">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <p 
                        className="text-xs sm:text-sm text-gray-300 font-bold tracking-tight"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                      >
                        Click to upload or drag and drop
                      </p>
                      <p 
                        className="text-[11px] sm:text-xs text-gray-500 font-medium"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                      >
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full sm:w-auto px-8 sm:px-12 py-3.5 ${currentTheme.text} text-xs font-extrabold tracking-wider uppercase rounded-full hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl flex justify-center items-center gap-3 ml-auto`}
                  style={{ backgroundColor: currentTheme.primary, fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
                      Submitting...
                    </>
                  ) : task.status === "completed" ? (
                    "Update Submission"
                  ) : (
                    "Submit Challenge ✓"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}