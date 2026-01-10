"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { skills } from "@/lib/data";

const categoryColors: Record<string, { primary: string; glow: string; bg: string }> = {
    language: { primary: "#ff6b6b", glow: "rgba(255, 107, 107, 0.6)", bg: "rgba(255, 107, 107, 0.15)" },
    backend: { primary: "#00ff88", glow: "rgba(0, 255, 136, 0.6)", bg: "rgba(0, 255, 136, 0.15)" },
    frontend: { primary: "#4ecdc4", glow: "rgba(78, 205, 196, 0.6)", bg: "rgba(78, 205, 196, 0.15)" },
    database: { primary: "#ffe66d", glow: "rgba(255, 230, 109, 0.6)", bg: "rgba(255, 230, 109, 0.15)" },
    tools: { primary: "#95afc0", glow: "rgba(149, 175, 192, 0.6)", bg: "rgba(149, 175, 192, 0.15)" },
    design: { primary: "#ff9ff3", glow: "rgba(255, 159, 243, 0.6)", bg: "rgba(255, 159, 243, 0.15)" },
    fundamental: { primary: "#a29bfe", glow: "rgba(162, 155, 254, 0.6)", bg: "rgba(162, 155, 254, 0.15)" },
};

const categoryLabels: Record<string, string> = {
    language: "Languages",
    backend: "Backend",
    frontend: "Frontend",
    database: "Database",
    tools: "DevOps & Tools",
    design: "Design",
    fundamental: "Fundamentals",
};

// Define connections between skills
const skillConnections: [string, string][] = [
    // Languages to frameworks
    ["java", "spring-boot"],
    ["java", "hibernate"],
    ["javascript", "react"],
    ["javascript", "nextjs"],
    ["typescript", "react"],
    ["typescript", "nextjs"],
    // Backend connections
    ["spring-boot", "hibernate"],
    ["spring-boot", "kafka"],
    ["spring-boot", "redis"],
    ["spring-boot", "microservices"],
    // Frontend connections
    ["react", "nextjs"],
    ["react", "tailwind"],
    ["html", "css"],
    ["css", "tailwind"],
    // Database connections
    ["mysql", "hibernate"],
    ["postgresql", "hibernate"],
    ["mongodb", "spring-boot"],
    ["redis", "spring-boot"],
    // Tools connections
    ["docker", "kubernetes"],
    ["docker", "microservices"],
    ["git", "github"],
    ["aws", "docker"],
    // Cross-category
    ["nextjs", "tailwind"],
    ["react", "redux"],
];

interface NodePosition {
    id: string;
    x: number;
    y: number;
    skill: typeof skills[0];
}

interface Edge {
    from: string;
    to: string;
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
}

function GraphEdge({ edge, isHighlighted, activeNode }: {
    edge: Edge;
    isHighlighted: boolean;
    activeNode: string | null;
}) {
    const fromSkill = skills.find(s => s.id === edge.from);
    const toSkill = skills.find(s => s.id === edge.to);

    const fromColor = fromSkill ? categoryColors[fromSkill.category].primary : "#00ff88";
    const toColor = toSkill ? categoryColors[toSkill.category].primary : "#00ff88";

    const isConnectedToActive = activeNode === edge.from || activeNode === edge.to;

    return (
        <motion.line
            x1={edge.fromPos.x}
            y1={edge.fromPos.y}
            x2={edge.toPos.x}
            y2={edge.toPos.y}
            stroke={`url(#gradient-${edge.from}-${edge.to})`}
            strokeWidth={isConnectedToActive ? 3 : isHighlighted ? 2 : 1}
            strokeOpacity={isConnectedToActive ? 1 : isHighlighted ? 0.6 : 0.2}
            initial={{ pathLength: 0 }}
            animate={{
                pathLength: 1,
                strokeOpacity: isConnectedToActive ? 1 : isHighlighted ? 0.6 : 0.2,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        />
    );
}

function GraphNode({
    node,
    isActive,
    connectedNodes,
    onHover
}: {
    node: NodePosition;
    isActive: boolean;
    connectedNodes: string[];
    onHover: (id: string | null) => void;
}) {
    const colors = categoryColors[node.skill.category];
    const size = 50 + node.skill.level * 8;
    const isConnected = connectedNodes.includes(node.id);

    return (
        <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 200, delay: Math.random() * 0.5 }}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Outer glow */}
            <motion.circle
                cx={node.x}
                cy={node.y}
                r={size / 2 + 15}
                fill={colors.glow}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isActive ? 0.8 : isConnected ? 0.4 : 0.1,
                    r: isActive ? size / 2 + 25 : size / 2 + 15,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Main circle */}
            <motion.circle
                cx={node.x}
                cy={node.y}
                r={size / 2}
                fill={colors.bg}
                stroke={colors.primary}
                strokeWidth={isActive ? 3 : 2}
                animate={{
                    r: isActive ? size / 2 + 5 : size / 2,
                    strokeWidth: isActive ? 4 : 2,
                }}
                transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Inner circle (level indicator) */}
            <circle
                cx={node.x}
                cy={node.y}
                r={size / 2 - 8}
                fill="none"
                stroke={colors.primary}
                strokeWidth={2}
                strokeDasharray={`${(node.skill.level / 5) * (Math.PI * (size - 16))} ${Math.PI * (size - 16)}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${node.x} ${node.y})`}
                opacity={0.6}
            />

            {/* Pulse effect when active */}
            {isActive && (
                <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={size / 2}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth={2}
                    initial={{ r: size / 2, opacity: 1 }}
                    animate={{ r: size / 2 + 30, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}

            {/* Text */}
            <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.primary}
                fontSize={node.skill.name.length > 8 ? 9 : 11}
                fontWeight="bold"
                style={{
                    textShadow: `0 0 10px ${colors.glow}`,
                    pointerEvents: "none",
                }}
            >
                {node.skill.name.length > 10 ? node.skill.name.slice(0, 8) + ".." : node.skill.name}
            </text>
        </motion.g>
    );
}

function SkillTooltip({ skill, position }: { skill: typeof skills[0]; position: { x: number; y: number } }) {
    const colors = categoryColors[skill.category];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed z-50 pointer-events-none"
            style={{
                left: position.x + 60,
                top: position.y - 30,
            }}
        >
            <div
                className="px-5 py-4 rounded-xl backdrop-blur-xl border"
                style={{
                    background: "rgba(0, 0, 0, 0.95)",
                    borderColor: colors.primary,
                    boxShadow: `0 20px 60px ${colors.glow}, 0 0 30px ${colors.glow}`,
                }}
            >
                <div className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
                    {skill.name}
                </div>
                <div className="flex gap-1.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="w-4 h-4 rounded-full"
                            style={{
                                backgroundColor: i < skill.level ? colors.primary : "rgba(255,255,255,0.15)",
                                boxShadow: i < skill.level ? `0 0 12px ${colors.glow}` : "none",
                            }}
                        />
                    ))}
                </div>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                    {categoryLabels[skill.category]}
                </div>
            </div>
        </motion.div>
    );
}

export function SkillsGalaxy() {
    const sectionRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current?.parentElement) {
                setDimensions({
                    width: svgRef.current.parentElement.offsetWidth,
                    height: Math.max(600, window.innerHeight * 0.7),
                });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Track mouse position for tooltip
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    // Calculate node positions using force-directed-like layout
    const nodePositions: NodePosition[] = skills.map((skill, index) => {
        const categories = [...new Set(skills.map(s => s.category))];
        const categoryIndex = categories.indexOf(skill.category);
        const skillsInCategory = skills.filter(s => s.category === skill.category);
        const indexInCategory = skillsInCategory.indexOf(skill);

        // Position in a grid-like pattern with some variation
        const cols = Math.ceil(Math.sqrt(skills.length));
        const row = Math.floor(index / cols);
        const col = index % cols;

        const cellWidth = dimensions.width / (cols + 1);
        const cellHeight = dimensions.height / (Math.ceil(skills.length / cols) + 1);

        // Add some organic variation based on category
        const angleOffset = (categoryIndex * 0.5) + (indexInCategory * 0.3);
        const radiusOffset = 30 + (skill.level * 5);

        return {
            id: skill.id,
            x: cellWidth * (col + 1) + Math.sin(angleOffset) * radiusOffset,
            y: cellHeight * (row + 1) + Math.cos(angleOffset) * radiusOffset,
            skill,
        };
    });

    // Calculate edges
    const edges: Edge[] = skillConnections
        .map(([from, to]) => {
            const fromNode = nodePositions.find(n => n.id === from);
            const toNode = nodePositions.find(n => n.id === to);
            if (fromNode && toNode) {
                return {
                    from,
                    to,
                    fromPos: { x: fromNode.x, y: fromNode.y },
                    toPos: { x: toNode.x, y: toNode.y },
                };
            }
            return null;
        })
        .filter((e): e is Edge => e !== null);

    // Get connected nodes for the active node
    const connectedNodes = activeNode
        ? skillConnections
            .filter(([from, to]) => from === activeNode || to === activeNode)
            .flatMap(([from, to]) => [from, to])
            .filter(id => id !== activeNode)
        : [];

    const activeSkill = activeNode ? skills.find(s => s.id === activeNode) : null;

    return (
        <section
            ref={sectionRef}
            className="min-h-screen py-32 px-4 relative z-10 overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000815]/90 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="text-xs text-[#00ff88]/50 font-mono tracking-[0.5em] mb-4">
                        SKILL NETWORK
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                        CAPABILITIES
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-6"
                    />
                    <p className="text-gray-500 text-sm mt-4 font-mono">
                        Hover nodes to explore connections
                    </p>
                </motion.div>

                {/* Graph container */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(0,255,136,0.02) 0%, transparent 70%)",
                        border: "1px solid rgba(0,255,136,0.1)",
                    }}
                >
                    <svg
                        ref={svgRef}
                        width="100%"
                        height={dimensions.height}
                        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                        className="overflow-visible"
                    >
                        {/* Gradient definitions for edges */}
                        <defs>
                            {edges.map(edge => {
                                const fromSkill = skills.find(s => s.id === edge.from);
                                const toSkill = skills.find(s => s.id === edge.to);
                                const fromColor = fromSkill ? categoryColors[fromSkill.category].primary : "#00ff88";
                                const toColor = toSkill ? categoryColors[toSkill.category].primary : "#00ff88";
                                return (
                                    <linearGradient
                                        key={`gradient-${edge.from}-${edge.to}`}
                                        id={`gradient-${edge.from}-${edge.to}`}
                                        x1={edge.fromPos.x}
                                        y1={edge.fromPos.y}
                                        x2={edge.toPos.x}
                                        y2={edge.toPos.y}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0%" stopColor={fromColor} />
                                        <stop offset="100%" stopColor={toColor} />
                                    </linearGradient>
                                );
                            })}
                        </defs>

                        {/* Grid background */}
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="rgba(0,255,136,0.05)"
                                strokeWidth="1"
                            />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Edges */}
                        <g>
                            {edges.map(edge => (
                                <GraphEdge
                                    key={`${edge.from}-${edge.to}`}
                                    edge={edge}
                                    isHighlighted={connectedNodes.includes(edge.from) || connectedNodes.includes(edge.to)}
                                    activeNode={activeNode}
                                />
                            ))}
                        </g>

                        {/* Nodes */}
                        <g>
                            {nodePositions.map(node => (
                                <GraphNode
                                    key={node.id}
                                    node={node}
                                    isActive={activeNode === node.id}
                                    connectedNodes={connectedNodes}
                                    onHover={setActiveNode}
                                />
                            ))}
                        </g>
                    </svg>

                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#00ff88]/30 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#00ff88]/30 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#00ff88]/30 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#00ff88]/30 rounded-br-lg" />
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                    {activeSkill && (
                        <SkillTooltip skill={activeSkill} position={mousePos} />
                    )}
                </AnimatePresence>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-3 mt-8"
                >
                    {Object.entries(categoryColors).map(([category, colors]) => (
                        <div
                            key={category}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.primary}40`,
                            }}
                        >
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    backgroundColor: colors.primary,
                                    boxShadow: `0 0 8px ${colors.glow}`,
                                }}
                            />
                            <span className="text-[10px] font-mono text-gray-300 uppercase">
                                {categoryLabels[category]}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
