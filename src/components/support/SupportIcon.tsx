import {
  Banknote,
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  Handshake,
  HeartHandshake,
  Library,
  Lightbulb,
  Megaphone,
  Presentation,
  Scale,
  Sparkles,
  type LucideProps,
} from "lucide-react";

const icons = {
  Banknote,
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  Handshake,
  HeartHandshake,
  Library,
  Lightbulb,
  Megaphone,
  Presentation,
  Scale,
} as const;

/** Resolves the lucide icon names used in src/content/support.ts */
export function SupportIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;
  return <Icon aria-hidden {...props} />;
}
