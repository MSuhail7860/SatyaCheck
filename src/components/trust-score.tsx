"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface TrustScoreProps {
  score: number;
}

export function TrustScore({ score }: TrustScoreProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayColor, setDisplayColor] = useState("text-destructive");
  const [displayBg, setDisplayBg] = useState("bg-destructive/20 text-destructive border-destructive/20");
  const [glowClass, setGlowClass] = useState("animate-glow-fake");
  const [label, setLabel] = useState("Likely Misinformation");

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  useEffect(() => {
    if (score >= 80) {
      setDisplayColor("text-truth");
      setDisplayBg("bg-truth/20 text-truth border-truth/20");
      setGlowClass("animate-glow-truth");
      setLabel("Highly Reliable");
    } else if (score >= 50) {
      setDisplayColor("text-suspicious");
      setDisplayBg("bg-suspicious/20 text-suspicious border-suspicious/20");
      setGlowClass("animate-glow-warn");
      setLabel("Questionable Info");
    } else {
      setDisplayColor("text-destructive");
      setDisplayBg("bg-destructive/20 text-destructive border-destructive/20");
      setGlowClass("animate-glow-fake");
      setLabel("Likely Misinformation");
    }
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-black/40 border border-white/10 shadow-inner ${glowClass}`}>
        {/* Diffuse color glow behind */}
        <div className={`absolute inset-2 rounded-full blur-2xl opacity-20 ${displayBg.split(" ")[0]}`}></div>
        
        <svg className="absolute inset-0 h-full w-full -rotate-90 transform overflow-visible">
          <circle
            className="text-white/5"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="62"
            cx="72"
            cy="72"
          />
          <motion.circle
            className={displayColor}
            strokeWidth="8"
            strokeDasharray={389.55}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="62"
            cx="72"
            cy="72"
            initial={{ strokeDashoffset: 389.55 }}
            animate={{ strokeDashoffset: 389.55 - (389.55 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0px 0px 8px currentColor)" }}
          />
        </svg>
        <motion.span className={`text-5xl font-extrabold tabular-nums tracking-tighter ${displayColor}`}>
          {rounded}
        </motion.span>
      </div>
      
      <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide flex items-center shadow-lg ${displayBg}`}>
        {label}
      </div>
    </div>
  );
}
