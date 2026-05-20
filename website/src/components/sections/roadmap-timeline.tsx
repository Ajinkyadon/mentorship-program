"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    duration: "Weeks 1–4",
    level: "Beginner",
    color: "from-emerald-500 to-teal-500",
    dot: "bg-emerald-500",
    description: "Programming mindset aur fundamentals — zero se shuru.",
    topics: [
      "How the internet works (DNS, HTTP, TCP/IP)",
      "Terminal & Git basics",
      "JavaScript fundamentals (variables, functions, arrays, objects)",
      "ES6+ features (destructuring, spread, arrow functions)",
      "Async JavaScript — callbacks → Promises → async/await",
      "Event loop — microtasks vs macrotasks",
      "Node.js basics — modules, built-ins, npm",
    ],
    project: "CLI To-Do App + fetch data from a public API",
  },
  {
    phase: "Phase 2",
    title: "Web Development",
    duration: "Weeks 5–8",
    level: "Beginner–Intermediate",
    color: "from-blue-500 to-indigo-500",
    dot: "bg-blue-500",
    description: "Frontend basics + backend APIs — full picture build karo.",
    topics: [
      "HTML semantics + CSS Flexbox/Grid + responsive design",
      "DOM manipulation + event handling",
      "REST API concepts — HTTP methods, status codes",
      "Express.js — routing, middleware, error handling",
      "Input validation + authentication (JWT)",
      "MongoDB + Mongoose — schema design, CRUD, relationships",
      "Environment variables + .gitignore best practices",
    ],
    project: "Full-stack Auth App with register/login/profile",
  },
  {
    phase: "Phase 3",
    title: "Backend Engineering",
    duration: "Weeks 9–14",
    level: "Intermediate",
    color: "from-purple-500 to-violet-500",
    dot: "bg-purple-500",
    description: "Production-grade backend — architecture, scale, aur depth.",
    topics: [
      "Clean architecture + SOLID principles",
      "Repository pattern + service layers",
      "PostgreSQL — advanced queries, indexes, transactions",
      "Redis — caching strategies, rate limiting, pub/sub",
      "Message queues — BullMQ patterns, retry, DLQ",
      "WebSockets — real-time communication at scale",
      "File uploads — S3, presigned URLs, streaming",
      "Role-based access control (RBAC)",
    ],
    project: "Scalable E-Commerce Backend API",
  },
  {
    phase: "Phase 4",
    title: "Cloud & DevOps",
    duration: "Weeks 15–18",
    level: "Intermediate–Advanced",
    color: "from-sky-500 to-cyan-500",
    dot: "bg-sky-500",
    description: "Deploy karo, monitor karo, production handle karo.",
    topics: [
      "Docker — multi-stage builds, docker-compose",
      "AWS — EC2, S3, RDS, ElastiCache, Lambda",
      "GitHub Actions — CI/CD pipelines",
      "Kubernetes basics — Pods, Deployments, HPA",
      "Nginx — reverse proxy, load balancing",
      "Monitoring — Prometheus, Grafana, Sentry",
      "Production debugging — memory leaks, CPU profiling",
    ],
    project: "Deploy full project to AWS with CI/CD + monitoring",
  },
  {
    phase: "Phase 5",
    title: "System Design & Interviews",
    duration: "Weeks 19–24",
    level: "Advanced",
    color: "from-orange-500 to-red-500",
    dot: "bg-orange-500",
    description: "Product company interviews crack karo — DSA, design, aur more.",
    topics: [
      "DSA — Arrays, Strings, Trees, Graphs, DP (8-week plan)",
      "System design framework — clarify, estimate, design, review",
      "Design: URL shortener, chat app, notification system",
      "Design: E-commerce backend, rate limiter, file storage",
      "JS/Node.js deep interview questions",
      "Behavioral interviews — STAR framework",
      "Resume + LinkedIn + GitHub portfolio optimization",
    ],
    project: "Capstone: SaaS Platform (fully deployed + monitored)",
  },
];

export function RoadmapTimeline() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500 via-blue-500 via-purple-500 via-sky-500 to-orange-500 opacity-30" />

      {phases.map((phase, i) => (
        <div key={i} className="relative pl-16 pb-8">
          {/* Dot */}
          <div className={`absolute left-4 top-5 h-5 w-5 rounded-full ${phase.dot} shadow-lg ring-4 ring-slate-950`} />

          {/* Card */}
          <div
            className={cn(
              "rounded-xl border transition-all duration-300",
              expanded === i
                ? "border-slate-600 bg-slate-800/60"
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            )}
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium">{phase.phase}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{phase.duration}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      phase.level.includes("Beginner") ? "bg-emerald-500/10 text-emerald-400" :
                      phase.level.includes("Advanced") ? "bg-blue-500/10 text-blue-400" :
                      "bg-amber-500/10 text-amber-400"
                    )}>
                      {phase.level}
                    </span>
                  </div>
                  <h3 className={cn("font-bold mt-0.5 text-lg", expanded === i ? "text-white" : "text-slate-200")}>
                    {phase.title}
                  </h3>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ml-4",
                  expanded === i && "rotate-180 text-blue-400"
                )}
              />
            </button>

            {expanded === i && (
              <div className="px-5 pb-5 space-y-5 border-t border-slate-700/50 pt-5">
                <p className="text-slate-400 text-sm">{phase.description}</p>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Topics Covered</h4>
                  <ul className="space-y-2">
                    {phase.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500/70 flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="text-lg flex-shrink-0">🛠️</span>
                  <div>
                    <div className="text-xs font-semibold text-blue-400 mb-1">Phase Project</div>
                    <div className="text-sm text-slate-300">{phase.project}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
