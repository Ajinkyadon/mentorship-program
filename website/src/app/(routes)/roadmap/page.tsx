import type { Metadata } from "next";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";

export const metadata: Metadata = {
  title: "Learning Roadmap",
  description:
    "Complete learning roadmap — Beginner to Senior Engineer. Step-by-step structured path for Indian developers.",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300">
            🗺️ Learning Roadmap
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Beginner se Senior tak
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Confusion khatam. Ye structured path follow karo — step by step, phase by phase.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <RoadmapTimeline />
      </div>
    </div>
  );
}
