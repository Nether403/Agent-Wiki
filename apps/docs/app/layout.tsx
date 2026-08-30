import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Machine-First Design Agent Wiki",
  description:
    "Curated, high-performance UI registry and anti-slop design system platform for autonomous AI coding agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
