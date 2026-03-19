"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const steps = [
  "Initializing secure AI connection...",
  "Extracting key entities and claims...",
  "Cross-referencing global credibility databases...",
  "Running pattern recognition algorithms...",
  "Analyzing image manipulation markers...",
  "Compiling final truth analysis report..."
];

export function TerminalLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Reveal a new step every 600ms to simulate fast computation
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm shadow-[0_0_30px_rgba(20,184,166,0.15)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-truth to-transparent animate-pulse" />
      
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-truth" />
          <span className="text-white/60 font-semibold tracking-widest uppercase text-xs">AI Kernel</span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 transition-all duration-500 ${
              index > currentStep ? "opacity-0 hidden" : "opacity-100"
            } ${index === currentStep ? "text-truth scale-100" : "text-white/40 scale-[0.98]"}`}
          >
            <span className="text-truth/40 shrink-0 select-none">{`[${(index + 1).toString().padStart(2, '0')}]`}</span>
            <span className="tracking-wide">{step}</span>
            {index === currentStep && (
              <span className="w-2 h-4 bg-truth/80 animate-ping inline-block ml-1"></span>
            )}
            {index < currentStep && (
              <span className="text-green-500/80 ml-auto">DONE</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
