"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVoidStore } from "@/lib/store";

const PARTICLE_COUNT = 2000;

export function ParticleField() {
    const meshRef = useRef<THREE.Points>(null);
    const { scrollProgress, cursor, scrollVelocity } = useVoidStore();

    const [positions, velocities, colors] = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            // Spread particles in 3D space
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10 - 5;

            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

            // Signal green with variations
            const intensity = 0.3 + Math.random() * 0.7;
            colors[i3] = 0; // R
            colors[i3 + 1] = intensity; // G
            colors[i3 + 2] = intensity * 0.5; // B
        }

        return [positions, velocities, colors];
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const geometry = meshRef.current.geometry;
        const positionAttribute = geometry.attributes.position;
        const colorAttribute = geometry.attributes.color;

        const time = state.clock.elapsedTime;
        const mouseInfluence = 0.0002;
        const scrollInfluence = scrollVelocity * 0.5;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Get current position
            let x = positionAttribute.array[i3];
            let y = positionAttribute.array[i3 + 1];
            let z = positionAttribute.array[i3 + 2];

            // Add base velocity
            x += velocities[i3];
            y += velocities[i3 + 1];
            z += velocities[i3 + 2];

            // Cursor influence (normalized to -1 to 1)
            const normalizedCursorX = (cursor.x / window.innerWidth - 0.5) * 2;
            const normalizedCursorY = -(cursor.y / window.innerHeight - 0.5) * 2;

            // Particles are gently pushed away from cursor
            const dx = x - normalizedCursorX * 5;
            const dy = y - normalizedCursorY * 5;
            const distToCursor = Math.sqrt(dx * dx + dy * dy);

            if (distToCursor < 3) {
                const force = (3 - distToCursor) * mouseInfluence;
                x += dx * force;
                y += dy * force;
            }

            // Scroll influence - particles react to scroll
            y -= scrollInfluence * 0.02;

            // Time-based wave motion
            const wave = Math.sin(time * 0.5 + i * 0.01) * 0.002;
            x += wave;
            y += wave * 0.5;

            // Wrap around boundaries
            if (x > 10) x = -10;
            if (x < -10) x = 10;
            if (y > 10) y = -10;
            if (y < -10) y = 10;
            if (z > 0) z = -10;
            if (z < -10) z = 0;

            // Update position
            (positionAttribute.array as Float32Array)[i3] = x;
            (positionAttribute.array as Float32Array)[i3 + 1] = y;
            (positionAttribute.array as Float32Array)[i3 + 2] = z;

            // Animate colors based on scroll progress
            const colorIntensity = 0.3 + scrollProgress * 0.7;
            const glitch = Math.random() > 0.995 ? 1 : 0;

            (colorAttribute.array as Float32Array)[i3] = glitch; // Random red glitch
            (colorAttribute.array as Float32Array)[i3 + 1] = colorIntensity * (1 - glitch * 0.5);
            (colorAttribute.array as Float32Array)[i3 + 2] = colorIntensity * 0.5;
        }

        positionAttribute.needsUpdate = true;
        colorAttribute.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
