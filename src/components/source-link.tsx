import { ExternalLink, ShieldCheck, Building2, HeartPulse, Globe } from "lucide-react";
import Link from "next/link";

interface SourceLinkProps {
  title: string;
  link: string;
}

type BadgeType = "fact-checker" | "government" | "health" | "other";

function getBadgeInfo(title: string): { type: BadgeType; label: string } {
  const lower = title.toLowerCase();
  if (lower.includes("altnews") || lower.includes("boom") || lower.includes("fact check") || lower.includes("factcheck") || lower.includes("vishvas") || lower.includes("quint")) {
    return { type: "fact-checker", label: "Fact-Checker" };
  }
  if (lower.includes("pib") || lower.includes("government") || lower.includes("govt") || lower.includes("ministry") || lower.includes("myneta") || lower.includes("india.gov")) {
    return { type: "government", label: "Government" };
  }
  if (lower.includes("who") || lower.includes("health") || lower.includes("icmr") || lower.includes("aiims") || lower.includes("medical")) {
    return { type: "health", label: "Health Authority" };
  }
  return { type: "other", label: "Source" };
}

const badgeStyles: Record<BadgeType, { bar: string; icon: string; bg: string }> = {
  "fact-checker": {
    bar: "bg-truth/20 border-truth/30",
    icon: "text-truth",
    bg: "bg-truth/10",
  },
  "government": {
    bar: "bg-blue-500/20 border-blue-500/30",
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  "health": {
    bar: "bg-rose-500/20 border-rose-500/30",
    icon: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  "other": {
    bar: "bg-white/10 border-white/15",
    icon: "text-foreground/50",
    bg: "bg-white/5",
  },
};

const BadgeIcon: Record<BadgeType, React.FC<{ className?: string }>> = {
  "fact-checker": ShieldCheck,
  "government": Building2,
  "health": HeartPulse,
  "other": Globe,
};

export function SourceLink({ title, link }: SourceLinkProps) {
  const { type, label } = getBadgeInfo(title);
  const styles = badgeStyles[type];
  const Icon = BadgeIcon[type];

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between p-3 rounded-lg border ${styles.bar} ${styles.bg} hover:brightness-125 transition-all duration-200`}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className={`flex-shrink-0 p-1.5 rounded-md bg-black/30 ${styles.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="overflow-hidden min-w-0">
          <span className="block font-semibold text-sm truncate text-foreground/90 group-hover:text-white transition-colors">
            {title}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.icon} opacity-80`}>
            {label}
          </span>
        </div>
      </div>
      <ExternalLink className={`w-4 h-4 flex-shrink-0 ml-4 ${styles.icon} opacity-60 group-hover:opacity-100 transition-opacity`} />
    </Link>
  );
}
