"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
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

interface SkillPlanetProps {
    skill: typeof skills[0];
    position: [number, number, number];
    orbitCenter: [number, number, number];
    orbitSpeed: number;
    orbitRadius: number;
}

function SkillPlanet({ skill, orbitCenter, orbitSpeed, orbitRadius }: Omit<SkillPlanetProps, 'position'>) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const color = new THREE.Color(categoryColors[skill.category]);
    const size = 0.3 + skill.level * 0.1;

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime;

        // Orbit around center
        const angle = time * orbitSpeed;
        meshRef.current.position.x = orbitCenter[0] + Math.cos(angle) * orbitRadius;
        meshRef.current.position.z = orbitCenter[2] + Math.sin(angle) * orbitRadius;
        meshRef.current.position.y = orbitCenter[1] + Math.sin(time * 0.5) * 0.3;

        // Self rotation
        meshRef.current.rotation.y = time * 0.3;

        // Pulse when hovered
        const scale = hovered ? size * 1.3 : size;
        meshRef.current.scale.setScalar(scale);

        if (glowRef.current) {
            glowRef.current.position.copy(meshRef.current.position);
            glowRef.current.scale.setScalar(scale * 2);
        }

        if (ringRef.current && skill.level >= 4) {
            ringRef.current.position.copy(meshRef.current.position);
            ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
            ringRef.current.rotation.z = time * 0.5;
        }
    });

    return (
        <group>
            {/* Glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={hovered ? 0.3 : 0.1}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Planet */}
            <mesh
                ref={meshRef}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.4}
                    metalness={0.6}
                    roughness={0.3}
                />

                {/* Label */}
                {hovered && (
                    <Html center distanceFactor={10}>
                        <div className="px-3 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg whitespace-nowrap">
                            <div className="text-sm font-bold" style={{ color: categoryColors[skill.category] }}>
                                {skill.name}
                            </div>
                            <div className="flex gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: i < skill.level ? categoryColors[skill.category] : "rgba(255,255,255,0.2)",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Html>
                )}
            </mesh>

            {/* Ring for high-level skills */}
            {skill.level >= 4 && (
                <mesh ref={ringRef}>
                    <torusGeometry args={[0.5, 0.05, 8, 32]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.6}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}
        </group>
    );
}

// Central skill core
function SkillCore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.2;
            meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
        }

        if (ringsRef.current) {
            ringsRef.current.children.forEach((ring, i) => {
                ring.rotation.z = time * (0.3 + i * 0.1);
                ring.rotation.x = Math.PI / 3 + Math.sin(time * 0.5 + i) * 0.2;
            });
        }
    });

    return (
        <group position={[0, 0, -15]}>
            {/* Central glowing core */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
                <mesh ref={meshRef}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="#00ff88"
                        emissive="#00ff88"
                        emissiveIntensity={1.5}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>

                {/* Inner glow */}
                <mesh scale={1.3}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            </Float>

            {/* Orbiting rings */}
            <group ref={ringsRef}>
                {[1.5, 2, 2.5].map((radius, i) => (
                    <mesh key={i} rotation={[Math.PI / 3 + i * 0.3, 0, 0]}>
                        <torusGeometry args={[radius, 0.02, 8, 64]} />
                        <meshBasicMaterial
                            color="#00ff88"
                            transparent
                            opacity={0.4 - i * 0.1}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                ))}
            </group>

            {/* Point light */}
            <pointLight color="#00ff88" intensity={3} distance={20} />
        </group>
    );
}

export function SkillsPlanetSystem() {
    const groupRef = useRef<THREE.Group>(null);
    const { scrollProgress } = useVoidStore();

    // Generate skill positions
    const skillData = useMemo(() => {
        const categories = [...new Set(skills.map(s => s.category))];
        const positions = new Map<string, THREE.Vector3>();

        const data = skills.map((skill) => {
            const categoryIndex = categories.indexOf(skill.category);
            const skillsInCategory = skills.filter(s => s.category === skill.category);
            const indexInCategory = skillsInCategory.indexOf(skill);

            const orbitRadius = 4 + categoryIndex * 2;
            const orbitSpeed = 0.2 - categoryIndex * 0.02;
            const initialAngle = (indexInCategory / skillsInCategory.length) * Math.PI * 2;

            const position: [number, number, number] = [
                Math.cos(initialAngle) * orbitRadius,
                (categoryIndex - categories.length / 2) * 0.8,
                Math.sin(initialAngle) * orbitRadius - 15,
            ];

            positions.set(skill.id, new THREE.Vector3(...position));

            return {
                skill,
                position,
                orbitCenter: [0, (categoryIndex - categories.length / 2) * 0.8, -15] as [number, number, number],
                orbitSpeed,
                orbitRadius,
            };
        });

        return { data, positions };
    }, []);

    // Show/hide based on scroll
    useFrame(() => {
        if (!groupRef.current) return;
        const visible = scrollProgress > 0.5 && scrollProgress < 0.85;
        groupRef.current.visible = visible;
    });

    return (
        <group ref={groupRef}>
            {/* Central core */}
            <SkillCore />

            {/* Skill planets */}
            {skillData.data.map((item) => (
                <SkillPlanet
                    key={item.skill.id}
                    skill={item.skill}
                    orbitCenter={item.orbitCenter}
                    orbitSpeed={item.orbitSpeed}
                    orbitRadius={item.orbitRadius}
                />
            ))}

            {/* Orbit paths */}
            {[4, 6, 8, 10, 12, 14].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, (i - 2.5) * 0.8, -15]}>
                    <ringGeometry args={[radius, radius + 0.02, 64]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        transparent
                        opacity={0.1}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}
