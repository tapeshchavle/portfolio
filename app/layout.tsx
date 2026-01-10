import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tapesh Chavle | The Void",
  description: "Full Stack Developer - Enter the void and explore my digital universe",
  keywords: ["Full Stack Developer", "Spring Boot", "React", "Java", "Portfolio"],
  authors: [{ name: "Tapesh Chavle" }],
  openGraph: {
    title: "Tapesh Chavle | The Void",
    description: "Full Stack Developer - Enter the void and explore my digital universe",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-black`}
      >
        {/* Noise overlay */}
        <div className="noise-overlay" />

        {/* Vignette effect */}
        <div className="vignette" />

        {children}
      </body>
    </html>
  );
}
