import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./lib/ThemeProvider";
import { sans, serif } from "./ui/fonts";

export const metadata: Metadata = {
  title: "TaskFlow — To-Do App",
  description: "Organize your life, one task at a time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
