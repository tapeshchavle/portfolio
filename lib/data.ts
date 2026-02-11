export const personalInfo = {
    name: "Tapesh Chavle",
    role: "Full Stack Developer",
    tagline: "Building scalable systems with Spring Boot & React",
    email: "tapeshchawle@gmail.com",
    github: "https://github.com/tapeshchavle",
    linkedin: "https://www.linkedin.com/in/tapesh-chavle-48656b23a/",
    leetcode: "https://leetcode.com/tapeshchavle/",
    gfg: "https://www.geeksforgeeks.org/user/tapeshc7nep/",
    resumeUrl: "/resume.pdf",
    bio: `I'm a dedicated Full Stack Java Developer with a strong focus on building scalable and efficient web applications using Spring Boot. Currently pursuing my B.Tech and in my 4th year, I have hands-on experience delivering real-world projects.`,
};

export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    github: string;
    demo: string;
    featured: boolean;
}

export const projects: Project[] = [
    {
        id: "foodingo",
        title: "Foodingo",
        description:
            "Full-featured food delivery and restaurant discovery web application inspired by Zomato. Real-time order tracking, payment integration, and restaurant management.",
        image: "/foodingo.png",
        tags: ["React", "Spring Boot", "MongoDB", "Tailwind", "RazorPay", "JWT", "Shadcn"],
        github: "https://github.com/tapeshchavle/foodingo",
        demo: "https://foodingo.tapesh.me/",
        featured: true,
    },
    {
        id: "medibook",
        title: "MediBook",
        description:
            "A smart doctor-patient booking system is a digital, web-based, or mobile application designed to streamline scheduling by allowing patients to book, reschedule, or cancel appointments 24/7, reducing manual front-desk work.",
        image: "/medibook.png",
        tags: ["React", "Spring Boot", "MySql", "Shadcn", "RazorPay", "JWT"],
        github: "https://github.com/tapeshchavle/medibook",
        demo: "https://medibook.tapesh.me/",
        featured: true,
    },
    {
        id: "bg-remover",
        title: "Background Remover",
        description:
            "SaaS-based background removal tool with AI-powered precision. Cloud-based processing for automatic image background removal.",
        image: "/bg-remover.png",
        tags: ["React", "Spring Boot", "Clerk", "MySQL", "Tailwind"],
        github: "https://github.com/tapeshchavle/background-remover",
        demo: "https://bg-remover.tapesh.me/",
        featured: false,
    },
    {
        id: "todesktop",
        title: "ToDesktop",
        description:
            "Modern website showcasing advanced Tailwind CSS animations and responsive design patterns.",
        image: "/todesktop.png",
        tags: ["Tailwind", "JavaScript", "HTML", "CSS"],
        github: "https://github.com/tapeshchavle/ToDesktop.com",
        demo: "https://todesktop.tapesh.me/",
        featured: false,
    },
    {
        id: "gadgethub",
        title: "GadgetHub",
        description:
            "E-Commerce application like Amazon and Flipkart for online shopping with full cart and checkout functionality.",
        image: "/gadgethub.png",
        tags: ["Java", "JEE", "Bootstrap", "JSP", "Servlet", "Oracle"],
        github: "#",
        demo: "#",
        featured: false,
    },
    {
        id: "techblog",
        title: "TechBlog",
        description:
            "Dynamic blogging platform for tech enthusiasts to share, explore, and comment on technology articles.",
        image: "/techblog.png",
        tags: ["Java", "JEE", "Bootstrap", "JSP", "Servlet", "MySQL"],
        github: "https://github.com/tapeshchavle/TechBlog",
        demo: "#",
        featured: false,
    },
    {
        id: "resume-extractor",
        title: "Resume Skills Matcher",
        description:
            "Java-based application that extracts skills and relevant data from resumes using OpenNLP, PdfBox, and Apache POI.",
        image: "/resume-data.png",
        tags: ["Java", "OpenNLP", "PdfBox", "Apache POI"],
        github: "https://github.com/tapeshchavle/ResumeDataExtractor",
        demo: "#",
        featured: true,
    },
    {
        id: "chat-app",
        title: "Chat Application",
        description:
            "Real-time chat application with WebSocket support for instant messaging.",
        image: "/chat.png",
        tags: ["Java", "Spring Boot", "Socket.io"],
        github: "#",
        demo: "#",
        featured: false,
    },
];

export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    duration: string;
    description: string;
    achievements: string[];
    techStack: string[];
    projectUrl?: string;
    projectName?: string;
}

export const experiences: Experience[] = [
    {
        id: "exp-1",
        role: "Java Spring Boot Backend Developer Intern",
        company: "Vidyayatan Technologies LLP - Vacademy", // Inferred, user didn't specify
        period: "July 2025 - Feb 2026",
        duration: "8 Months",
        description: "Implemented workflow automation and backend systems from scratch using Spring Boot and Microservices architecture.",
        achievements: [
            "Built scalable backend services from the ground up using Java Spring Boot",
            "Integrated third-party APIs including WATI (WhatsApp) and COMBOT",
            "Implemented event-driven architecture using Kafka for asynchronous processing",
            "Optimized data storage and retrieval using Redis caching and PostgreSQL",
            "Designed and implemented complex workflow automation logic"
        ],
        techStack: ["Java", "Spring Boot", "Redis", "Kafka", "PostgreSQL", "WATI", "COMBOT"],
        projectName: "Vacademy",
        projectUrl: "https://vacademy.io" // Replace with your live project link
    }
];

export interface SkillNode {
    id: string;
    name: string;
    category: string;
    level: number; // 1-5
    connections: string[];
}

export const skills: SkillNode[] = [
    // Core Languages
    { id: "java", name: "Java", category: "language", level: 5, connections: ["springboot", "jee", "dsa"] },
    { id: "javascript", name: "JavaScript", category: "language", level: 4, connections: ["react", "nodejs"] },
    { id: "typescript", name: "TypeScript", category: "language", level: 3, connections: ["react", "nextjs"] },
    { id: "cpp", name: "C/C++", category: "language", level: 3, connections: ["dsa"] },

    // Backend
    { id: "springboot", name: "Spring Boot", category: "backend", level: 5, connections: ["java", "microservices", "restapi", "mysql", "mongodb"] },
    { id: "jee", name: "Java EE", category: "backend", level: 4, connections: ["java", "jsp", "servlet"] },
    { id: "microservices", name: "Microservices", category: "backend", level: 4, connections: ["springboot", "docker", "restapi"] },
    { id: "restapi", name: "REST API", category: "backend", level: 5, connections: ["springboot", "postman"] },

    // Frontend
    { id: "react", name: "React", category: "frontend", level: 4, connections: ["javascript", "typescript", "tailwind", "nextjs"] },
    { id: "nextjs", name: "Next.js", category: "frontend", level: 3, connections: ["react", "typescript"] },
    { id: "tailwind", name: "Tailwind CSS", category: "frontend", level: 4, connections: ["react", "html"] },
    { id: "html", name: "HTML/CSS", category: "frontend", level: 5, connections: ["tailwind", "bootstrap"] },
    { id: "bootstrap", name: "Bootstrap", category: "frontend", level: 4, connections: ["html"] },

    // Database
    { id: "mysql", name: "MySQL", category: "database", level: 4, connections: ["springboot", "jee"] },
    { id: "mongodb", name: "MongoDB", category: "database", level: 4, connections: ["springboot"] },

    // Tools
    { id: "git", name: "Git", category: "tools", level: 4, connections: ["github"] },
    { id: "github", name: "GitHub", category: "tools", level: 4, connections: ["git"] },
    { id: "docker", name: "Docker", category: "tools", level: 3, connections: ["microservices"] },
    { id: "postman", name: "Postman", category: "tools", level: 4, connections: ["restapi"] },
    { id: "maven", name: "Maven", category: "tools", level: 4, connections: ["java", "springboot"] },

    // Design
    { id: "figma", name: "Figma", category: "design", level: 3, connections: ["responsive"] },
    { id: "responsive", name: "Responsive Design", category: "design", level: 4, connections: ["tailwind", "figma"] },

    // CS Fundamentals
    { id: "dsa", name: "DSA", category: "fundamental", level: 4, connections: ["java", "cpp"] },
];

export const terminalCommands: Record<string, string> = {
    help: `Available commands:
  whoami    - Who is Tapesh?
  skills    - View technical skills
  projects  - List all projects
  contact   - Get contact information
  hire      - Why you should hire me
  resume    - Download resume
  clear     - Clear terminal
  secret    - ???`,

    whoami: `> Tapesh Chavle
  Full Stack Developer | Spring Boot Specialist | 3rd Year B.Tech
  
  Building scalable backend systems and beautiful frontend experiences.
  Passionate about clean code and solving complex problems.`,

    skills: `> Core Stack:
  ├── Backend: Java, Spring Boot, Microservices, REST APIs
  ├── Frontend: React, Next.js, Tailwind CSS
  ├── Database: MySQL, MongoDB
  └── Tools: Git, Docker, Maven, Postman`,

    projects: `> Featured Projects:
  [1] Foodingo     - Food delivery platform
  [2] BG Remover   - AI background removal SaaS
  [3] Resume Parser - NLP-based skills extractor
  
  Type 'demo <number>' to visit project`,

    contact: `> Connect with me:
  📧 Email: tapeshchawle@gmail.com
  💼 LinkedIn: /in/tapesh-chavle-48656b23a
  🐙 GitHub: /tapeshchavle
  💻 LeetCode: /tapeshchavle`,

    hire: `> Why hire me?
  ✓ 2+ years Java experience, 1+ year Spring Boot
  ✓ Full-stack capable with modern React
  ✓ Real-world project delivery experience
  ✓ Clean, maintainable code philosophy
  ✓ Fast learner, team player
  
  Let's build something great together.`,

    secret: `> You found the secret! 🎉
  
  Easter egg unlocked: The void remembers your curiosity.
  Type 'matrix' for a surprise...`,

    matrix: `> Initiating Matrix protocol...
  Wake up, Neo...
  The Matrix has you...`,

    clear: "CLEAR",
};
