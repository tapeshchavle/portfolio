"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useVoidStore } from "@/lib/store";
import { personalInfo } from "@/lib/data";
import { useEffect, useState, useRef } from "react";

// Typing effect
function TypeWriter({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
    const [displayText, setDisplayText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const timer = setInterval(() => {
            if (index <= text.length) {
                setDisplayText(text.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [started, text, speed]);

    return (
        <span>
            {displayText}
            {displayText.length < text.length && (
                <span className="animate-pulse text-[#00ff88]">|</span>
            )}
        </span>
    );
}

// Glitch text with RGB split
function MassiveGlitchTitle({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState("");
    const [glitchActive, setGlitchActive] = useState(false);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";

    useEffect(() => {
        let iteration = 0;
        const maxIterations = text.length;

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) return char;
                        if (char === " ") return " ";
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            iteration += 0.5;

            if (iteration >= maxIterations) {
                clearInterval(interval);
                setDisplayText(text);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    // Random glitch effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.9) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 100);
            }
        }, 200);

        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div className="relative select-none">
            {/* Main text */}
            <h1
                className="text-[8vw] md:text-[10vw] lg:text-[12vw] font-black leading-none tracking-tighter"
                style={{
                    textShadow: glitchActive
                        ? "4px 0 #ff0055, -4px 0 #00ffff, 0 0 40px rgba(0,255,136,0.5)"
                        : "0 0 60px rgba(0,255,136,0.4), 0 0 120px rgba(0,255,136,0.2)",
                    transform: glitchActive ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : "none",
                }}
            >
                <span className="bg-gradient-to-r from-white via-[#00ff88] to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    {displayText}
                </span>
            </h1>

            {/* Glitch layers */}
            <AnimatePresence>
                {glitchActive && (
                    <>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 text-[8vw] md:text-[10vw] lg:text-[12vw] font-black leading-none tracking-tighter text-[#ff0055]"
                            style={{
                                clipPath: "polygon(0 0, 100% 0, 100% 33%, 0 33%)",
                                transform: "translate(3px, 0)",
                            }}
                        >
                            {displayText}
                        </motion.h1>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 text-[8vw] md:text-[10vw] lg:text-[12vw] font-black leading-none tracking-tighter text-[#00ffff]"
                            style={{
                                clipPath: "polygon(0 66%, 100% 66%, 100% 100%, 0 100%)",
                                transform: "translate(-3px, 0)",
                            }}
                        >
                            {displayText}
                        </motion.h1>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Floating particles around cursor
function CursorParticles() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
    const idRef = useRef(0);
    const { cursor } = useVoidStore();

    useEffect(() => {
        const interval = setInterval(() => {
            if (cursor.x > 0 && cursor.y > 0) {
                const newParticle = {
                    id: idRef.current++,
                    x: cursor.x + (Math.random() - 0.5) * 40,
                    y: cursor.y + (Math.random() - 0.5) * 40,
                };

                setParticles(prev => [...prev.slice(-20), newParticle]);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [cursor]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0, y: -50 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-1 h-1 bg-[#00ff88] rounded-full"
                    style={{ left: particle.x, top: particle.y }}
                    onAnimationComplete={() => {
                        setParticles(prev => prev.filter(p => p.id !== particle.id));
                    }}
                />
            ))}
        </div>
    );
}

export function HeroSection() {
    const { scrollProgress } = useVoidStore();
    const opacity = Math.max(0, 1 - scrollProgress * 2.5);
    const scale = 1 - scrollProgress * 0.3;

    return (
        <>
            <CursorParticles />

            <section
                className="relative min-h-[200vh] flex items-start justify-center pt-[25vh]"
                style={{
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: "center top",
                }}
            >
                <div className="text-center z-10 px-4 max-w-7xl mx-auto">
                    {/* System status */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass rounded-full"
                    >
                        <div className="relative">
                            <span className="w-3 h-3 rounded-full bg-[#00ff88] block animate-pulse" />
                            <span className="absolute inset-0 w-3 h-3 rounded-full bg-[#00ff88] animate-ping opacity-50" />
                        </div>
                        <span className="text-sm font-mono text-[#00ff88] tracking-[0.3em] uppercase">
                            <TypeWriter text="System Online" delay={500} speed={80} />
                        </span>
                    </motion.div>

                    {/* Main title */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 1, type: "spring" }}
                    >
                        <MassiveGlitchTitle text={personalInfo.name.toUpperCase()} />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-6 relative"
                    >
                        <p className="text-2xl md:text-4xl font-light text-white/90 tracking-widest">
                            <TypeWriter text={personalInfo.role.toUpperCase()} delay={2000} speed={60} />
                        </p>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 3.5, duration: 1 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
                        />
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 4 }}
                        className="mt-12 text-lg text-gray-400 max-w-xl mx-auto font-light"
                    >
                        {personalInfo.tagline}
                    </motion.p>

                    {/* Tech stack badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 4.5 }}
                        className="flex flex-wrap justify-center gap-4 mt-12"
                    >
                        {["Spring Boot", "React", "Java", "Microservices", "Next.js"].map((tech, i) => (
                            <motion.div
                                key={tech}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 4.5 + i * 0.1, type: "spring", stiffness: 200 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                className="px-5 py-2 glass rounded-full text-sm font-mono text-white/80 hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-colors cursor-default"
                            >
                                {tech}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
                        transition={{ delay: 5 }}
                        className="absolute bottom-[15vh] left-1/2 -translate-x-1/2"
                    >
                        <div className="flex flex-col items-center text-[#00ff88]/60">
                            <motion.span
                                className="text-xs font-mono tracking-[0.4em] mb-4"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                SCROLL TO EXPLORE
                            </motion.span>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="w-8 h-14 border-2 border-[#00ff88]/40 rounded-full flex justify-center pt-3"
                            >
                                <motion.div
                                    animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="w-2 h-4 bg-[#00ff88] rounded-full"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-20 left-8 w-24 h-24 border-l border-t border-[#00ff88]/20" />
                <div className="absolute top-20 right-8 w-24 h-24 border-r border-t border-[#00ff88]/20" />
                <div className="absolute bottom-40 left-8 w-24 h-24 border-l border-b border-[#00ff88]/20" />
                <div className="absolute bottom-40 right-8 w-24 h-24 border-r border-b border-[#00ff88]/20" />

                {/* Floating code snippets */}
                <div className="absolute top-1/3 left-8 text-[10px] font-mono text-[#00ff88]/30 hidden lg:block">
                    <pre>{`const developer = {
  name: "Tapesh",
  passion: "∞"
};`}</pre>
                </div>
                <div className="absolute top-1/2 right-8 text-[10px] font-mono text-[#00ff88]/30 hidden lg:block">
                    <pre>{`while (true) {
  code();
  learn();
  create();
}`}</pre>
                </div>
            </section>
        </>
    );
}
