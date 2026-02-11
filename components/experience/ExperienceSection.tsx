"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";

export function ExperienceSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section
            ref={sectionRef}
            className="min-h-screen py-32 px-4 md:px-8 relative z-10"
        >
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/30"
                >
                    <Briefcase className="w-8 h-8 text-[#00ff88]" />
                </motion.div>

                <div className="text-xs text-[#00ff88]/50 font-mono tracking-[0.5em] mb-4">
                    CAREER LOGS
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                    EXPERIENCE
                </h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-8"
                />
            </motion.div>

            {/* Experience Timeline */}
            <div className="max-w-6xl mx-auto relative px-4 md:px-0">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00ff88]/30 to-transparent" />

                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
                        className="relative mb-16 md:mb-24"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute left-[11px] md:left-[-5px] top-6 w-[11px] h-[11px] rounded-full bg-[#00ff88] border-2 border-black z-10 shadow-[0_0_10px_#00ff88]" />

                        <div className="pl-12 md:pl-16 w-full">
                            {/* Card */}
                            <div className="relative group perspective-1000">
                                <div className="relative p-6 md:p-8 bg-black/40 border border-[#00ff88]/20 rounded-xl backdrop-blur-sm hover:border-[#00ff88]/50 transition-colors duration-300">
                                    {/* Validated Badge */}
                                    <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl px-3 py-1 bg-[#00ff88]/20 text-[#00ff88] text-[10px] font-mono tracking-wider">
                                        VERIFIED
                                    </div>
                                    <div className="absolute top-8 right-4 text-[10px] font-mono text-[#00ff88]/50 text-right">
                                        {exp.period}
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors pr-8">
                                        {exp.role}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 font-mono text-sm md:text-base">
                                        <span className="text-white/90 font-bold">{exp.company}</span>
                                        <span className="text-[#00ff88]/50">|</span>
                                        <span className="text-[#00ff88]/80">{exp.duration}</span>
                                    </div>

                                    <p className="text-gray-300 mb-8 leading-relaxed text-base md:text-lg max-w-4xl">
                                        {exp.description}
                                    </p>

                                    {/* Achievements List */}
                                    <ul className="space-y-3 mb-8">
                                        {exp.achievements?.map((achievement, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-400">
                                                <span className="text-[#00ff88] mt-1.5 text-xs">▹</span>
                                                <span>{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2">
                                        {exp.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1.5 text-xs font-mono text-[#00ff88]/70 bg-[#00ff88]/5 border border-[#00ff88]/10 rounded transition-colors group-hover:bg-[#00ff88]/10"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-[#00ff88]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
