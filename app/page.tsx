'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, animate, type Variants } from 'framer-motion';
import {
  CheckSquare,
  Flame,
  Trophy,
  Award,
  Flag,
  ArrowRight,
  Star,
  Sparkles,
  MessageSquareCode,
  Bug,
  Lightbulb,
  FileCheck2,
  Target,
  ImageOff,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react';

/**
 * ABTalks landing page.
 *
 * Token system (unchanged from the dashboard — do not introduce new colors):
 * - Base Ink    #0F0E17  (deepest page background)
 * - Panel Navy  #141226  (section band background)
 * - Card Indigo #1A2238  (card surfaces)
 * - Accent Lime #C6EB8B  (primary / tasks / completed)
 * - Accent Cyan #31C3EE  (leaderboard / commits / pending)
 * - Accent Gold #FFD88A  (streak / running)
 * - Accent Lavender #D8C6E8 (achievements)
 * - Accent Coral #F7A6A6 (missed / warning, used sparingly)
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const trailNodes = [
  { label: 'Wk 1', lit: true },
  { label: 'Wk 2', lit: true },
  { label: 'Wk 3', lit: true },
  { label: 'Wk 4', lit: false, current: true },
  { label: 'Wk 5', lit: false },
  { label: 'Wk 6', lit: false },
  { label: 'Wk 7', lit: false },
  { label: 'Wk 8', lit: false },
];

const features = [
  {
    icon: CheckSquare,
    color: '#C6EB8B',
    title: 'Daily Tasks',
    copy: 'A fresh coding task lands every day — small enough to finish, sharp enough to matter.',
  },
  {
    icon: Flame,
    color: '#FFD88A',
    title: 'Streak Tracking',
    copy: 'Miss a day and the streak resets. That pressure is the point — consistency compounds.',
  },
  {
    icon: Trophy,
    color: '#31C3EE',
    title: 'Public Leaderboard',
    copy: 'Every commit and proof is ranked against your batch, campus-wide and beyond.',
  },
  {
    icon: Award,
    color: '#D8C6E8',
    title: 'Achievements',
    copy: 'Unlock badges for milestones recruiters actually recognize — not vanity trophies.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Choose your track',
    copy: 'Pick DSA, Development, System Design, or MERN — each runs its own 60-day path.',
    color: '#C6EB8B',
  },
  {
    n: '02',
    title: "Complete today's challenge",
    copy: 'One focused task a day. Small enough to finish, sharp enough to matter.',
    color: '#31C3EE',
  },
  {
    n: '03',
    title: 'Submit GitHub + LinkedIn proof',
    copy: 'Log a commit and a post. Both, every day — that pair is your public streak.',
    color: '#FFD88A',
  },
];

const journeyDays = [1, 15, 30, 45, 60];

const leaderboardPreview = [
  { rank: 1, name: 'Ananya Rao', streak: 42, day: 42, seed: 'ananya' },
  { rank: 2, name: 'Rohan Mehta', streak: 38, day: 40, seed: 'rohan' },
  { rank: 3, name: 'Priya Nair', streak: 35, day: 36, seed: 'priya' },
];

const aiCapabilities = [
  { icon: MessageSquareCode, label: 'Explain tasks' },
  { icon: Bug, label: 'Debug code' },
  { icon: Lightbulb, label: 'Give hints' },
  { icon: FileCheck2, label: 'Review solutions' },
];

const stats = [
  { value: '500+', label: 'Students', color: '#C6EB8B' },
  { value: '15k+', label: 'GitHub commits', color: '#31C3EE' },
  { value: '60 days', label: 'Structured journey', color: '#FFD88A' },
  { value: '95%', label: 'Completion satisfaction', color: '#D8C6E8' },
];

const heroAvatars = ['ananya', 'rohan', 'priya'];

const previewImages = [
  { src: '/img1.png', label: 'dashboard.png', alt: 'ABTalks dashboard preview' },
  { src: '/img2.png', label: 'leaderboard.png', alt: 'ABTalks leaderBoard preview' },
  { src: '/img3.png', label: 'submitting.png', alt: 'ABTalks submit preview' },
];

/* ─── Animated number counter ─── */
function AnimatedNumber({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [isInView, value]);

  return <span ref={ref} className={className}>{display}</span>;
}

/* ─── Animated progress line ─── */
function AnimatedProgressLine({
  targetWidth,
  color = '#C6EB8B',
  gradient = false,
}: {
  targetWidth: string;
  color?: string;
  gradient?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="absolute left-0 h-[2px] rounded-full overflow-hidden" style={{ width: targetWidth }}>
      <motion.div
        className="h-full rounded-full"
        style={{
          background: gradient
            ? 'linear-gradient(to right, #C6EB8B, #31C3EE)'
            : color,
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
}

/* ─── Reusable image component with error fallback ─── */
function SafeImage({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#141226] border border-white/10 ${className}`}
        title={alt}
      >
        <ImageOff className="w-6 h-6 text-gray-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      {...props}
    />
  );
}

/* ─── Avatar component with consistent sizing and fallback ─── */
function Avatar({
  seed,
  alt,
  size = 36,
  className = '',
}: {
  seed: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`rounded-full bg-[#1A2238] border-2 border-[#0F0E17] flex items-center justify-center text-[10px] font-black text-gray-400 shrink-0 ${className}`}
        style={{ width: size, height: size }}
        title={alt}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full border-2 border-[#0F0E17] shrink-0 object-cover ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
    />
  );
}

export default function LandingPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [gifError, setGifError] = useState(false);

  /* Refs for scroll-triggered timeline sections */
  const trailRef = useRef(null);
  const journeyRef = useRef(null);
  const howItWorksRef = useRef(null);
  const leaderboardRef = useRef(null);

  const trailInView = useInView(trailRef, { once: true, margin: '-100px' });
  const journeyInView = useInView(journeyRef, { once: true, margin: '-100px' });
  const howInView = useInView(howItWorksRef, { once: true, margin: '-100px' });
  const leaderboardInView = useInView(leaderboardRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-[#0F0E17] text-white font-[family-name:var(--font-libre-franklin)] overflow-x-hidden">
      {/* Top Navbar — BIGGER */}
      <header className="w-full border-b border-white/10 bg-[#141226]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#C6EB8B]" />
            <span className="text-base sm:text-lg lg:text-xl font-black tracking-wide text-white font-[family-name:var(--font-rubik)]">ABTalks</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/sign-in"
              className="text-xs sm:text-sm font-bold text-gray-300 hover:text-white px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-[family-name:var(--font-rubik)]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              className="text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#C6EB8B] text-[#121826] hover:opacity-90 transition-opacity font-[family-name:var(--font-rubik)]"
            >
              Join Free
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Responsive 2-column on lg, stacked on mobile
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-5 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
          {/* LEFT COLUMN */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6"
          >
            <span className="font-mono text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#1A2238] border border-white/10 text-[#C6EB8B] tracking-wide">
              $ 60_day_challenge --status active
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] max-w-xl font-[family-name:var(--font-rubik)]">
              <span className="block">
                Build Every{' '}
                <span className="inline-flex items-center -space-x-2 sm:-space-x-3 align-middle mx-1 relative -top-0.5 sm:-top-1">
                  {heroAvatars.map((s) => (
                    <Avatar
                      key={s}
                      seed={s}
                      alt={s}
                      size={36}
                      className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11"
                    />
                  ))}
                  <span className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-[#1A2238] border-2 border-[#0F0E17] flex items-center justify-center text-[9px] sm:text-[10px] font-black text-gray-300 font-[family-name:var(--font-rubik)]">
                    500+
                  </span>
                </span>{' '}
                Day.
              </span>
            </h1>

            {/* Floating task badge */}
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#1A2238] border border-white/10 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-3 shadow-2xl"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#C6EB8B] flex items-center justify-center text-[#C6EB8B] shrink-0">
                <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-black text-white font-[family-name:var(--font-rubik)]">DSA · Day 14</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-gray-400">
                  0 of 1 task · <span className="text-[#C6EB8B] font-bold">Today</span>
                </p>
              </div>
              <div className="flex items-center -space-x-2 ml-1 sm:ml-2">
                {heroAvatars.slice(0, 2).map((s) => (
                  <Avatar
                    key={s}
                    seed={s}
                    alt={s}
                    size={20}
                    className="w-5 h-5 sm:w-6 sm:h-6 border-[#1A2238]"
                  />
                ))}
              </div>
            </motion.div>

            <p className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#C6EB8B] font-[family-name:var(--font-rubik)]">
              Get Noticed.
            </p>

            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-400 leading-relaxed max-w-lg">
              Plan your streak, stay on track, and turn every GitHub commit and LinkedIn post into
              proof of your consistency.
            </p>

            <Link
              href="/sign-in"
              className="mt-1 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#C6EB8B] text-[#121826] font-black text-xs sm:text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-[family-name:var(--font-rubik)]"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#121826] flex items-center justify-center">
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C6EB8B]" />
              </span>
              Start Challenge — Free
            </Link>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-400">
              <div className="flex items-center text-[#FFD88A]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                ))}
              </div>
              <span>Loved by 500+ students · 4.9 rating</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — GIF preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="relative w-full mt-4 lg:mt-0"
          >
            {/* Backdrop blobs */}
            <div className="absolute -inset-4 sm:-inset-8 lg:-inset-12 rounded-[32px] sm:rounded-[48px] overflow-hidden -z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A2238] via-[#141226] to-[#0F0E17]" />
              <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 bg-[#C6EB8B]/10 rounded-full blur-[60px] sm:blur-[80px]" />
              <div className="absolute -bottom-10 -left-10 w-40 sm:w-56 h-40 sm:h-56 bg-[#31C3EE]/10 rounded-full blur-[60px] sm:blur-[80px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-72 h-56 sm:h-72 bg-[#D8C6E8]/5 rounded-full blur-[80px] sm:blur-[100px]" />
              <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] border border-white/5" />
            </div>

            {/* Floating side cards — xl only */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="hidden xl:flex absolute top-12 -left-16 z-20 items-center gap-2.5 bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-[#C6EB8B]/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#C6EB8B]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Daily DSA</p>
                <p className="text-[9px] text-gray-400">Task 14 of 60</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="hidden xl:flex absolute top-24 -right-14 z-20 items-center gap-2.5 bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFD88A]/15 flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#FFD88A]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Streak Active</p>
                <p className="text-[9px] text-gray-400">14 days running</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="hidden xl:flex absolute bottom-20 -right-12 z-20 items-center gap-2.5 bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-[#31C3EE]/15 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#31C3EE]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Leaderboard</p>
                <p className="text-[9px] text-gray-400">Rank #3 this week</p>
              </div>
            </motion.div>

            {/* Main window frame */}
            <div className="relative bg-[#1A2238] border border-white/10 rounded-[20px] sm:rounded-[28px] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#141226]">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F7A6A6]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD88A]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C6EB8B]" />
                <span className="ml-2 text-[9px] sm:text-[10px] font-mono text-gray-500 truncate">
                  preview.gif
                </span>
              </div>

              <div className="p-2 sm:p-3">
                {gifError ? (
                  <div className="w-full aspect-video bg-[#0F0E17] rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3">
                    <ImageOff className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500">Preview unavailable</span>
                  </div>
                ) : (
                  <img
                    src="/3.gif"
                    alt="ABTalks task management preview"
                    className="w-full h-auto object-cover rounded-lg sm:rounded-xl border border-white/5 shadow-md"
                    loading="eager"
                    decoding="async"
                    onError={() => setGifError(true)}
                  />
                )}
              </div>
            </div>

            {/* Floating overlay cards */}
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="hidden sm:flex absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 items-center gap-2.5 sm:gap-3 bg-[#1A2238] border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl z-20"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#FFD88A] flex items-center justify-center text-[#FFD88A] shrink-0">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-black text-white font-[family-name:var(--font-rubik)]">Streak Active</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-gray-400">14 days running</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="hidden sm:flex absolute -top-4 sm:-top-6 -right-4 sm:-right-6 items-center gap-2.5 sm:gap-3 bg-[#1A2238] border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl z-20"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#31C3EE] flex items-center justify-center text-[#31C3EE] shrink-0">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-black text-white font-[family-name:var(--font-rubik)]">Daily Goal</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-gray-400">1 of 1 complete</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* SCREENSHOT CAROUSEL */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="relative mt-16 sm:mt-20 lg:mt-24 w-full max-w-5xl mx-auto z-10"
        >
          <div className="absolute -inset-3 sm:-inset-6 lg:-inset-10 rounded-[24px] sm:rounded-[40px] overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#141226] via-[#1A2238]/50 to-[#141226]" />
            <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-[#C6EB8B]/8 rounded-full blur-[60px] sm:blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-[#31C3EE]/8 rounded-full blur-[60px] sm:blur-[100px]" />
            <div className="absolute inset-0 rounded-[24px] sm:rounded-[40px] border border-white/5" />
          </div>

          {/* Floating side elements — xl only */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden xl:flex absolute top-1/2 -left-20 -translate-y-1/2 z-20 flex-col gap-3"
          >
            <div className="bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C6EB8B]/15 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-[#C6EB8B]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Tasks Done</p>
                <p className="text-[9px] text-gray-400">12 this week</p>
              </div>
            </div>
            <div className="bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 ml-4">
              <div className="w-9 h-9 rounded-xl bg-[#D8C6E8]/15 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#D8C6E8]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Day 14</p>
                <p className="text-[9px] text-gray-400">On track</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden xl:flex absolute top-1/2 -right-16 -translate-y-1/2 z-20 flex-col gap-3"
          >
            <div className="bg-[#1A2238]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD88A]/15 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#FFD88A]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white font-[family-name:var(--font-rubik)]">Top 5%</p>
                <p className="text-[9px] text-gray-400">Campus rank</p>
              </div>
            </div>
          </motion.div>

          <div className="max-w-2xl mx-auto relative px-2 sm:px-0">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#31C3EE]/10 via-transparent to-[#D8C6E8]/10 blur-2xl rounded-[32px] -z-10" />

            <button
              type="button"
              onClick={() => setActiveImage((prev) => (prev + 1) % previewImages.length)}
              className="w-full text-left bg-[#0F0E17] border border-white/10 rounded-[20px] sm:rounded-[28px] shadow-2xl overflow-hidden cursor-pointer block hover:border-white/20 transition-colors group"
              aria-label="Click to view next screenshot"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#141226]">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F7A6A6]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD88A]" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C6EB8B]" />
                <span className="ml-2 text-[9px] sm:text-[10px] font-mono text-gray-500 truncate flex-1">
                  {previewImages[activeImage].label}
                </span>
                <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-400 transition-colors hidden sm:inline font-[family-name:var(--font-rubik)]">
                  Click to explore →
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-[#0F0E17] p-1.5 sm:p-2 lg:p-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewImages[activeImage].src}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full h-full"
                  >
                    <SafeImage
                      src={previewImages[activeImage].src}
                      alt={previewImages[activeImage].alt}
                      className="w-full h-full object-cover object-top rounded-lg sm:rounded-xl border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
              {previewImages.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show ${img.label}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    i === activeImage ? 'w-5 sm:w-6 bg-[#C6EB8B]' : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMMIT-TRAIL DIVIDER — ANIMATED
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={trailRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-10"
      >
        <div className="flex items-center justify-between mb-3 font-mono text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={trailInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Day 01
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={trailInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Day 60
          </motion.span>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 h-[2px] bg-white/10 rounded-full" />
          <AnimatedProgressLine targetWidth="38%" color="#C6EB8B" />

          {trailNodes.map((node, i) => (
            <motion.div
              key={i}
              className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={trailInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 300 }}
            >
              <div
                className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border-2 ${
                  node.lit
                    ? 'bg-[#C6EB8B] border-[#C6EB8B]'
                    : node.current
                    ? 'bg-[#0F0E17] border-[#C6EB8B] animate-pulse'
                    : 'bg-[#0F0E17] border-white/20'
                }`}
              />
              <span className="text-[8px] sm:text-[9px] font-mono text-gray-500">{node.label}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={trailInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1.4, type: 'spring' }}
            className="relative z-10 -mr-1"
          >
            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD88A]" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — ANIMATED
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={howItWorksRef}
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-4 sm:px-5 py-12 sm:py-16 scroll-mt-20"
      >
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-center mb-8 sm:mb-10 font-[family-name:var(--font-rubik)]">How it works</h2>

        <div className="relative">
          {/* Connecting line — hidden on mobile, visible sm+ */}
          <div className="hidden sm:block absolute top-[72px] left-[16%] right-[16%] h-[2px] bg-white/10 rounded-full">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#C6EB8B] via-[#31C3EE] to-[#FFD88A]"
              initial={{ scaleX: 0, originX: 0 }}
              animate={howInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="bg-[#1A2238] border border-white/10 rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 flex flex-col gap-2.5 sm:gap-3 shadow-lg hover:-translate-y-1 transition-transform"
                initial={{ opacity: 0, y: 40 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
              >
                <div className="hidden sm:flex justify-center mb-1">
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ scale: 0 }}
                    animate={howInView ? { scale: [0, 1.4, 1] } : {}}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  />
                </div>

                <motion.span
                  className="font-mono text-2xl sm:text-3xl font-black"
                  style={{ color: `${s.color}80` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={howInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.2 }}
                >
                  {s.n}
                </motion.span>
                <h3 className="text-sm sm:text-base font-black text-white font-[family-name:var(--font-rubik)]">{s.title}</h3>
                <p className="text-xs sm:text-sm font-medium text-gray-400 leading-relaxed">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          CHALLENGE JOURNEY — ANIMATED TIMELINE
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={journeyRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-4 sm:px-5 py-12 sm:py-16"
      >
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-center mb-2 font-[family-name:var(--font-rubik)]">Challenge Journey</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-400 text-center mb-8 sm:mb-12">
          Sixty days, five milestones — every category runs its own copy of this path.
        </p>

        {/* Horizontal scroll on very small screens */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div className="relative flex items-center justify-between min-w-[320px] sm:min-w-0 max-w-3xl mx-auto">
            <div className="absolute left-0 right-0 top-5 sm:top-6 h-[2px] bg-white/10 rounded-full" />
            <AnimatedProgressLine targetWidth="55%" gradient />

            {journeyDays.map((day, i) => (
              <motion.div
                key={day}
                className="relative z-10 flex flex-col items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 30, scale: 0.5 }}
                animate={journeyInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: 0.3 + i * 0.18,
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 font-black text-[10px] sm:text-xs shadow-md font-[family-name:var(--font-rubik)] ${
                    i <= 2
                      ? 'bg-[#C6EB8B] border-[#C6EB8B] text-[#1E2C47]'
                      : 'bg-[#1A2238] border-white/10 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {day}
                </motion.div>
                <motion.span
                  className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wide font-[family-name:var(--font-rubik)]"
                  initial={{ opacity: 0 }}
                  animate={journeyInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.18 }}
                >
                  Day {day}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES — Responsive grid
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-4 sm:px-5 py-8 sm:py-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#1A2238] border border-white/10 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 shadow-lg hover:-translate-y-1 transition-transform"
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${f.color}18` }}
              >
                <f.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: f.color }} />
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-[family-name:var(--font-rubik)]">{f.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-gray-400 leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          LEADERBOARD — ANIMATED
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={leaderboardRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="max-w-3xl mx-auto px-4 sm:px-5 py-12 sm:py-16"
      >
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-center mb-2 font-[family-name:var(--font-rubik)]">Leaderboard</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-400 text-center mb-8 sm:mb-10">
          Real students, ranked by streak — this is who shows up every day.
        </p>

        <div className="bg-[#1A2238] border border-white/10 rounded-[20px] sm:rounded-[24px] divide-y divide-white/5 overflow-hidden shadow-lg">
          <AnimatePresence>
            {leaderboardPreview.map((s, i) => (
              <motion.div
                key={s.rank}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4"
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
                animate={leaderboardInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{
                  delay: 0.2 + i * 0.25,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              >
                <motion.span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 font-[family-name:var(--font-rubik)] ${
                    s.rank === 1 ? 'bg-[#FFD88A] text-[#1E2C47]' : 'bg-white/10 text-gray-300'
                  }`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={leaderboardInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.25, type: 'spring', stiffness: 200 }}
                >
                  {s.rank}
                </motion.span>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={leaderboardInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.25, type: 'spring' }}
                >
                  <Avatar seed={s.seed} alt={s.name} size={32} className="sm:w-9 sm:h-9 border border-white/10" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate font-[family-name:var(--font-rubik)]">{s.name}</p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Day {s.day} of 60</p>
                </div>

                <motion.div
                  className="flex items-center gap-1 sm:gap-1.5 text-[#FFD88A] shrink-0"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={leaderboardInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.25 }}
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-black font-[family-name:var(--font-rubik)]">
                    <AnimatedNumber value={s.streak} />
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>


      {/* ═══════════════════════════════════════════════════════════════
          STATS STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="border-y border-white/10 bg-[#141226]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <span className="block text-xl sm:text-2xl font-black font-[family-name:var(--font-rubik)]" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider font-[family-name:var(--font-rubik)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-4 sm:px-5 py-12 sm:py-16"
      >
        <div className="bg-[#C6EB8B] text-[#121826] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center gap-3 sm:gap-4 shadow-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight max-w-md font-[family-name:var(--font-rubik)]">
            Ready to build your coding streak?
          </h2>
          <p className="text-sm sm:text-base font-semibold opacity-80 max-w-sm">
            No fees, no fluff — just 60 days of proof that you show up.
          </p>
          <Link
            href="/sign-in"
            className="mt-1 sm:mt-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-[16px] sm:rounded-[20px] bg-[#121826] text-white font-black text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 font-[family-name:var(--font-rubik)]"
          >
            Start Day 1 <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-white/10 bg-[#141226] py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6EB8B]" />
            <span className="text-xs sm:text-sm font-black text-white font-[family-name:var(--font-rubik)]">ABTalks</span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 font-[family-name:var(--font-libre-franklin)]">
            &copy; {new Date().getFullYear()} ABTalks Challenge. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}