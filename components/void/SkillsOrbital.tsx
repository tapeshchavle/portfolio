"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useVoidStore } from "@/lib/store";
import { skills } from "@/lib/data";

const categoryColors: Record<string, string> = {
    language: "#ff6b6b",
    backend: "#00ff88",
    frontend: "#4ecdc4",
    database: "#ffe66d",
    tools: "#95afc0",
    design: "#ff9ff3",
    fundamental: "#a29bfe",
};

interface OrbitingSkillProps {
    skill: typeof skills[0];
    orbitRadius: number;
    orbitSpeed: number;
    initialAngle: number;
    yOffset: number;
}

function OrbitingSkill({ skill, orbitRadius, orbitSpeed, initialAngle, yOffset }: OrbitingSkillProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current || !glowRef.current) return;

        const time = state.clock.elapsedTime;
        const angle = initialAngle + time * orbitSpeed;

        // Orbital position
        meshRef.current.position.x = Math.cos(angle) * orbitRadius;
        meshRef.current.position.z = Math.sin(angle) * orbitRadius - 5;
        meshRef.current.position.y = yOffset + Math.sin(time * 2 + initialAngle) * 0.2;

        // Copy position to glow
        glowRef.current.position.copy(meshRef.current.position);

        // Rotation
        meshRef.current.rotation.y = time * 0.5;

        // Pulse effect
        const pulse = 1 + Math.sin(time * 3 + initialAngle) * 0.1;
        meshRef.current.scale.setScalar(0.15 * skill.level * pulse);
        glowRef.current.scale.setScalar(0.3 * skill.level * pulse);
    });

    const color = categoryColors[skill.category];

    return (
        <>
            {/* Glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Core sphere */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
        </>
    );
}

function CentralCore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current || !ringRef.current) return;

        const time = state.clock.elapsedTime;
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.rotation.x = time * 0.1;

        ringRef.current.rotation.z = time * 0.3;
        ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2;
    });

    return (
        <group position={[0, 0, -5]}>
            {/* Core */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <dodecahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial
                        color="#00ff88"
                        emissive="#00ff88"
                        emissiveIntensity={1}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>
            </Float>

            {/* Orbit ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[1.2, 0.02, 8, 64]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
            </mesh>

            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3, 3.05, 64]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Point light at center */}
            <pointLight color="#00ff88" intensity={2} distance={10} />
        </group>
    );
}

export function SkillsOrbital() {
    const groupRef = useRef<THREE.Group>(null);
    const { scrollProgress } = useVoidStore();

    const skillsWithOrbit = useMemo(() => {
        const categories = [...new Set(skills.map(s => s.category))];

        return skills.map((skill) => {
            const categoryIndex = categories.indexOf(skill.category);
            const skillsInCategory = skills.filter(s => s.category === skill.category);
            const indexInCategory = skillsInCategory.indexOf(skill);

            return {
                skill,
                orbitRadius: 2 + categoryIndex * 1.2,
                orbitSpeed: 0.3 - categoryIndex * 0.03,
                initialAngle: (indexInCategory / skillsInCategory.length) * Math.PI * 2,
                yOffset: (categoryIndex - categories.length / 2) * 0.5,
            };
        });
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        // Reveal based on scroll
        const targetOpacity = scrollProgress > 0.5 && scrollProgress < 0.85 ? 1 : 0;
        groupRef.current.visible = targetOpacity > 0.5;
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <CentralCore />

            {skillsWithOrbit.map((item) => (
                <OrbitingSkill
                    key={item.skill.id}
                    skill={item.skill}
                    orbitRadius={item.orbitRadius}
                    orbitSpeed={item.orbitSpeed}
                    initialAngle={item.initialAngle}
                    yOffset={item.yOffset}
                />
            ))}

            {/* Orbit paths */}
            {[2, 3.2, 4.4, 5.6, 6.8, 8].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
                    <ringGeometry args={[radius, radius + 0.01, 64]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.1} side={THREE.DoubleSide} />
                </mesh>
            ))}
        </group>
    );
}
