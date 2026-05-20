import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, ArrowRight, Code2, BookOpen } from "lucide-react";
import { programs } from "@/lib/content";
import { fetchMarkdown, PROGRAM_PATHS } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  return {
    title: program.title,
    description: program.description,
  };
}

const levelColor = {
  beginner: "success" as const,
  intermediate: "warning" as const,
  advanced: "default" as const,
};

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const folder = PROGRAM_PATHS[slug];
  const readmeContent = folder ? await fetchMarkdown(`${folder}/README.md`) : null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Programs
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Hero */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-14 w-14 rounded-xl flex items-center justify-center text-2xl",
                    `bg-gradient-to-br ${program.color} opacity-80`
                  )}
                >
                  {program.icon}
                </div>
                <div>
                  <Badge variant={levelColor[program.level]} className="mb-1">
                    {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                  </Badge>
                  <h1 className="text-3xl font-bold text-white">{program.title}</h1>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">{program.description}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Skills Covered</h2>
              <div className="flex flex-wrap gap-2">
                {program.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm border border-slate-700 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">What You&apos;ll Achieve</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3 p-4 rounded-lg bg-slate-900 border border-slate-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Content */}
            {readmeContent && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Program Content</h2>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    From GitHub
                  </span>
                </div>
                <div className="prose-dark bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <MarkdownRenderer content={readmeContent} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-400" />
                      {program.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Level</span>
                    <Badge variant={levelColor[program.level]}>
                      {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Skills</span>
                    <span className="text-white font-medium">{program.skills.length} topics</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-5 space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/community">
                      Join Community
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://github.com/Ajinkyadon/mentorship-program/tree/main/${folder || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code2 className="h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-slate-600 text-center">
                  Free forever · Open source content
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
