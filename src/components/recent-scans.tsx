"use client";

import { useHistory } from "@/hooks/use-history";
import { Clock, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RecentScans() {
  const { history, clearHistory } = useHistory();

  if (history.length === 0) return null;

  return (
    <div className="mt-20 max-w-5xl w-full z-10 relative">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          <Clock className="w-6 h-6 text-truth" />
          Recent Scans
        </h2>
        <button 
          onClick={clearHistory}
          className="text-xs font-medium text-foreground/50 hover:text-destructive flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-destructive/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-destructive/30"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(idx * 0.1, 0.5) }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all cursor-default flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    item.result.trustScore > 60 ? "bg-truth/10 text-truth border-truth/20" : 
                    item.result.trustScore >= 40 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}>
                    Score: {item.result.trustScore}
                  </span>
                  <span className="text-[10px] text-foreground/40 font-mono tracking-wider">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 mb-4 overflow-hidden relative">
                   {item.queryType === "image" && <ShieldAlert className="absolute right-2 top-2 w-10 h-10 text-white/5" />}
                   <p className="text-sm text-foreground/80 line-clamp-2 italic font-medium relative z-10">
                     "{item.queryType === "text" ? item.queryPreview : "Image Verification"}"
                   </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold text-foreground/60 line-clamp-1 border-l-2 border-white/20 pl-2">
                   {item.result.verdict.split('.')[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
