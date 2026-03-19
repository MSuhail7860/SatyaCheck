"use client";

import { ThreatCard } from "@/components/threat-card";
import { useState } from "react";
import { ChartWrapper } from "@/components/chart-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const allThreats = [
  {
    category: "Financial Scam",
    title: "RBI KYC PAN Card Update",
    description: "A WhatsApp message urging users to click a link to update their PAN/KYC details to stop their bank account from being blocked. The link leads to a phishing site stealing banking credentials.",
    riskLevel: "High" as const,
  },
  {
    category: "Financial Scam",
    title: "Free ₹5000 Govt Subsidy",
    description: "Viral SMS claiming the government is giving out free ₹5000 as part of a new welfare scheme. It asks users to pay a small 'processing fee' first.",
    riskLevel: "High" as const,
  },
  {
    category: "Public Health",
    title: "Turmeric Cures Dengue",
    description: "A widely forwarded message claiming that drinking raw turmeric mixed with hot water cures Dengue fever in 24 hours, causing patients to avoid professional medical treatment.",
    riskLevel: "Medium" as const,
  },
  {
    category: "Public Health",
    title: "5G Tower Radiation Virus",
    description: "Conspiracy theory posts claiming that new unknown viruses are being spread by 5G testing towers across major Indian cities.",
    riskLevel: "Low" as const,
  },
  {
    category: "Social Unrest",
    title: "Edited Political Speech",
    description: "A doctored video of a prominent politician making inflammatory remarks about a specific community, intended to intentionally spark communal tension ahead of elections.",
    riskLevel: "High" as const,
  },
  {
    category: "Job Scam",
    title: "Part-time Amazon Job via WhatsApp",
    description: "Messages offering ₹3000/day for 'liking YouTube videos' or 'submitting fake reviews'. Users are eventually asked to invest their own money to unlock their 'earnings'.",
    riskLevel: "High" as const,
  }
];

const categories = ["All", "Financial Scam", "Public Health", "Social Unrest", "Job Scam"];

const trendData = [
  { day: "Mon", volume: 2200 },
  { day: "Tue", volume: 3100 },
  { day: "Wed", volume: 2800 },
  { day: "Thu", volume: 4200 },
  { day: "Fri", volume: 5100 },
  { day: "Sat", volume: 6800 },
  { day: "Sun", volume: 8400 },
];

const tacticData = [
  { name: "Financial Promise", value: 45, color: "#ef4444" },
  { name: "Health Miracle", value: 25, color: "#f59e0b" },
  { name: "Political Rumor", value: 20, color: "#14b8a6" },
  { name: "Job Scam", value: 10, color: "#3b82f6" },
];

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredThreats = activeCategory === "All"
    ? allThreats
    : allThreats.filter(t => t.category === activeCategory);

  return (
    <div>
      {/* Live Threat Ticker */}
      <div className="w-full bg-destructive/10 border-y border-destructive/20 py-2 overflow-hidden">
        <div className="flex items-center">
          <div className="shrink-0 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 mr-4 rounded-r-full">
            🔴 LIVE
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex animate-ticker whitespace-nowrap">
              {[...allThreats, ...allThreats].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 mr-10 text-xs font-semibold text-foreground/70">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                    t.riskLevel === "High" ? "bg-destructive" : t.riskLevel === "Medium" ? "bg-suspicious" : "bg-truth"
                  }`} />
                  {t.title}
                  <span className="text-foreground/30">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">

        {/* Header & Stats */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Trending Threats Dashboard
          </h1>
          <p className="text-lg text-foreground/60 max-w-3xl font-medium mb-8">
            Stay informed about the most common misinformation campaigns and scams currently spreading across India via WhatsApp, social media, and SMS.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider">High Risk Active</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-truth/10 text-truth rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider">Weekly Scams Detected</p>
                <p className="text-2xl font-bold">12,400+</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider">Est. Users Targeted</p>
                <p className="text-2xl font-bold">2.5M+</p>
              </div>
            </div>
          </div>

          {/* Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-6 h-80 flex flex-col shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-foreground/90">Misinformation Volume (Last 7 Days)</h3>
              <div className="flex-1 w-full min-h-[250px]">
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScams" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#14b8a6', fontWeight: 'bold' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                      />
                      <Area type="monotone" dataKey="volume" stroke="#14b8a6" name="Threats detected" strokeWidth={3} fillOpacity={1} fill="url(#colorScams)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>
            </div>

            <div className="bg-gradient-to-bl from-white/5 to-transparent border border-white/10 rounded-xl p-6 h-80 flex flex-col items-center shadow-lg">
              <h3 className="text-lg font-bold mb-2 text-foreground/90 w-full text-left">Top Manipulation Tactics</h3>
              <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={tacticData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {tacticData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>
              <div className="w-full flex justify-center gap-x-4 gap-y-2 flex-wrap mt-2">
                {tacticData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-truth text-black shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                    : "bg-white/5 text-foreground/60 border border-white/10 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Threat Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredThreats.map((threat, idx) => (
              <motion.div
                key={threat.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ThreatCard {...threat} index={idx} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredThreats.length === 0 && (
          <div className="text-center py-20 text-foreground/40 font-medium">
            No active threats reported in this category currently.
          </div>
        )}

      </div>
    </div>
  );
}
