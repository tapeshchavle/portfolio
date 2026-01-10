"use client";

import { motion } from "framer-motion";
import { GlitchText } from "../void/GlitchText";
import { personalInfo } from "@/lib/data";
import { useVoidStore } from "@/lib/store";

export function BreachSequence() {
    const { phase, scrollProgress } = useVoidStore();
    const isVisible = phase === "breach" || phase === "signal";

    return (
        <motion.section
            className="min-h-[200vh] flex items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
        >
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                {/* Phase indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-[#00ff88]/50 mb-8 font-mono tracking-[0.3em]"
                >
                    SIGNAL DETECTED
                </motion.div>

                {/* Main name */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <GlitchText
                        text={personalInfo.name.toUpperCase()}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-white"
                        delay={1000}
                        as="h1"
                    />
                </motion.div>

                {/* Role */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-6"
                >
                    <GlitchText
                        text={personalInfo.role}
                        className="text-xl md:text-2xl text-[#00ff88] tracking-widest"
                        delay={2000}
                        glitchIntensity={0.2}
                        as="p"
                    />
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.6 }}
                    transition={{ delay: 2.2, duration: 0.6 }}
                    className="mt-4 text-sm md:text-base text-gray-400 max-w-xl mx-auto font-mono"
                >
                    {personalInfo.tagline}
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
                    transition={{ delay: 3 }}
                    className="absolute -bottom-32 left-1/2 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center text-[#00ff88]/50">
                        <span className="text-xs font-mono tracking-widest mb-2">SCROLL TO ENTER</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-5 h-8 border border-[#00ff88]/30 rounded-full flex justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-1 h-2 bg-[#00ff88] rounded-full mt-1"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Reality fracture lines */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent"
            />
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#00ff88]/20 to-transparent"
            />
        </motion.section>
    );
}
