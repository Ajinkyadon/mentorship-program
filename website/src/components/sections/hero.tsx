"use client";

import Link from "next/link";
import { ArrowRight, Star, Users, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: Users, label: "Students Enrolled", value: "2,400+" },
  { icon: Star, label: "Avg Rating", value: "4.9/5" },
  { icon: BookOpen, label: "Hours of Content", value: "500+" },
  { icon: TrendingUp, label: "Placement Rate", value: "87%" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-20 pb-24">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Announcement badge */}
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            New: System Design + AWS Track now live
            <ArrowRight className="h-3.5 w-3.5" />
          </div>

          {/* Headline */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Zero se{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Senior Engineer
              </span>{" "}
              tak
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
              India ke developers ke liye — structured mentorship programs jo real skills, real projects, aur real job opportunities dete hain.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/roadmap">View Roadmap</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="flex -space-x-1.5">
              {["R", "P", "A", "S", "N"].map((initial, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-slate-950"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span>Joined by <strong className="text-slate-300">2,400+ developers</strong> from across India</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl pt-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <Icon className="h-5 w-5 text-blue-400" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 text-center">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
