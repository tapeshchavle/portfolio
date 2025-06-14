"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import {
  Menu,
  X,
  GitlabIcon as GitHub,
  ExternalLink,
  Mail,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" className="text-xl font-bold">
            Tapesh Chavle
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {["home", "about", "skills", "projects", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize ${
                  activeSection === item
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 px-4 bg-background border-b">
            <div className="flex flex-col space-y-4">
              {["home", "about", "skills", "projects", "contact"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`capitalize ${
                      activeSection === item
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Hi, I'm{" "}
              <span className="text-primary animate-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                <Typewriter
                  words={[
                    "Tapesh Chavle",
                    "A Full-Stack Developer",
                    "a Designer",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Full Stack SpringBoot Developer & UI/UX Designer
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => scrollToSection("projects")}>
                View My Work
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
              >
                Contact Me
              </Button>
            </div>
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => scrollToSection("about")}
                className="animate-bounce flex flex-col items-center text-muted-foreground hover:text-foreground"
              >
                <span className="mb-2">Learn More</span>
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-full overflow-hidden bg-muted">
                <img
                  src="profile.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-lg mb-4">
                I'm a dedicated Full Stack Java Developer with a strong focus on
                building scalable and efficient web applications using Spring
                Boot. Currently pursuing my B.Tech and in my 3rd year, I have
                hands-on experience delivering real-world projects.
              </p>
              <p className="text-lg mb-6">
                Over the past two years, I've been actively working with Java,
                and for the last year, I've specialized in developing RESTful
                APIs and backend services using Spring Boot. My skill set also
                includes working with databases, frontend technologies, and
                writing clean, maintainable code that meets real-world business
                requirements.
              </p>

              <a
                href="/resume.pdf"
                download
                className="inline-block px-2 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-14 text-primary">
            My Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Programming Languages",
                skills: ["Java", "JEE", "C/C++", "JavaScript"],
              },
              {
                name: "Frontend Development",
                skills: ["React", "Tailwind CSS", "HTML/CSS", "Bootstrap"],
              },
              {
                name: "UI/UX Design",
                skills: ["Figma", "Responsive Design"],
              },
              {
                name: "Backend Development",
                skills: [
                  "Spring Boot",
                  "Microservices",
                  "REST API",
                  "MySQL",
                  "MongoDB",
                  "DSA",
                ],
              },
              {
                name: "Tools & Methods",
                skills: [
                  "Git",
                  "GitHub",
                  "Render",
                  "Spring Tool Suitcase",
                  "Maven",
                  "Docker",
                  "Postman",
                ],
              },
              {
                name: "Soft Skills",
                skills: [
                  "Communication",
                  "Problem Solving",
                  "Teamwork",
                  "Time Management",
                  "Adaptability",
                ],
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  {category.name}
                </h3>
                <ul className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.li
                      key={skillIndex}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    >
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ✨ My Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Foodingo",
                description:
                  "Foodingo is a full-featured food delivery and restaurant discovery web application inspired by Zomato.",
                image: "/foodingo.png?height=400&width=600",
                tags: [
                  "React",
                  "SpringBoot",
                  "MongoDB",
                  "Tailwind",
                  "RazorPay",
                ],
                github: "https://github.com/tapeshchavle/foodingo",
                demo: "https://foodingo.netlify.app/",
              },
              {
                title: "Background Remover",
                description:
                  "BG Remover SaaS-Based Background Removal Tool (Under Development) BG Remover is a cloud-based SaaS application designed to automatically remove image backgrounds with precision and speed",
                image: "/bg-remover.png?height=400&width=600",
                tags: ["React", "Spring Boot", "Clerk", "MySql", "Tailwind"],
                github: "https://github.com/tapeshchavle/background-remover",
                demo: "https://backg-remover.netlify.app/",
              },
              {
                title: "ToDesktop",
                description:
                  "A modern website which is based on tailwind and modern amimation",
                image: "/todesktop.png?height=400&width=600",
                tags: ["Tailwind", "JavaScript", "HTML", "Css"],
                github: "https://github.com/tapeshchavle/ToDesktop.com",
                demo: "https://todesktopapp.netlify.app/",
              },
              {
                title: "Gadgethub",
                description:
                  "This is E-Commerce application like amazon and flipkart where customer can purchase any items online",
                image: "/gadgethub.png?height=400&width=600",
                tags: [
                  "java (JSE)",
                  "JEE",
                  "BootStrap",
                  "JSP",
                  "Servlet",
                  "Oracle Database",
                ],
                github: "#",
                demo: "#",
              },
              {
                title: "TechBlog",
                description:
                  "TechBlog is a dynamic web application built to serve as a platform for tech enthusiasts to share, explore, and comment on various technology-related articles",
                image: "/techblog.png?height=400&width=600",
                tags: [
                  "Java (JSE)",
                  "JEE",
                  "BootStrap",
                  "JSP",
                  "Servlet",
                  "MySql",
                ],
                github: "https://github.com/tapeshchavle/TechBlog",
                demo: "#",
              },
              {
                title: "Resume Skills Matchers",
                description:
                  "This is java based application which extracts the skills and other relavent data from the resume or text file.I uses OpenNLP ,PdfBox ,Apache POI library for extracting the data from resume or text file.",
                image: "/resume-data.png?height=400&width=600",
                tags: ["JEE", "OpenNLP", "Java 8", "PdfBox", "Tailwind"],
                github: "https://github.com/tapeshchavle/ResumeDataExtractor",
                demo: "#",
              },
              {
                title: "Chat Application",
                description: "This is real time chat application like Whatsapp",
                image: "/chat.png?height=400&width=600",
                tags: ["Java", "SpringBoot", "Socketio"],
                github: "#",
                demo: "#",
              },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden border shadow-sm group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      className="flex items-center text-sm hover:text-primary"
                    >
                      <GitHub size={16} className="mr-1" /> Code
                    </a>
                    <a
                      href={project.demo}
                      className="flex items-center text-sm hover:text-primary"
                    >
                      <ExternalLink size={16} className="mr-1" /> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            <div className="w-full md:w-1/2">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-card p-6 rounded-lg border h-full">
                <h3 className="text-xl font-semibold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <a
                        href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                        className="text-muted-foreground"
                      >
                        tapeshchawle@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Linkedin className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <a
                        href="https://www.linkedin.com/in/tapesh-chavle-48656b23a/"
                        className="text-muted-foreground"
                      >
                        https://www.linkedin.com/in/tapesh-chavle-48656b23a/
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <GitHub className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <h4 className="font-medium">GitHub</h4>
                      <a
                        href="https://github.com/tapeshchavle"
                        className="text-muted-foreground"
                      >
                        https://github.com/tapeshchavle
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="font-medium mb-4">Follow Me</h4>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/tapeshchavle"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <GitHub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/tapesh-chavle-48656b23a/"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Mail size={20} />
                    </a>
                    <a
  href="https://leetcode.com/tapeshchavle/"
  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
    alt="LeetCode"
    className="w-5 h-5"
  />
</a>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Tapesh Chavle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
