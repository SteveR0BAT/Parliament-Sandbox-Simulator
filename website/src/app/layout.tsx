import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stever0bat.github.io/Parliament-Sandbox-Simulator/"),
  title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
  description: "Build a custom parliament with parties, factions, coalitions, independents and 100+ ideologies. Simulate legislative votes for free in your browser.",
  applicationName: "Parliament Sandbox Simulator",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Parliament Sandbox Simulator",
    title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
    description: "Build a custom parliament with parties, factions, coalitions, independents and 100+ ideologies. Simulate legislative votes for free in your browser.",
  },
  twitter: {
    card: "summary",
    title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
    description: "Build a custom parliament, create political factions and coalitions, and simulate legislative votes for free in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `try{var t=localStorage.getItem('parl:theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
