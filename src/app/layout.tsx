import type { Metadata } from "next";
import { Nunito, Caveat } from "next/font/google";
import { getSite } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "cyrillic"], variable: "--font-nunito" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], variable: "--font-caveat" });

export async function generateMetadata(): Promise<Metadata> {
  const { org, school } = await getSite();
  const title = school ? school.name : `${org.name} — Ерөнхий боловсролын сургуулиуд`;
  return {
    title: { default: title, template: `%s | ${school ? school.shortName : org.name}` },
    description: school ? school.tagline || school.about.slice(0, 160) : org.heroText,
    openGraph: { title, images: ["/img/hero.webp"] },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${nunito.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
