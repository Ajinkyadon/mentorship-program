import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://codebharat.dev"),
  title: {
    default: "CodeBharat — Zero se Senior Engineer tak",
    template: "%s | CodeBharat",
  },
  description:
    "India ke developers ke liye structured mentorship programs. Freshers se leke 2–4 year professionals tak — real skills, real projects, real jobs.",
  keywords: [
    "Node.js mentorship",
    "backend engineering India",
    "software developer course",
    "system design preparation",
    "coding bootcamp India",
    "fresher developer roadmap",
    "product company preparation",
  ],
  authors: [{ name: "CodeBharat" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://codebharat.dev",
    siteName: "CodeBharat",
    title: "CodeBharat — Zero se Senior Engineer tak",
    description:
      "Structured mentorship for Indian developers. Backend, Node.js, System Design, AWS, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeBharat — Zero se Senior Engineer tak",
    description: "Structured mentorship for Indian developers.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
