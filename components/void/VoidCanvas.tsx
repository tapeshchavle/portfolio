"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { UltimateSpaceScene } from "./UltimateSpaceScene";

function LoadingFallback() {
    return null;
}

export function VoidCanvas() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 1000 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                }}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
            >
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />

                <Suspense fallback={<LoadingFallback />}>
                    {/* Main space scene with sun and galaxy */}
                    <UltimateSpaceScene />

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
