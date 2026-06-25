export const palette = {
  black: "#000000",
  cream: "#F5F3EF",
  accent: "#D94E28",
  teal: "#1A6B5D",
  gold: "#E9B44C",
  navy: "#1E293B",
  sage: "#A3B18A",
  burgundy: "#8B1E3F",
  lavender: "#D1D1F7",
  sky: "#5B84B1",
  lime: "#C5D86D",
} as const;

export type TaskFlag = "Ongoing" | "Due" | "Complete";

export const statusStyles: Record<
  TaskFlag,
  { bg: string; text: string; pill: string; pillActive: string }
> = {
  Ongoing: {
    bg: "bg-brand-sky",
    text: "text-white",
    pill: "bg-brand-sky/15 text-brand-sky",
    pillActive: "bg-brand-sky text-white",
  },
  Due: {
    bg: "bg-brand-accent",
    text: "text-white",
    pill: "bg-brand-accent/15 text-brand-accent",
    pillActive: "bg-brand-accent text-white",
  },
  Complete: {
    bg: "bg-brand-teal",
    text: "text-white",
    pill: "bg-brand-teal/15 text-brand-teal",
    pillActive: "bg-brand-teal text-white",
  },
};

export const statCards = [
  { key: "total", label: "total", bg: "bg-brand-navy", text: "text-white" },
  { key: "ongoing", label: "ongoing", bg: "bg-brand-sky", text: "text-white" },
  { key: "due", label: "due", bg: "bg-brand-accent", text: "text-white" },
  { key: "complete", label: "complete", bg: "bg-brand-teal", text: "text-white" },
] as const;

/** Rotating accent colors for decorative cards (auth hero, etc.) */
export const accentCards = [
  { bg: "bg-brand-teal", text: "text-white", title: "stay organized" },
  { bg: "bg-brand-gold", text: "text-brand-black", title: "track progress" },
  { bg: "bg-brand-lavender", text: "text-brand-black", title: "work smarter" },
  { bg: "bg-brand-lime", text: "text-brand-black", title: "get it done" },
] as const;
