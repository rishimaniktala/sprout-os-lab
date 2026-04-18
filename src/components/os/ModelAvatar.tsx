import { cn } from "@/lib/utils";

const accentMap: Record<string, { bg: string; ring: string; text: string }> = {
  electric: { bg: "bg-electric/15",   ring: "ring-electric/40",   text: "text-electric" },
  violet:   { bg: "bg-violet/15",     ring: "ring-violet/40",     text: "text-violet" },
  emerald:  { bg: "bg-success/15",    ring: "ring-success/40",    text: "text-success" },
  amber:    { bg: "bg-warning/15",    ring: "ring-warning/40",    text: "text-warning" },
  sky:      { bg: "bg-info/15",       ring: "ring-info/40",       text: "text-info" },
  rose:     { bg: "bg-destructive/15",ring: "ring-destructive/40",text: "text-destructive" },
};

const initials: Record<string, string> = {
  "ChatGPT-5": "G5",
  "Gemini": "Ge",
  "Claude": "Cl",
  "Llama": "Ll",
  "Perplexity": "Px",
  "Cursor Agent": "Cs",
};

export function ModelAvatar({
  name,
  accent = "electric",
  size = "md",
  className,
}: {
  name: string;
  accent?: keyof typeof accentMap;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const c = accentMap[accent] ?? accentMap.electric;
  const dim = size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-md font-semibold ring-1 mono",
        dim, c.bg, c.ring, c.text, className,
      )}
      title={name}
    >
      {initials[name] ?? name.slice(0, 2)}
    </span>
  );
}

export function modelAccent(name: string): keyof typeof accentMap {
  switch (name) {
    case "ChatGPT-5": return "emerald";
    case "Gemini": return "sky";
    case "Claude": return "violet";
    case "Llama": return "amber";
    case "Perplexity": return "rose";
    case "Cursor Agent": return "electric";
    default: return "electric";
  }
}
