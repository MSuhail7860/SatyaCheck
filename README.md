<div align="center">

<br />

<img src="https://img.shields.io/badge/SatyaCheck-AI%20Fact%20Checker-14b8a6?style=for-the-badge&logo=shieldcheck&logoColor=white" alt="SatyaCheck" height="40" />

<br /><br />

**SatyaCheck** is a production-grade, full-stack AI misinformation detection platform built for India.  
Verify suspicious WhatsApp forwards, SMS scams, URLs, and manipulated images — instantly.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0080?style=flat-square&logo=framer)](https://framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

![SatyaCheck Hero](https://raw.githubusercontent.com/yourusername/satya-check/main/public/og-preview.png)

</div>

---

## ✨ Features

### 🔍 Multi-Modal Verification Engine
| Mode | Description |
|------|-------------|
| **Text / SMS** | Paste any WhatsApp forward, SMS, news headline, or social media post |
| **URL / Link** | Enter a URL — get a rich OG preview (favicon, title, description) before analyzing |
| **Image** | Upload or drag-and-drop screenshots with deepfake and manipulation detection |

### 🧠 AI-Powered Analysis (Gemini 2.5 Flash)
Every analysis returns a structured, schema-enforced JSON payload:

- **Trust Score** — 0–100 authenticity gauge with animated arc indicator  
- **Risk Category** — Classified into Financial Scam · Health Misinformation · Political Manipulation · Job Fraud · Cyber Crime · General  
- **Language Detection** — Identifies English, Hindi, Tamil, Telugu, Marathi, Bengali and more  
- **Viral Risk Score** — Estimates how likely the content is to spread at scale  
- **Analytical Breakdown** — Radar chart across 4 dimensions: Logical Consistency, Source Credibility, Factual Accuracy, Emotional Manipulation  
- **Detected Manipulation Techniques** — e.g. Fake Urgency, Phishing, False Authority  
- **Detailed Explanation** — Step-by-step reasoning from the model  
- **Credible Source Links** — AltNews, BOOM FactCheck, PIB Fact Check, WHO, and more

### 📊 Trending Threats Dashboard
- **Live Threat Ticker** — Auto-scrolling marquee of active threats with risk-level indicators, pauses on hover  
- **Misinformation Volume Chart** — 7-day area chart (Recharts)  
- **Top Manipulation Tactics** — Donut/pie chart breakdown  
- **Filterable Threat Cards** — Filter by category: Financial Scam, Public Health, Social Unrest, Job Scam

### 🎓 Spot the Fake Academy
- **8 Interactive Flashcards** — Flip to reveal the lesson behind each manipulation tactic  
- **5-Question Knowledge Quiz** — Real-world scenarios with instant animated feedback, explanations, and a final score screen

### 🎨 Premium UI/UX
- **Particle Canvas Hero** — 45-node animated teal network in the hero section (vanilla canvas, zero deps)  
- **Animated Stat Counters** — Numbers count up from 0 on scroll using `framer-motion` `useInView`  
- **Shockwave Button Animation** — Expanding ring effect on "Verify Now" click  
- **Share / Copy Report** — Copy analysis as formatted plain text or use native Web Share API  
- **Navbar Scan Counter** — Live badge showing total verifications run (from localStorage)  
- **Terminal Loader** — Simulated step-by-step AI kernel readout during analysis  
- Glassmorphism cards · Dark mode · Responsive layout · CSS micro-animations throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript 5 |
| AI | Google Gemini 2.5 Flash via `@google/generative-ai` |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion 12 |
| Charts | Recharts 3 (RadarChart, AreaChart, PieChart) |
| State | React 19 hooks + localStorage |
| Deployment | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A [Google AI Studio](https://aistudio.google.com) API key with Gemini 2.5 Flash access

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/satya-check.git
cd satya-check

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
satya-check/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home — hero + verification engine
│   │   ├── dashboard/page.tsx          # Trending threats + charts
│   │   ├── academy/page.tsx            # Flashcards + knowledge quiz
│   │   ├── globals.css                 # Design tokens + animations
│   │   └── api/
│   │       ├── analyze/route.ts        # Text/URL analysis (Gemini)
│   │       ├── image-analyze/route.ts  # Image forensics (Gemini Vision)
│   │       └── url-preview/route.ts    # OG metadata scraper
│   ├── components/
│   │   ├── verification-engine.tsx     # 3-tab input (text · url · image)
│   │   ├── result-card.tsx             # Radar chart + viral risk + share
│   │   ├── trust-score.tsx             # Animated circular gauge
│   │   ├── terminal-loader.tsx         # Fake AI kernel terminal
│   │   ├── particle-canvas.tsx         # Canvas particle background
│   │   ├── animated-stats.tsx          # Counted-up stat pills
│   │   ├── quiz.tsx                    # 5-question interactive quiz
│   │   ├── threat-card.tsx             # Dashboard threat card
│   │   ├── flashcard.tsx               # Flip flashcard (academy)
│   │   ├── source-link.tsx             # Credible source link chip
│   │   ├── navbar.tsx                  # Sticky nav + scan counter
│   │   └── recent-scans.tsx            # localStorage history list
│   ├── hooks/
│   │   └── use-history.ts              # Analysis history (localStorage)
│   └── lib/
│       └── gemini.ts                   # Gemini client singleton
```

---

## 🔌 API Reference

### `POST /api/analyze`
Analyze text or a URL for misinformation.

**Request**
```json
{ "message": "Your KYC is expired. Click here to update: http://fake-link.com" }
```

**Response**
```json
{
  "trustScore": 4,
  "riskCategory": "Financial Scam",
  "language": "English",
  "viralRisk": 88,
  "metrics": {
    "logicalConsistency": 12,
    "sourceCredibility": 5,
    "factualAccuracy": 8,
    "emotionalManipulation": 91
  },
  "techniques": ["Fake Urgency", "Phishing Link", "Authority Impersonation"],
  "verdict": "This is a classic KYC phishing scam...",
  "explanation": "...",
  "sources": [
    { "title": "PIB Fact Check", "link": "https://pib.gov.in/factcheck" }
  ]
}
```

---

### `POST /api/image-analyze`
Analyze an image for deepfakes, Photoshop artifacts, misleading captions, viral meme formats, and AI-generated content.

**Request**
```json
{ "imageBase64": "<base64_string>", "mimeType": "image/jpeg" }
```
Response schema is identical to `/api/analyze`.

---

### `POST /api/url-preview`
Fetch OG metadata for a URL (used by the URL tab preview card).

**Request**
```json
{ "url": "https://example.com/article" }
```

**Response**
```json
{
  "title": "Article Title",
  "description": "Meta description...",
  "image": "https://example.com/og.jpg",
  "hostname": "example.com",
  "favicon": "https://www.google.com/s2/favicons?domain=example.com&sz=64",
  "siteName": "Example",
  "url": "https://example.com/article"
}
```

---

## 📋 Changelog

### v2.0 — Advanced Edition
> Released March 2026

#### New Features
- **URL Analysis Tab** — OG metadata preview card before analysis
- **Radar Chart** — Replaces flat metric bars in the result card with an interactive spider chart
- **Viral Risk Score** — New AI-derived metric estimating content spread potential
- **Risk Category Badge** — Color-coded threat classification on every result
- **Language Detection** — Identifies the language of each submission
- **Share / Copy Report** — One-click plain-text export and native Web Share API
- **Particle Canvas Background** — Animated teal node network in the hero section
- **Animated Stat Counters** — scroll-triggered count-up animations on homepage stats
- **🔴 Live Threat Ticker** — Scrolling marquee of active threats on the dashboard
- **Knowledge Quiz** — 5-question interactive quiz on the Academy page
- **Navbar Scan Counter** — Live badge counting verifications run this session
- **Shockwave Button** — Framer Motion ring animation on verify click

#### Improvements
- `/api/analyze` and `/api/image-analyze` both enriched with `riskCategory`, `language`, `viralRisk` fields
- VerificationEngine refactored into 3-tab architecture (Text · URL · Image)
- ResultCard layout fully redesigned for richer data presentation

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set `GEMINI_API_KEY` as an [Environment Variable](https://vercel.com/docs/environment-variables) in your Vercel project dashboard.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
# Fork → Clone → Create branch
git checkout -b feature/your-feature

# Make changes, then
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

---

## ⚖️ License

[MIT](LICENSE) © 2026 SatyaCheck

---

<div align="center">

Built with ❤️ for a more informed India. Powered by [Google Gemini](https://ai.google.dev).

</div>
