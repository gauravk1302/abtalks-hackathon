import { Header } from "@/modules/dashboard/components/header";
import { CalendarHeroSection } from "@/modules/dashboard/components/date-hero-section/calender-hero-section";
import { HeroSectionTwo } from "@/modules/dashboard/components/hero-section-2";
import Achievements from "@/modules/dashboard/components/stats-section/achievement";
import { Leaderboard } from "@/modules/dashboard/components/stats-section/leaderboard";
import { Footer } from "@/modules/dashboard/components/footer";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-[#141226] text-white flex flex-col antialiased overflow-x-hidden"
      style={{ fontFamily: "'Rubik', sans-serif" }}
    >
      {/* 1. Dynamic Header */}
      <Header />

      {/* 2. Calendar Hero Section */}
      <CalendarHeroSection />

      {/* 3. Hero Section Two */}
      <HeroSectionTwo />

      {/* 4. Leaderboard & Achievements Section (Stacked Vertically with Responsive Spacing) */}
      <section className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 lg:gap-10">
          <Leaderboard />
          <Achievements />
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}