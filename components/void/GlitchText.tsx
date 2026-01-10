"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
    delay?: number;
    glitchIntensity?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}

const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

export function GlitchText({
    text,
    className = "",
    delay = 0,
    glitchIntensity = 0.3,
    as: Component = "span",
}: GlitchTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isGlitching, setIsGlitching] = useState(false);
    const [hasRevealed, setHasRevealed] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        // Initial delay before starting the reveal
        const startTimeout = setTimeout(() => {
            let iteration = 0;
            const maxIterations = text.length;

            intervalRef.current = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) {
                                return char;
                            }
                            if (char === " ") return " ";
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join("")
                );

                iteration += 1 / 3;

                if (iteration >= maxIterations) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setDisplayText(text);
                    setHasRevealed(true);
                }
            }, 30);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);

        };
    }, [text, delay]);

    // Random glitch effect after reveal
    useEffect(() => {
        if (!hasRevealed) return;

        const glitchInterval = setInterval(() => {
            if (Math.random() < glitchIntensity * 0.1) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 100);
            }
        }, 2000);

        return () => clearInterval(glitchInterval);
    }, [hasRevealed, glitchIntensity]);

    return (
        <Component
            className={`font-mono relative ${className}`}
            style={{
                textShadow: isGlitching
                    ? "2px 0 #ff0055, -2px 0 #00ff88"
                    : "0 0 10px rgba(0, 255, 136, 0.5)",
            }}
        >
            <span className="relative z-10">{displayText}</span>

            {/* Glitch layers */}
            <AnimatePresence>
                {isGlitching && (
                    <>
                        <motion.span
                            initial={{ opacity: 0, x: -2 }}
                            animate={{ opacity: 0.8, x: 2 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 text-[#ff0055] z-0"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
                        >
                            {displayText}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 2 }}
                            animate={{ opacity: 0.8, x: -2 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 text-[#00ff88] z-0"
                            style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
                        >
                            {displayText}
                        </motion.span>
                    </>
                )}
            </AnimatePresence>
        </Component>
    );
}
