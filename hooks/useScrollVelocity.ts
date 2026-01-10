"use client";

import { useEffect, useRef } from "react";
import { useVoidStore } from "@/lib/store";

export function useScrollVelocity() {
    const lastScrollY = useRef(0);
    const lastTime = useRef(Date.now());
    const velocityRef = useRef(0);
    const rafRef = useRef<number | undefined>(undefined);

    const { setScrollProgress, setScrollVelocity } = useVoidStore();

    useEffect(() => {
        const calculateVelocity = () => {
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const deltaY = currentScrollY - lastScrollY.current;
            const deltaTime = currentTime - lastTime.current;

            if (deltaTime > 0) {
                const instantVelocity = deltaY / deltaTime;
                // Smooth the velocity with exponential moving average
                velocityRef.current = velocityRef.current * 0.8 + instantVelocity * 0.2;
            }

            // Calculate scroll progress (0-1)
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

            setScrollProgress(Math.min(1, Math.max(0, progress)));
            setScrollVelocity(velocityRef.current);

            lastScrollY.current = currentScrollY;
            lastTime.current = currentTime;
        };

        const handleScroll = () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = requestAnimationFrame(calculateVelocity);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [setScrollProgress, setScrollVelocity]);

    return velocityRef.current;
}
