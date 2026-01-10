"use client";

import { useEffect, useRef } from "react";
import { useVoidStore } from "@/lib/store";

interface Trail {
    x: number;
    y: number;
    age: number;
    size: number;
}

export function VoidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trailsRef = useRef<Trail[]>([]);
    const { cursor } = useVoidStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        // Animation loop
        let animationFrame: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add new trail point
            if (cursor.x > 0 && cursor.y > 0) {
                const speed = Math.sqrt(
                    cursor.velocityX * cursor.velocityX +
                    cursor.velocityY * cursor.velocityY
                );

                trailsRef.current.push({
                    x: cursor.x,
                    y: cursor.y,
                    age: 0,
                    size: Math.min(20, 5 + speed * 10),
                });
            }

            // Limit trail length
            if (trailsRef.current.length > 50) {
                trailsRef.current.shift();
            }

            // Draw and update trails
            trailsRef.current = trailsRef.current.filter((trail) => {
                trail.age += 0.02;

                if (trail.age >= 1) return false;

                const alpha = 1 - trail.age;
                const size = trail.size * (1 - trail.age * 0.5);

                // Outer glow
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 136, ${alpha * 0.1})`;
                ctx.fill();

                // Inner core
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 136, ${alpha * 0.3})`;
                ctx.fill();

                // Bright center
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                ctx.fill();

                return true;
            });

            // Draw main cursor
            if (cursor.x > 0 && cursor.y > 0) {
                // Outer ring
                ctx.beginPath();
                ctx.arc(cursor.x, cursor.y, 20, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(0, 255, 136, 0.3)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Inner dot
                ctx.beginPath();
                ctx.arc(cursor.x, cursor.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#00ff88";
                ctx.fill();

                // Crosshair
                ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(cursor.x - 30, cursor.y);
                ctx.lineTo(cursor.x - 10, cursor.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cursor.x + 10, cursor.y);
                ctx.lineTo(cursor.x + 30, cursor.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cursor.x, cursor.y - 30);
                ctx.lineTo(cursor.x, cursor.y - 10);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cursor.x, cursor.y + 10);
                ctx.lineTo(cursor.x, cursor.y + 30);
                ctx.stroke();
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", updateSize);
            cancelAnimationFrame(animationFrame);
        };
    }, [cursor]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[100] pointer-events-none"
        />
    );
}
