"use client";

import { useRef, useMemo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { skills, type SkillNode } from "@/lib/data";

const categoryColors: Record<string, string> = {
    language: "#ff6b6b",
    backend: "#00ff88",
    frontend: "#4ecdc4",
    database: "#ffe66d",
    tools: "#95afc0",
    design: "#ff9ff3",
    fundamental: "#a29bfe",
};

const categoryLabels: Record<string, string> = {
    language: "Languages",
    backend: "Backend",
    frontend: "Frontend",
    database: "Database",
    tools: "Tools",
    design: "Design",
    fundamental: "Fundamentals",
};

function SkillNodeComponent({
    skill,
    position,
    onHover,
    isActive,
    isConnected,
}: {
    skill: SkillNode;
    position: { x: number; y: number };
    onHover: (id: string | null) => void;
    isActive: boolean;
    isConnected: boolean;
}) {
    const color = categoryColors[skill.category];
    const size = 40 + skill.level * 8;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isActive ? 1.3 : isConnected ? 1.1 : 1,
                opacity: isActive || isConnected ? 1 : 0.7,
            }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute cursor-pointer"
            style={{
                left: position.x,
                top: position.y,
                transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => onHover(skill.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                    backgroundColor: color,
                    opacity: isActive ? 0.5 : isConnected ? 0.3 : 0.1,
                    width: size * 1.5,
                    height: size * 1.5,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Node circle */}
            <div
                className="relative rounded-full border-2 flex items-center justify-center font-mono text-xs"
                style={{
                    width: size,
                    height: size,
                    borderColor: color,
                    backgroundColor: isActive ? color : `${color}20`,
                    color: isActive ? "#000" : color,
                    boxShadow: `0 0 ${isActive ? 30 : 10}px ${color}40`,
                }}
            >
                {skill.name.slice(0, 3).toUpperCase()}
            </div>

            {/* Label */}
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 5 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
                <div
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{ backgroundColor: color, color: "#000" }}
                >
                    {skill.name}
                </div>
                <div className="text-[10px] text-gray-400 text-center mt-1">
                    Level {skill.level}/5
                </div>
            </motion.div>
        </motion.div>
    );
}

export function SkillNeuralMap() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    // Calculate node positions in a circular/organic layout
    const nodePositions = useMemo(() => {
        const positions: Record<string, { x: number; y: number }> = {};
        const categories = [...new Set(skills.map((s) => s.category))];
        const containerWidth = 800;
        const containerHeight = 600;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        categories.forEach((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category);
            const angleOffset = (catIndex / categories.length) * Math.PI * 2;
            const radius = 150 + catIndex * 30;

            categorySkills.forEach((skill, skillIndex) => {
                const angle =
                    angleOffset + (skillIndex / categorySkills.length) * (Math.PI / 2);
                positions[skill.id] = {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                };
            });
        });

        return positions;
    }, []);

    // Get connected skills
    const connectedSkills = useMemo(() => {
        if (!hoveredSkill) return new Set<string>();
        const skill = skills.find((s) => s.id === hoveredSkill);
        return new Set(skill?.connections || []);
    }, [hoveredSkill]);

    // Generate connection lines
    const connections = useMemo(() => {
        const lines: { from: string; to: string; key: string }[] = [];
        const processed = new Set<string>();

        skills.forEach((skill) => {
            skill.connections.forEach((connId) => {
                const key = [skill.id, connId].sort().join("-");
                if (!processed.has(key)) {
                    processed.add(key);
                    lines.push({ from: skill.id, to: connId, key });
                }
            });
        });

        return lines;
    }, []);

    return (
        <section
            ref={sectionRef}
            className="min-h-screen py-32 px-4 md:px-8 relative z-10"
        >
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <div className="text-xs text-[#00ff88]/50 font-mono tracking-[0.5em] mb-4">
                    NEURAL NETWORK
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
                    SKILLS
                </h2>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-6" />
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
            >
                {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono text-gray-400">
                            {categoryLabels[category]}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Neural map container */}
            <div className="max-w-4xl mx-auto">
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative bg-black/20 border border-[#00ff88]/10 rounded-lg overflow-hidden"
                    style={{ height: 600 }}
                >
                    {/* Grid background */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
              `,
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {connections.map(({ from, to, key }) => {
                            const fromPos = nodePositions[from];
                            const toPos = nodePositions[to];
                            if (!fromPos || !toPos) return null;

                            const isHighlighted =
                                hoveredSkill === from ||
                                hoveredSkill === to ||
                                (hoveredSkill &&
                                    (connectedSkills.has(from) || connectedSkills.has(to)));

                            return (
                                <motion.line
                                    key={key}
                                    x1={fromPos.x}
                                    y1={fromPos.y}
                                    x2={toPos.x}
                                    y2={toPos.y}
                                    stroke="#00ff88"
                                    strokeWidth={isHighlighted ? 2 : 0.5}
                                    strokeOpacity={isHighlighted ? 0.6 : 0.1}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Skill nodes */}
                    {skills.map((skill) => (
                        <SkillNodeComponent
                            key={skill.id}
                            skill={skill}
                            position={nodePositions[skill.id]}
                            onHover={setHoveredSkill}
                            isActive={hoveredSkill === skill.id}
                            isConnected={connectedSkills.has(skill.id)}
                        />
                    ))}

                    {/* Center indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border border-[#00ff88]/30 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00ff88]/50 rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Instruction */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.5 } : {}}
                transition={{ delay: 1 }}
                className="text-center text-xs text-gray-500 font-mono mt-6"
            >
                HOVER OVER NODES TO EXPLORE CONNECTIONS
            </motion.p>
        </section>
    );
}
