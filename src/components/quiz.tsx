"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    scenario: "⚠️ URGENT: Your SBI account will be BLOCKED in 24 hours! Click this link immediately to complete your mandatory e-KYC: http://sbi-kyc-update.free.nf/login",
    options: ["Phishing Link", "Fake Urgency", "Authority Manipulation", "All of the above"],
    correctIndex: 3,
    explanation: "This message uses ALL three tactics: fake urgency (24-hour countdown), impersonation of a trusted authority (SBI), and a suspicious phishing link designed to steal your credentials.",
  },
  {
    id: 2,
    scenario: "📹 [Video from 2015 drought in Ethiopia] — shared in 2024 with caption: 'Shocking footage from the devastating floods in Assam this week. Share to help victims!'",
    options: ["Fake Urgency", "Out-of-Context Media", "Authority Manipulation", "Secret Knowledge"],
    correctIndex: 1,
    explanation: "This is 'Out-of-Context Media' — old or unrelated footage is recycled for a different event to mislead viewers and amplify emotional response to a fake narrative.",
  },
  {
    id: 3,
    scenario: "The mainstream media is hiding THIS from you: Eating 3 raw garlic cloves daily cures Type-2 Diabetes completely. A Harvard study they don't want you to see!",
    options: ["Emotional Manipulation", "False Authority", "Secret Knowledge + False Authority", "Job Fraud"],
    correctIndex: 2,
    explanation: "This combines two tactics: 'Secret Knowledge' (media suppression conspiracy) and 'False Authority' (fabricating a Harvard study). No such study exists; this is dangerous health misinformation.",
  },
  {
    id: 4,
    scenario: "🎉 Congratulations! You've been selected for a Part-Time Work-From-Home job! Earn ₹15,000/week by liking YouTube videos. Registration fee of ₹299 required. WhatsApp: +91-XXXXXXXX",
    options: ["Financial Scam", "Job Fraud via Advance Fee", "Phishing Link", "Fake Urgency"],
    correctIndex: 1,
    explanation: "This is a classic 'Job Fraud via Advance Fee' scam. Legitimate employers never charge a registration or processing fee. The small fee request is designed to seem harmless while stealing money from hundreds of victims.",
  },
  {
    id: 5,
    scenario: "India's top virologist says: 'Drinking boiled Neem leaf water every morning PREVENTS all COVID variants.' Forward this to save lives! RBI approved health advisory.",
    options: ["Authority Manipulation", "False Urgency", "Conspiracy Theory", "Authority Manipulation + False Logic"],
    correctIndex: 3,
    explanation: "Multiple red flags here: impersonating medical authorities ('India's top virologist'), completely irrelevant authority claims ('RBI approved' — RBI regulates banking, not health), and unproven medical claims. Always verify health claims with WHO or Ministry of Health.",
  },
];

export function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];
  const selected = selectedAnswers[currentQ];
  const correct = question.correctIndex;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    const updated = [...selectedAnswers];
    updated[currentQ] = idx;
    setSelectedAnswers(updated);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowExplanation(false);
    setFinished(false);
  };

  const score = selectedAnswers.filter((a, i) => a === questions[i].correctIndex).length;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-truth/10 border border-truth/20">
            <Trophy className="w-12 h-12 text-truth" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold mb-2">Quiz Complete!</h3>
        <p className="text-foreground/60 mb-6">You scored <span className="text-truth font-bold text-xl">{score} / {questions.length}</span></p>
        
        <div className="w-full bg-white/5 rounded-full h-3 mb-2 overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${pct >= 80 ? "bg-truth" : pct >= 50 ? "bg-suspicious" : "bg-destructive"}`}
          />
        </div>
        <p className="text-xs text-foreground/40 mb-8 font-semibold uppercase tracking-widest">
          {pct >= 80 ? "Expert Fact-Checker 🛡️" : pct >= 50 ? "Getting There — Keep Learning 📚" : "Keep Practicing — Don't Give Up 💪"}
        </p>

        {/* Per-question recap */}
        <div className="space-y-2 mb-8 text-left">
          {questions.map((q, i) => {
            const ans = selectedAnswers[i];
            const isCorrect = ans === q.correctIndex;
            return (
              <div key={q.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium ${isCorrect ? "bg-truth/10 border-truth/20 text-truth" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                {isCorrect ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span className="text-foreground/80 line-clamp-1">Q{q.id}: {q.options[q.correctIndex]}</span>
              </div>
            );
          })}
        </div>

        <Button onClick={handleRestart} className="bg-truth hover:bg-truth/80 text-black font-bold gap-2">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-xs font-semibold text-truth">
          {selectedAnswers.filter((a, i) => a !== null && a === questions[i].correctIndex).length} correct so far
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-truth rounded-full"
          animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Scenario */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 mb-6 shadow-inner">
            <p className="text-sm font-semibold uppercase tracking-widest text-foreground/40 mb-3">Identify the technique:</p>
            <p className="text-foreground/90 leading-relaxed text-base font-medium">{question.scenario}</p>
          </div>

          {/* Options */}
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((opt, idx) => {
              let cls = "bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10 hover:border-white/20 cursor-pointer";
              if (selected !== null) {
                if (idx === correct) cls = "bg-truth/15 border-truth/40 text-truth cursor-default";
                else if (idx === selected && selected !== correct) cls = "bg-destructive/15 border-destructive/40 text-destructive cursor-default";
                else cls = "bg-white/5 border-white/5 text-foreground/30 cursor-default";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left ${cls}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs shrink-0 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                  {selected !== null && idx === correct && <CheckCircle className="w-4 h-4 ml-auto shrink-0" />}
                  {selected !== null && idx === selected && selected !== correct && <XCircle className="w-4 h-4 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 bg-black/30 border border-white/10 rounded-xl p-4 overflow-hidden"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-truth/70 mb-2">📖 Why?</p>
                <p className="text-foreground/70 text-sm leading-relaxed">{question.explanation}</p>
                <Button
                  onClick={handleNext}
                  className="mt-4 bg-truth hover:bg-truth/80 text-black font-bold gap-2 px-6"
                >
                  {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
