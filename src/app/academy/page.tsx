import { Flashcard } from "@/components/flashcard";
import { GraduationCap, Zap } from "lucide-react";
import { Quiz } from "@/components/quiz";

export default function Academy() {
  const cards = [
    {
      title: "Fake Urgency",
      example: "Forward this message to 10 people or your bank account will be permanently blocked in 24 hours.",
      lesson: "Urgency is a common manipulation tactic. Scammers want you to panic and act quickly without taking the time to verify the facts."
    },
    {
      title: "Fake Health Claims",
      example: "Drink raw turmeric water mixed with garlic to cure Dengue virus instantly. A doctor from WHO verified this.",
      lesson: "Medical claims require scientific evidence. Anecdotal 'miracle cures' that attack severe diseases without proper medical care are extremely dangerous."
    },
    {
      title: "Authority Manipulation",
      example: "RBI Official Notice – Click this link now to complete your mandatory e-KYC or face penalties.",
      lesson: "Scammers frequently impersonate trusted authorities like the RBI, SBI, or government officials to steal login credentials via phishing links."
    },
    {
      title: "Emotional Manipulation",
      example: "Look at what they are doing to our people! Share this video to spread awareness before it's deleted!",
      lesson: "Content that makes you feel intense anger, fear, or sadness is often engineered to bypass your critical thinking and force a viral share."
    },
    {
      title: "Phishing Links",
      example: "Congratulations! You have won a free iPhone 15. Claim it here: http://apple-rewardz.free-win.com",
      lesson: "Always check the URL carefully. Scammers use slightly misspelled domains or free hosting sites to trick you into entering personal details."
    },
    {
      title: "Out of Context Videos",
      example: "Video of a recent train derailment in India (Video is actually from another country 5 years ago)",
      lesson: "Old footage is frequently recirculated during completely different modern events to frame a false narrative or spark outrage."
    },
    {
      title: "The 'Secret Knowledge' Angle",
      example: "The mainstream media won't show you this, but here is the truth behind the new digital currency...",
      lesson: "Conspiracy theorists hook victims by pretending to offer 'secret, suppressed' knowledge, making the recipient feel special and part of an inner circle."
    },
    {
      title: "Job Fraud (Task Scams)",
      example: "Earn ₹5000 daily working from home! Just click this link to register and pay a ₹500 refundable deposit.",
      lesson: "Legitimate employers never ask you to pay them for the privilege of working. Upfront 'deposits' or 'processing fees' are definite scams."
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-7xl relative">

      {/* Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-truth/10 rounded-full mb-6">
          <GraduationCap className="w-10 h-10 text-truth" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
          Spot the Fake Academy
        </h1>
        <p className="text-lg text-foreground/60 font-medium leading-relaxed">
          Learn the most common manipulation techniques used by scammers and bad actors to spread misinformation in India.{" "}
          <span className="block mt-2 font-bold text-foreground/80">Click the cards to reveal the lesson.</span>
        </p>
      </div>

      {/* Flashcard Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mx-auto pb-20">
        {cards.map((card, idx) => (
          <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <Flashcard {...card} />
          </div>
        ))}
      </div>

      {/* Quiz Section */}
      <div className="max-w-2xl mx-auto pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-suspicious/10 rounded-full mb-4">
            <Zap className="w-8 h-8 text-suspicious" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Test Your Knowledge
          </h2>
          <p className="text-foreground/60 font-medium">
            5 real-world scenarios. Can you identify the manipulation tactic?
          </p>
        </div>
        <Quiz />
      </div>

    </div>
  );
}
