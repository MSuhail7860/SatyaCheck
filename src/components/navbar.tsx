"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Activity, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const STORAGE_KEY = "satyacheck_history_v1";

function useScanCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          setCount(Array.isArray(items) ? items.length : 0);
        }
      } catch {
        setCount(0);
      }
    };
    update();
    window.addEventListener("storage", update);
    // Poll every 2s so new scans show up
    const interval = setInterval(update, 2000);
    return () => {
      window.removeEventListener("storage", update);
      clearInterval(interval);
    };
  }, []);
  return count;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scanCount = useScanCount();

  const links = [
    { name: "Home", path: "/" },
    { name: "Trending Threats", path: "/dashboard" },
    { name: "Spot the Fake Academy", path: "/academy" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

        <div className="flex items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2 group">
            <div className="p-1.5 bg-truth/10 rounded-lg group-hover:bg-truth/20 transition-colors">
              <ShieldCheck className="h-6 w-6 text-truth drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                SatyaCheck
              </span>
              {scanCount > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-truth/10 text-truth border border-truth/20 px-2 py-0.5 rounded-full">
                  <Activity className="w-2.5 h-2.5" />
                  {scanCount} scan{scanCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-sm font-semibold transition-colors hover:text-foreground/90 ${
                    isActive ? "text-foreground" : "text-foreground/50"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute -bottom-[21px] left-0 h-[2px] w-full bg-truth shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 text-foreground/70 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-background overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold p-2 rounded-md ${
                    pathname === link.path ? "bg-white/10 text-foreground" : "text-foreground/60 hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {scanCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-truth/70 px-2">
                  <Activity className="w-3 h-3" />
                  {scanCount} verification{scanCount !== 1 ? "s" : ""} run this session
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
