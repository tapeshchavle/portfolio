"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useVoidStore } from "@/lib/store";

const STAR_COUNT = 3000;
const NEBULA_COUNT = 500;

function NebulaParticles() {
    const meshRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(NEBULA_COUNT * 3);
        const colors = new Float32Array(NEBULA_COUNT * 3);
        const sizes = new Float32Array(NEBULA_COUNT);

        for (let i = 0; i < NEBULA_COUNT; i++) {
            const i3 = i * 3;
            // Create nebula cloud distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 15 + Math.random() * 30;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3; // Flatten
            positions[i3 + 2] = r * Math.cos(phi) - 20;

            // Nebula colors - purples, blues, pinks
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i3] = 0.4 + Math.random() * 0.2;     // Purple-red
                colors[i3 + 1] = 0.1 + Math.random() * 0.2;
                colors[i3 + 2] = 0.6 + Math.random() * 0.4;
            } else if (colorChoice < 0.66) {
                colors[i3] = 0.1 + Math.random() * 0.2;     // Blue
                colors[i3 + 1] = 0.3 + Math.random() * 0.3;
                colors[i3 + 2] = 0.7 + Math.random() * 0.3;
            } else {
                colors[i3] = 0.6 + Math.random() * 0.4;     // Pink
                colors[i3 + 1] = 0.2 + Math.random() * 0.2;
                colors[i3 + 2] = 0.5 + Math.random() * 0.3;
            }

            sizes[i] = 0.5 + Math.random() * 2;
        }

        return [positions, colors, sizes];
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.005;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.3}
                vertexColors
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

function FloatingDebris() {
    const groupRef = useRef<THREE.Group>(null);

    const debris = useMemo(() => {
        return Array.from({ length: 20 }, () => ({
            position: [
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 15,
                -10 - Math.random() * 20,
            ] as [number, number, number],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ] as [number, number, number],
            scale: 0.05 + Math.random() * 0.15,
            speed: 0.2 + Math.random() * 0.5,
        }));
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            const d = debris[i];
            child.rotation.x += 0.002 * d.speed;
            child.rotation.y += 0.003 * d.speed;
            child.position.z += 0.01 * d.speed;
            if (child.position.z > 5) {
                child.position.z = -30;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {debris.map((d, i) => (
                <mesh key={i} position={d.position} rotation={d.rotation} scale={d.scale}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="#00ff88"
                        emissive="#00ff88"
                        emissiveIntensity={0.3}
                        wireframe
                    />
                </mesh>
            ))}
        </group>
    );
}

function SpaceStation() {
    const groupRef = useRef<THREE.Group>(null);
    const { scrollProgress, cursor } = useVoidStore();

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;

        // Slow rotation
        groupRef.current.rotation.y = time * 0.05;
        groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;

        // Subtle movement based on cursor
        const targetX = (cursor.x / window.innerWidth - 0.5) * 2;
        const targetY = -(cursor.y / window.innerHeight - 0.5) * 2;
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.01;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.01;

        // Move closer as user scrolls
        groupRef.current.position.z = -25 + scrollProgress * 10;
    });

    return (
        <group ref={groupRef} position={[5, 2, -25]} scale={0.5}>
            {/* Central hub */}
            <mesh>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    emissive="#00ff88"
                    emissiveIntensity={0.2}
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>

            {/* Ring structure */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.1, 8, 32]} />
                <meshStandardMaterial
                    color="#2a2a4e"
                    emissive="#00ff88"
                    emissiveIntensity={0.3}
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Solar panels */}
            {[0, Math.PI].map((angle, i) => (
                <group key={i} rotation={[0, angle, 0]}>
                    <mesh position={[3.5, 0, 0]}>
                        <boxGeometry args={[3, 0.02, 1]} />
                        <meshStandardMaterial
                            color="#0a0a1a"
                            emissive="#0055ff"
                            emissiveIntensity={0.5}
                            metalness={0.5}
                            roughness={0.5}
                        />
                    </mesh>
                </group>
            ))}

            {/* Antenna */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
                <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Blinking light */}
            <pointLight position={[0, 2.2, 0]} color="#ff0055" intensity={2} distance={5} />
        </group>
    );
}

function InteractiveStars() {
    const meshRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(STAR_COUNT * 3);
        const colors = new Float32Array(STAR_COUNT * 3);

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            // Distribute stars in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 30 + Math.random() * 50;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Star colors - mostly white with some colored
            const colorType = Math.random();
            if (colorType < 0.7) {
                // White/blue-white
                colors[i3] = 0.9 + Math.random() * 0.1;
                colors[i3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i3 + 2] = 1;
            } else if (colorType < 0.85) {
                // Orange/red
                colors[i3] = 1;
                colors[i3 + 1] = 0.6 + Math.random() * 0.3;
                colors[i3 + 2] = 0.3 + Math.random() * 0.2;
            } else {
                // Blue
                colors[i3] = 0.5 + Math.random() * 0.3;
                colors[i3 + 1] = 0.7 + Math.random() * 0.3;
                colors[i3 + 2] = 1;
            }
        }

        return [positions, colors];
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Slow rotation
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.01;

        // Twinkle effect
        const colorArray = meshRef.current.geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            // Random twinkle
            if (Math.random() > 0.995) {
                const brightness = 0.5 + Math.random() * 0.5;
                colorArray[i3] *= brightness;
                colorArray[i3 + 1] *= brightness;
                colorArray[i3 + 2] *= brightness;
            }
        }

        meshRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

function ShootingStar() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;
        // Periodic shooting star
        const cycleTime = time % 8;

        if (cycleTime < 1) {
            meshRef.current.visible = true;
            const progress = cycleTime;
            meshRef.current.position.x = 20 - progress * 50;
            meshRef.current.position.y = 10 - progress * 15;
            meshRef.current.position.z = -15 + progress * 5;

            // Scale based on progress
            const scale = Math.sin(progress * Math.PI) * 0.5;
            meshRef.current.scale.setScalar(scale);
        } else {
            meshRef.current.visible = false;
        }
    });

    return (
        <mesh ref={meshRef} visible={false}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
        </mesh>
    );
}

export function GalaxyScene() {
    const { camera } = useThree();
    const { scrollProgress } = useVoidStore();

    useFrame(() => {
        // Camera movement based on scroll
        camera.position.z = 10 - scrollProgress * 5;
        camera.rotation.x = scrollProgress * 0.1;
    });

    return (
        <>
            {/* Ambient lighting */}
            <ambientLight intensity={0.1} />

            {/* Key light */}
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />

            {/* Accent lights */}
            <pointLight position={[-20, 5, -10]} intensity={0.3} color="#ff0055" />
            <pointLight position={[20, -5, -15]} intensity={0.3} color="#0055ff" />

            {/* Background stars */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Custom interactive stars */}
            <InteractiveStars />

            {/* Nebula clouds */}
            <NebulaParticles />

            {/* Floating debris */}
            <FloatingDebris />

            {/* Space station */}
            <SpaceStation />

            {/* Shooting stars */}
            <ShootingStar />
        </>
    );
}
