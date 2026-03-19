"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, BookOpen } from "lucide-react";

export interface FlashcardProps {
  title: string;
  example: string;
  lesson: string;
}

export function Flashcard({ title, example, lesson }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-96 w-full perspective-1000 group">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front side */}
        <Card className="absolute w-full h-full backface-hidden bg-white/5 border-white/10 hover:border-truth/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.12),0_0_60px_rgba(20,184,166,0.06)] transition-all duration-300 flex flex-col pt-8 backdrop-blur-md">
          <CardContent className="flex flex-col flex-1 items-center text-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-truth" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight drop-shadow-md">{title}</h3>
            </div>
            <div className="bg-black/30 p-5 rounded-xl w-full mb-6 relative mt-2 border border-white/5 shadow-inner">
              <span className="absolute -top-3 left-4 bg-background px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground/60 border border-white/10">Example</span>
              <p className="italic text-foreground/80 leading-relaxed text-sm">"{example}"</p>
            </div>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full">Click to reveal lesson</p>
          </CardContent>
        </Card>

        {/* Back side */}
        <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-truth/10 to-transparent border-truth/30 hover:border-truth/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all duration-300 flex flex-col pt-8 backdrop-blur-md" style={{ transform: "rotateY(180deg)" }}>
          <CardContent className="flex flex-col flex-1 items-center text-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-truth/20 border border-truth/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <BrainCircuit className="w-8 h-8 text-truth" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight drop-shadow-md">The Truth</h3>
            </div>
            <div className="bg-black/40 p-5 w-full rounded-xl mb-6 flex-1 flex items-center justify-center border border-white/5 shadow-inner">
              <p className="text-foreground/90 font-medium leading-relaxed">{lesson}</p>
            </div>
            <p className="text-[10px] text-truth/60 font-bold uppercase tracking-widest bg-truth/10 px-4 py-1.5 rounded-full">Click to flip back</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
