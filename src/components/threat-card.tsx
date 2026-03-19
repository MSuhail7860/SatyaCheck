"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export interface ThreatCardProps {
  category: string;
  title: string;
  description: string;
  riskLevel: "High" | "Medium" | "Low";
  index?: number;
}

export function ThreatCard({ category, title, description, riskLevel, index = 0 }: ThreatCardProps) {
  let riskColor = "bg-destructive/20 text-destructive border-destructive/20";
  let RiskIcon = ShieldAlert;

  if (riskLevel === "Medium") {
    riskColor = "bg-suspicious/20 text-suspicious border-suspicious/20";
    RiskIcon = AlertTriangle;
  } else if (riskLevel === "Low") {
    riskColor = "bg-truth/20 text-truth border-truth/20";
    RiskIcon = Info;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full bg-white/5 border-white/10 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.07),0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-md cursor-default">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-sm uppercase tracking-wider text-foreground/60">
              {category}
            </span>
            <Badge className={`${riskColor} border px-2.5 py-0.5 flex items-center gap-1 shadow-sm`} variant="secondary">
              <RiskIcon className="w-3.5 h-3.5" />
              {riskLevel} Risk
            </Badge>
          </div>
          <CardTitle className="text-xl leading-tight font-bold tracking-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="text-foreground/70 text-sm leading-relaxed font-medium">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
