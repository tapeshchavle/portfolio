"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, useInView } from "framer-motion";
import { terminalCommands, personalInfo } from "@/lib/data";

interface TerminalLine {
    type: "input" | "output";
    content: string;
}

export function TerminalContact() {
    const sectionRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: "output", content: `Welcome to VOID TERMINAL v1.0.0` },
        { type: "output", content: `Type 'help' for available commands.` },
        { type: "output", content: "" },
    ]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Auto-scroll to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const executeCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Add to command history
        if (trimmedCmd) {
            setCommandHistory((prev) => [...prev, trimmedCmd]);
            setHistoryIndex(-1);
        }

        // Add input to display
        setHistory((prev) => [...prev, { type: "input", content: `> ${cmd}` }]);

        // Handle special commands
        if (trimmedCmd === "clear") {
            setHistory([]);
            return;
        }

        if (trimmedCmd === "resume") {
            window.open(personalInfo.resumeUrl, "_blank");
            setHistory((prev) => [
                ...prev,
                { type: "output", content: "> Opening resume..." },
            ]);
            return;
        }

        if (trimmedCmd.startsWith("demo ")) {
            const projectNum = parseInt(trimmedCmd.split(" ")[1]);
            const urls = [
                "https://foodingo.netlify.app/",
                "https://backg-remover.netlify.app/",
                "https://github.com/tapeshchavle/ResumeDataExtractor",
            ];
            if (projectNum >= 1 && projectNum <= 3) {
                window.open(urls[projectNum - 1], "_blank");
                setHistory((prev) => [
                    ...prev,
                    { type: "output", content: `> Launching project ${projectNum}...` },
                ]);
                return;
            }
        }

        // Look up command
        const response = terminalCommands[trimmedCmd];

        if (response) {
            setHistory((prev) => [...prev, { type: "output", content: response }]);
        } else if (trimmedCmd) {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `Command not found: ${trimmedCmd}\nType 'help' for available commands.`,
                },
            ]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeCommand(input);
            setInput("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex =
                    historyIndex < commandHistory.length - 1
                        ? historyIndex + 1
                        : historyIndex;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

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
                    ESTABLISH CONNECTION
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
                    CONTACT
                </h2>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto mt-6" />
            </motion.div>

            {/* Terminal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-3xl mx-auto"
            >
                {/* Terminal window */}
                <div className="bg-black/80 border border-[#00ff88]/30 rounded-lg overflow-hidden shadow-2xl shadow-[#00ff88]/10">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#00ff88]/10 border-b border-[#00ff88]/20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-[#00ff88]/60 font-mono ml-4">
                            void@tapesh-portfolio ~ /contact
                        </span>
                    </div>

                    {/* Terminal content */}
                    <div
                        ref={terminalRef}
                        className="p-4 h-96 overflow-y-auto font-mono text-sm custom-scrollbar"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {history.map((line, index) => (
                            <div
                                key={index}
                                className={`mb-1 whitespace-pre-wrap ${line.type === "input" ? "text-[#00ff88]" : "text-gray-400"
                                    }`}
                            >
                                {line.content}
                            </div>
                        ))}

                        {/* Input line */}
                        <div className="flex items-center text-[#00ff88]">
                            <span className="mr-2">{">"}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent outline-none caret-[#00ff88]"
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                            />
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-[#00ff88] ml-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick commands */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3 mt-6"
                >
                    {["help", "contact", "projects", "hire"].map((cmd) => (
                        <button
                            key={cmd}
                            onClick={() => {
                                executeCommand(cmd);
                                inputRef.current?.focus();
                            }}
                            className="px-3 py-1 text-xs font-mono text-[#00ff88]/60 border border-[#00ff88]/20 rounded hover:bg-[#00ff88]/10 hover:text-[#00ff88] transition-colors"
                        >
                            {cmd}
                        </button>
                    ))}
                </motion.div>
            </motion.div>

            {/* Direct contact links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-6 mt-12"
            >
                <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-gray-400 hover:text-[#00ff88] transition-colors"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                </a>
                <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ff88] transition-colors"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                </a>
                <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ff88] transition-colors"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
            </motion.div>
        </section>
    );
}
