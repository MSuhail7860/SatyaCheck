import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SatyaCheck | AI Misinformation Detection",
  description: "Advanced AI-Powered Misinformation Detection Platform for India. Verify WhatsApp forwards, images, and social media claims.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} min-h-screen antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans selection:bg-truth/30" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 pb-10">{children}</main>
        
        {/* Global Footer */}
        <footer className="border-t border-white/10 bg-black/40 py-8 backdrop-blur-md">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/50">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
               <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">SatyaCheck</span>
               <span>© {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
               <a href="#" className="hover:text-truth transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-truth transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-truth transition-colors">API Documentation</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
