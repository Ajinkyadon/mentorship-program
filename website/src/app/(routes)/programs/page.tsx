import type { Metadata } from "next";
import { programs } from "@/lib/content";
import { ProgramsGrid } from "@/components/sections/programs-grid";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Structured mentorship programs for every stage — freshers, 2–4 year developers, career switchers, and senior aspirants.",
};

const tracks = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export default function ProgramsPage() {
  const stats = {
    total: programs.length,
    beginner: programs.filter((p) => p.level === "beginner").length,
    intermediate: programs.filter((p) => p.level === "intermediate").length,
    advanced: programs.filter((p) => p.level === "advanced").length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
              🎯 All Programs
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Apna track choose karo
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Chahe fresher ho, mid-level developer ho, ya career switch karna chahte ho — yahan har kisi ke liye structured path hai.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-slate-500">Total Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.beginner}</div>
                <div className="text-xs text-slate-500">Beginner</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{stats.intermediate}</div>
                <div className="text-xs text-slate-500">Intermediate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.advanced}</div>
                <div className="text-xs text-slate-500">Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <ProgramsGrid />
      </div>
    </div>
  );
}
