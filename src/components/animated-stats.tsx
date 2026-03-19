"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 2.3, suffix: "M+", label: "Verified Claims", color: "text-truth" },
  { value: 6, suffix: "", label: "Threat Types", color: "text-suspicious" },
  { value: 5, suffix: "", label: "Indian Languages", color: "text-white" },
  { value: 99, suffix: "%", label: "Accuracy", color: "text-truth" },
];

function AnimatedNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 1500;
    const step = 16;
    const increments = Math.ceil(duration / step);
    const inc = end / increments;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      start = Math.min(start + inc, end);
      setDisplay(parseFloat(start.toFixed(1)));
      if (count >= increments) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className={`font-extrabold text-base ${color}`}>
      {display % 1 === 0 ? display.toFixed(0) : display.toFixed(1)}{suffix}
    </span>
  );
}

export function AnimatedStats() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 pt-4 pb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center space-x-2 text-sm text-foreground/60 font-semibold bg-black/50 px-5 py-2.5 rounded-full border border-white/10 shadow-inner"
        >
          <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />
          <span>{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
