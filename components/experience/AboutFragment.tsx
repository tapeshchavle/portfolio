"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { personalInfo } from "@/lib/data";
import Image from "next/image";

export function AboutFragment() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const stats = [
        { value: "2+", label: "Years Java" },
        { value: "7+", label: "Projects" },
        { value: "1+", label: "Year Spring Boot" },
    ];

    return (
        <section
            ref={sectionRef}
            className="min-h-screen py-32 px-4 md:px-8 relative z-10"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="text-xs text-[#00ff88]/50 font-mono tracking-[0.5em] mb-4">
                        IDENTITY FRAGMENT
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        ABOUT ME
                    </h2>
                    <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-6" />
                </motion.div>

                {/* Main content grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Profile image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotateY: -15 }}
                        animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative mx-auto lg:mx-0"
                        style={{ perspective: 1000 }}
                    >
                        <div className="relative w-72 h-72 md:w-80 md:h-80">
                            {/* Glowing background */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/30 via-[#00ffff]/20 to-[#ff0088]/30 blur-2xl opacity-60" />

                            {/* Decorative rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute inset-0 border border-[#00ff88]/20 rounded-full" />
                                <div className="absolute inset-4 border border-[#00ff88]/10 rounded-full" />
                                <div className="absolute inset-8 border border-[#00ff88]/5 rounded-full" />
                            </motion.div>

                            {/* Main image */}
                            <div className="absolute inset-8 rounded-xl overflow-hidden border border-[#00ff88]/30 shadow-2xl shadow-[#00ff88]/10">
                                <Image
                                    src="/profile.jpg"
                                    alt={personalInfo.name}
                                    fill
                                    className="object-cover transition-all duration-700 hover:scale-110"
                                    style={{ filter: "saturate(0.8)" }}
                                />

                                {/* Scan line overlay */}
                                <motion.div
                                    animate={{ y: ["-100%", "200%"] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#00ff88]/10 to-transparent pointer-events-none"
                                />
                            </div>

                            {/* Corner accents */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#00ff88]/50" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#00ff88]/50" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#00ff88]/50" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#00ff88]/50" />
                        </div>
                    </motion.div>

                    {/* Bio content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Status indicators */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                                <span className="text-xs font-mono text-[#00ff88]">AVAILABLE FOR HIRE</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                                <span className="text-xs font-mono text-[#00ffff]">B.TECH 3RD YEAR</span>
                            </div>
                        </div>

                        {/* Bio text */}
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {personalInfo.bio}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-4 glass rounded-xl text-center">
                                        <div className="text-3xl md:text-4xl font-black text-[#00ff88] mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Resume button */}
                        <motion.a
                            href={personalInfo.resumeUrl}
                            download
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-6 py-3 glass rounded-xl text-[#00ff88] font-mono text-sm hover:bg-[#00ff88]/10 transition-colors group"
                        >
                            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            DOWNLOAD RESUME
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
