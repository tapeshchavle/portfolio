"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/lib/data";

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 100, rotateX: -20 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
            style={{ perspective: 1000 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{
                    rotateY: isHovered ? 5 : 0,
                    rotateX: isHovered ? -5 : 0,
                    scale: isHovered ? 1.02 : 1,
                    z: isHovered ? 30 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative overflow-hidden rounded-2xl"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/50 via-transparent to-[#ff0055]/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main card */}
                <div className="relative m-[1px] bg-[#0a0a15] rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            animate={{
                                scale: isHovered ? 1.1 : 1,
                                filter: isHovered ? "brightness(1.1)" : "brightness(0.7)",
                            }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a15] via-transparent to-transparent" />

                        {/* Scan line */}
                        <motion.div
                            animate={{ y: isHovered ? ["0%", "200%"] : "0%" }}
                            transition={{ repeat: isHovered ? Infinity : 0, duration: 2, ease: "linear" }}
                            className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-[#00ff88]/20 to-transparent pointer-events-none"
                        />

                        {/* Featured badge */}
                        {project.featured && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-[#00ff88]/20 backdrop-blur-sm border border-[#00ff88]/50 rounded-full text-xs font-mono text-[#00ff88]">
                                ★ FEATURED
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                            {project.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {project.description}
                        </p>

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 text-xs font-mono text-[#00ff88]/80 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 4 && (
                                <span className="px-2 py-1 text-xs font-mono text-gray-500">
                                    +{project.tags.length - 4}
                                </span>
                            )}
                        </div>

                        {/* Links */}
                        <div className="flex gap-4">
                            {project.github !== "#" && (
                                <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Github size={16} />
                                    Code
                                </motion.a>
                            )}
                            {project.demo !== "#" && (
                                <motion.a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 rounded-lg text-sm text-[#00ff88] transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink size={16} />
                                    Live Demo
                                </motion.a>
                            )}
                        </div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00ff88]/50 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00ff88]/50 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00ff88]/50 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00ff88]/50 rounded-br-2xl" />
                </div>

                {/* Glow effect */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        boxShadow: "0 0 60px rgba(0, 255, 136, 0.2), inset 0 0 60px rgba(0, 255, 136, 0.05)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

export function ProjectHologram() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const featuredProjects = projects.filter((p) => p.featured);
    const otherProjects = projects.filter((p) => !p.featured);

    return (
        <section
            ref={sectionRef}
            className="min-h-screen py-32 px-4 md:px-8 relative z-10"
        >
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/30"
                >
                    <ChevronRight className="w-8 h-8 text-[#00ff88]" />
                </motion.div>

                <div className="text-xs text-[#00ff88]/50 font-mono tracking-[0.5em] mb-4">
                    MEMORY FRAGMENTS
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                    PROJECTS
                </h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-8"
                />
            </motion.div>

            {/* Projects grid */}
            <div className="max-w-7xl mx-auto">
                {/* Featured */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-[#00ff88]/50 font-mono tracking-widest mb-6 flex items-center gap-3"
                >
                    <span className="w-8 h-px bg-[#00ff88]/30" />
                    {"// FEATURED"}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {featuredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* Other projects */}
                {otherProjects.length > 0 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-[#00ff88]/50 font-mono tracking-widest mb-6 flex items-center gap-3"
                        >
                            <span className="w-8 h-px bg-[#00ff88]/30" />
                            {"// ARCHIVE"}
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index + featuredProjects.length}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
