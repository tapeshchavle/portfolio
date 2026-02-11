"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { useCursorPhysics } from "@/hooks/useCursorPhysics";
import { ScanLines } from "@/components/void/ScanLines";
import { VoidCursor } from "@/components/ui/VoidCursor";
import { HeroSection } from "@/components/experience/HeroSection";
import { AboutFragment } from "@/components/experience/AboutFragment";
import { ProjectHologram } from "@/components/experience/ProjectHologram";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { SkillsGalaxy } from "@/components/experience/SkillsGalaxy";
import { TerminalContact } from "@/components/experience/TerminalContact";
import { useVoidStore } from "@/lib/store";

// Dynamic import for VoidCanvas to avoid SSR issues with Three.js
const VoidCanvas = dynamic(
  () => import("@/components/void/VoidCanvas").then((mod) => mod.VoidCanvas),
  { ssr: false }
);

export default function VoidExperience() {
  // Initialize hooks
  useScrollVelocity();
  useCursorPhysics();

  const { phase } = useVoidStore();

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* WebGL Galaxy Background */}
      <VoidCanvas />

      {/* Scan lines overlay */}
      <ScanLines />

      {/* Custom cursor */}
      <VoidCursor />

      {/* Phase indicator */}
      <div className="fixed top-6 right-6 z-50 hidden md:block">
        <div className="text-[10px] font-mono text-[#00ff88]/40 tracking-[0.3em]">
          {phase.toUpperCase()}
        </div>
      </div>

      {/* Navigation hint */}
      <nav className="fixed top-6 left-6 z-50 hidden lg:flex flex-col gap-2">
        {["hero", "about", "projects", "experience", "skills", "contact"].map((section, i) => (
          <button
            key={section}
            onClick={() => {
              document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-3"
          >
            <div className={`w-1 h-1 rounded-full transition-all ${phase === (i === 0 ? "breach" : i === 1 ? "signal" : i === 2 ? "memory" : i === 3 ? "logs" : i === 4 ? "scan" : "terminal")
              ? "w-4 bg-[#00ff88]"
              : "bg-[#00ff88]/30 group-hover:bg-[#00ff88]/60"
              }`} />
            <span className="text-[10px] font-mono text-[#00ff88]/0 group-hover:text-[#00ff88]/60 transition-all uppercase tracking-widest">
              {section}
            </span>
          </button>
        ))}
      </nav>

      {/* Content sections */}
      <div className="relative z-10">
        {/* Hero */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* About */}
        <div id="about">
          <AboutFragment />
        </div>

        {/* Projects */}
        <div id="projects">
          <ProjectHologram />
        </div>

        {/* Experience */}
        <div id="experience">
          <ExperienceSection />
        </div>

        {/* Skills */}
        <div id="skills">
          <SkillsGalaxy />
        </div>

        {/* Contact */}
        <div id="contact">
          <TerminalContact />
        </div>

        {/* Footer */}
        <footer className="py-16 text-center border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-4xl font-black text-white/5 mb-4 tracking-tighter">
              TAPESH
            </div>
            <p className="text-xs font-mono text-gray-600">
              © {new Date().getFullYear()} TAPESH CHAVLE
            </p>
            <p className="text-[10px] font-mono text-gray-700 mt-2">
              NEXT.JS • REACT THREE FIBER • FRAMER MOTION
            </p>
          </div>
        </footer>
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#00ff88] via-[#00ffff] to-[#ff0088] transition-all duration-100"
          style={{ width: `${useVoidStore.getState().scrollProgress * 100}%` }}
        />
      </div>
    </main>
  );
}
