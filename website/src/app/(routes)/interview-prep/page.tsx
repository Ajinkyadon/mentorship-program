import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Interview Preparation",
  description:
    "Complete interview prep — DSA, JavaScript, Node.js, System Design, HR. Crack product company interviews at 15–40 LPA.",
};

const tracks = [
  {
    icon: "🧮",
    title: "DSA Roadmap",
    badge: "8 Weeks",
    badgeVariant: "success" as const,
    description: "Working professionals ke liye optimized DSA plan. Arrays → Trees → DP — pattern-based approach.",
    topics: ["Arrays & Strings", "HashMap & Sets", "Stack & Queue", "Binary Search", "Trees", "Graphs", "Dynamic Programming"],
    href: "/interview-prep/dsa",
  },
  {
    icon: "🟡",
    title: "JavaScript Deep Dive",
    badge: "2 Weeks",
    badgeVariant: "warning" as const,
    description: "Closures, event loop, prototypes, async — senior-level JS questions jo product companies poochti hain.",
    topics: ["Closures & Scope", "Event Loop", "Prototype Chain", "this Keyword", "Promises & Async", "ES6+ Features"],
    href: "/interview-prep/javascript",
  },
  {
    icon: "⚙️",
    title: "Node.js Internals",
    badge: "1 Week",
    badgeVariant: "default" as const,
    description: "Event loop phases, worker threads, streams, memory management — Node.js interview questions.",
    topics: ["Event Loop Phases", "Worker Threads", "Streams & Buffers", "Memory Leaks", "Cluster Module", "Performance"],
    href: "/interview-prep/nodejs",
  },
  {
    icon: "🏗️",
    title: "System Design",
    badge: "4 Weeks",
    badgeVariant: "default" as const,
    description: "URL shortener, chat app, notification system, rate limiter — structured design framework.",
    topics: ["Design Framework", "URL Shortener", "Chat Application", "Notification System", "Rate Limiter", "E-commerce Backend"],
    href: "/interview-prep/system-design",
  },
  {
    icon: "🗄️",
    title: "CS Fundamentals",
    badge: "2 Weeks",
    badgeVariant: "secondary" as const,
    description: "OS, DBMS, Computer Networks, OOPs — ye sab service + product companies dono mein pooche jaate hain.",
    topics: ["Operating Systems", "DBMS & SQL", "Computer Networks", "OOP Concepts", "Normalization", "TCP/UDP"],
    href: "/interview-prep/cs-fundamentals",
  },
  {
    icon: "🤝",
    title: "HR & Behavioral",
    badge: "1 Week",
    badgeVariant: "secondary" as const,
    description: "STAR framework, common HR questions, salary negotiation, cultural fit rounds.",
    topics: ["STAR Framework", "Tell Me About Yourself", "Strength & Weakness", "Salary Negotiation", "Why Switch?", "Where in 5 Years?"],
    href: "/interview-prep/behavioral",
  },
];

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-300">
              🎯 Interview Preparation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Product company interviews crack karo
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              DSA, System Design, JavaScript, Behavioral — complete preparation for 15–40 LPA roles.
            </p>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Link key={track.title} href={track.href} className="group">
              <Card hover className="h-full">
                <CardContent className="p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{track.icon}</div>
                    <Badge variant={track.badgeVariant}>{track.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{track.description}</p>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {track.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/60 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300 font-medium">
                    Start Preparing <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Tips banner */}
        <div className="mt-16 p-6 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-800/30">
          <h2 className="text-xl font-bold text-white mb-4">Interview Tips — Senior Engineers Se</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { tip: "Think out loud — interviewer process dekhna chahta hai", icon: "💭" },
              { tip: "Brute force pehle acknowledge karo, phir optimize", icon: "🔄" },
              { tip: "Edge cases mention karo before coding", icon: "⚠️" },
              { tip: "System design mein numbers se estimate karo", icon: "📊" },
            ].map(({ tip, icon }) => (
              <div key={tip} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
