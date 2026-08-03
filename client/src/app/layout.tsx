import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ascend OS - Continuous Progression Platform",
  description: "Scalable SaaS Architecture and Habit Life Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", spaceGrotesk.variable, inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="h-full bg-[#0B1020] text-slate-100 antialiased selection:bg-blue-500 selection:text-white flex flex-col font-sans">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
