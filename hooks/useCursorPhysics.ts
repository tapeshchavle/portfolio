"use client";

import { useEffect, useRef, useCallback } from "react";
import { useVoidStore } from "@/lib/store";

export function useCursorPhysics() {
    const lastPosition = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());
    const rafRef = useRef<number | undefined>(undefined);

    const { setCursor, incrementRealityIntegrity } = useVoidStore();

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime.current;

            if (deltaTime > 0) {
                const velocityX = (e.clientX - lastPosition.current.x) / deltaTime;
                const velocityY = (e.clientY - lastPosition.current.y) / deltaTime;

                // Calculate speed for reality integrity
                const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
                if (speed > 0.5) {
                    incrementRealityIntegrity(speed * 0.01);
                }

                setCursor({
                    x: e.clientX,
                    y: e.clientY,
                    velocityX,
                    velocityY,
                });
            }

            lastPosition.current = { x: e.clientX, y: e.clientY };
            lastTime.current = currentTime;
        },
        [setCursor, incrementRealityIntegrity]
    );

    useEffect(() => {
        const throttledHandler = (e: MouseEvent) => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = requestAnimationFrame(() => handleMouseMove(e));
        };

        window.addEventListener("mousemove", throttledHandler, { passive: true });

        return () => {
            window.removeEventListener("mousemove", throttledHandler);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [handleMouseMove]);
}
