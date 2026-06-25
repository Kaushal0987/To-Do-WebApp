import { DM_Sans, Instrument_Serif } from "next/font/google";

export const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
