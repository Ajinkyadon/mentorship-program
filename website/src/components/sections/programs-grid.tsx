import Link from "next/link";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { programs } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const levelColor = {
  beginner: "success" as const,
  intermediate: "warning" as const,
  advanced: "default" as const,
};

const levelLabel = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function ProgramsGrid({ featured = false }: { featured?: boolean }) {
  const list = featured ? programs.filter((p) => p.featured) : programs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {list.map((program) => (
        <Link key={program.slug} href={`/programs/${program.slug}`} className="group">
          <Card hover className="h-full">
            <CardContent className="p-6 flex flex-col h-full gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center text-xl",
                      `bg-gradient-to-br ${program.color} bg-opacity-10`
                    )}
                  >
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {program.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs text-slate-500">{program.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={levelColor[program.level]}>
                  {levelLabel[program.level]}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                {program.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {program.skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-400 border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
                {program.skills.length > 5 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-500">
                    +{program.skills.length - 5} more
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300 transition-colors font-medium">
                View Program
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
