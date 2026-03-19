"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustScore } from "./trust-score";
import { SourceLink } from "./source-link";
import { ChartWrapper } from "./chart-wrapper";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  Share2,
  Copy,
  CheckCheck,
  Flame,
  Globe,
  Tag,
} from "lucide-react";

export interface AnalysisResult {
  trustScore: number;
  riskCategory?: string;
  language?: string;
  viralRisk?: number;
  metrics?: {
    logicalConsistency: number;
    sourceCredibility: number;
    factualAccuracy: number;
    emotionalManipulation: number;
  };
  techniques: string[];
  verdict: string;
  explanation?: string;
  sources?: { title: string; link: string }[];
}

const RISK_CATEGORY_COLORS: Record<string, string> = {
  "Financial Scam": "bg-red-500/15 text-red-400 border-red-500/25",
  "Health Misinformation": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Political Manipulation": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Job Fraud": "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  "Cyber Crime": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "General": "bg-blue-500/15 text-blue-400 border-blue-500/25",
};

function ViralRiskBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-destructive" : score >= 40 ? "bg-suspicious" : "bg-truth";
  const label = score >= 70 ? "High Viral Risk" : score >= 40 ? "Medium Viral Risk" : "Low Viral Risk";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-foreground/70">
          <Flame className="w-3 h-3" />
          {label}
        </span>
        <span className="text-foreground/90">{score}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
        <motion.div
          className={`h-full rounded-full ${color} shadow-[0_0_8px_currentColor]`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ShareButton({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  const buildReport = () =>
    `SatyaCheck Analysis Report\n` +
    `══════════════════════════\n` +
    `Trust Score: ${result.trustScore}/100\n` +
    (result.riskCategory ? `Category: ${result.riskCategory}\n` : "") +
    (result.language ? `Language: ${result.language}\n` : "") +
    `\nVerdict:\n${result.verdict}\n` +
    (result.explanation ? `\nExplanation:\n${result.explanation}\n` : "") +
    (result.techniques.length ? `\nTechniques Detected:\n${result.techniques.map((t) => `• ${t}`).join("\n")}\n` : "") +
    `\nVerified by SatyaCheck — satya-check.vercel.app`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = buildReport();
    if (navigator.share) {
      await navigator.share({ title: "SatyaCheck Analysis", text });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-2 pt-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground gap-1.5 text-xs"
      >
        {copied ? <CheckCheck className="w-3.5 h-3.5 text-truth" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Report"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleShare}
        className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground gap-1.5 text-xs"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </Button>
    </div>
  );
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const radarData = result.metrics
    ? [
        { subject: "Logic", score: result.metrics.logicalConsistency },
        { subject: "Source", score: result.metrics.sourceCredibility },
        { subject: "Accuracy", score: result.metrics.factualAccuracy },
        { subject: "Non-Manip.", score: 100 - result.metrics.emotionalManipulation },
      ]
    : [];

  const riskColorClass =
    result.riskCategory && RISK_CATEGORY_COLORS[result.riskCategory]
      ? RISK_CATEGORY_COLORS[result.riskCategory]
      : "bg-blue-500/15 text-blue-400 border-blue-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="mt-8 w-full"
    >
      <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10 bg-black/40 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xl font-bold">Analysis Result</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {result.riskCategory && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${riskColorClass}`}>
                  <Tag className="w-3 h-3" />
                  {result.riskCategory}
                </span>
              )}
              {result.language && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-foreground/60 text-xs font-semibold">
                  <Globe className="w-3 h-3" />
                  {result.language}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 pt-6 bg-black/20">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-2">

            {/* Left Col: Score */}
            <div className="flex-shrink-0">
              <TrustScore score={result.trustScore} />
            </div>

            {/* Right Col: Details */}
            <div className="flex-1 space-y-6 w-full">

              {/* Verdict */}
              <div>
                <h3 className="mb-2 font-semibold text-lg text-foreground/90">Verdict</h3>
                <p className="text-foreground/80 leading-relaxed font-medium">{result.verdict}</p>
                <ShareButton result={result} />
              </div>

              {/* Radar Chart — Analytical Breakdown */}
              {result.metrics && (
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <h3 className="font-semibold text-xs uppercase tracking-widest text-truth/80 mb-2">Analytical Breakdown</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Radar */}
                    <div className="w-full sm:w-52 h-44 shrink-0">
                      <ChartWrapper>
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <RadarChart data={radarData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700 }}
                            />
                            <Radar
                              name="Score"
                              dataKey="score"
                              stroke="#14b8a6"
                              fill="#14b8a6"
                              fillOpacity={0.18}
                              strokeWidth={2}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </ChartWrapper>
                    </div>
                    {/* Legend bars */}
                    <div className="flex-1 w-full space-y-3">
                      {[
                        { label: "Logical Consistency", score: result.metrics.logicalConsistency, inverted: false },
                        { label: "Source Credibility", score: result.metrics.sourceCredibility, inverted: false },
                        { label: "Factual Accuracy", score: result.metrics.factualAccuracy, inverted: false },
                        { label: "Emot. Manipulation", score: result.metrics.emotionalManipulation, inverted: true },
                      ].map(({ label, score, inverted }) => {
                        const isGood = inverted ? score < 40 : score > 60;
                        const isAvg = score >= 40 && score <= 60;
                        const barColor = isGood
                          ? "bg-truth shadow-[0_0_6px_rgba(20,184,166,0.5)]"
                          : isAvg
                          ? "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]"
                          : "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.5)]";
                        return (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-foreground/60">{label}</span>
                              <span className="text-foreground/80">{score}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                              <motion.div
                                className={`h-full rounded-full ${barColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Viral Risk */}
              {result.viralRisk !== undefined && (
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <ViralRiskBar score={result.viralRisk} />
                </div>
              )}

              {/* Step-by-step Explanation */}
              {result.explanation && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <h3 className="mb-2 font-semibold text-sm uppercase tracking-wider text-foreground/60">Explanation</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">{result.explanation}</p>
                </div>
              )}

              {/* Techniques */}
              {result.techniques.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-sm uppercase tracking-wider text-foreground/60">Detected Manipulation Techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.techniques.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/30 px-3 py-1"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Credible Sources */}
              {result.sources && result.sources.length > 0 && (
                <div className="pt-2">
                  <h3 className="mb-3 font-semibold text-sm uppercase tracking-wider text-foreground/60">Credible Sources</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.sources.map((source, i) => (
                      <SourceLink key={i} title={source.title} link={source.link} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
