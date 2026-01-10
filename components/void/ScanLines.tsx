"use client";

import { useEffect, useState } from "react";

export function ScanLines() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            setOffset((prev) => (prev + 0.5) % 4);
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]"
            style={{
                background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 136, 0.1) 2px,
          rgba(0, 255, 136, 0.1) 4px
        )`,
                backgroundPositionY: `${offset}px`,
            }}
        />
    );
}
