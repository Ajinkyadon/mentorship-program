import type { Metadata } from "next";
import Link from "next/link";
import { Code2, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description: "Real-world projects — beginner to advanced. Build your portfolio with deployed, production-grade applications.",
};

const projects = [
  {
    title: "Auth Microservice",
    level: "Intermediate",
    levelVariant: "warning" as const,
    description: "Production-grade authentication service with JWT refresh rotation, OAuth2, RBAC, and audit logging.",
    stack: ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    features: ["JWT + refresh rotation", "Google OAuth", "RBAC", "Rate limiting", "Audit logs"],
    concepts: ["Clean architecture", "Security patterns", "Distributed auth"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "🔐",
  },
  {
    title: "Scalable E-Commerce API",
    level: "Advanced",
    levelVariant: "default" as const,
    description: "Full e-commerce backend with inventory management, payment integration, search, and real-time order tracking.",
    stack: ["Node.js", "PostgreSQL", "Elasticsearch", "Redis", "BullMQ", "AWS ECS"],
    features: ["Product catalog + search", "Race-condition-safe inventory", "Razorpay integration", "Order state machine"],
    concepts: ["Saga pattern", "Distributed locking", "Event-driven", "Horizontal scaling"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "🛍️",
  },
  {
    title: "Real-Time Chat App",
    level: "Advanced",
    levelVariant: "default" as const,
    description: "Horizontally scalable chat application with WebSockets, Redis pub/sub, and push notifications.",
    stack: ["Node.js", "Socket.io", "MongoDB", "Redis", "FCM"],
    features: ["1-on-1 + group chat", "Online presence", "Read receipts", "File sharing", "Push notifications"],
    concepts: ["WebSocket scaling", "Redis pub/sub", "Presence systems"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "💬",
  },
  {
    title: "Notification Service",
    level: "Advanced",
    levelVariant: "default" as const,
    description: "Multi-channel notification system handling 500k+ events/day with Kafka, email, SMS, and push.",
    stack: ["Node.js", "Kafka", "Redis", "SendGrid", "Twilio", "Firebase"],
    features: ["Email, SMS, Push", "Template engine", "User preferences", "Delivery tracking", "Bulk sends"],
    concepts: ["Event-driven architecture", "At-least-once delivery", "Idempotency"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "🔔",
  },
  {
    title: "Full Auth App",
    level: "Beginner",
    levelVariant: "success" as const,
    description: "Complete authentication system — register, login, JWT, profile. Perfect first full-stack project.",
    stack: ["Node.js", "Express", "MongoDB", "React", "JWT"],
    features: ["Register + Login", "JWT tokens", "Protected routes", "Profile management"],
    concepts: ["REST APIs", "JWT auth", "Full-stack integration"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "🚀",
  },
  {
    title: "URL Shortener",
    level: "Intermediate",
    levelVariant: "warning" as const,
    description: "Production URL shortener with analytics, custom aliases, Redis caching, and click tracking.",
    stack: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    features: ["Short code generation", "Click analytics", "Custom aliases", "TTL expiry", "Geographic tracking"],
    concepts: ["Base62 encoding", "Caching strategy", "System design"],
    github: "https://github.com/Ajinkyadon/mentorship-program",
    live: null,
    icon: "🔗",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-300">
              🛠️ Project Showcase
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Real projects, real portfolio</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Tutorial clone nahi — independently banane wale projects. Har ek deployed, documented, aur interview-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.title} hover className="flex flex-col h-full">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{project.icon}</span>
                  <Badge variant={project.levelVariant}>{project.level}</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg">{project.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{project.description}</p>
                </div>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-400 border border-slate-700 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features</div>
                  <ul className="space-y-1">
                    {project.features.map((f) => (
                      <li key={f} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-blue-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concepts */}
                <div className="flex flex-wrap gap-1.5">
                  {project.concepts.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                    <Code2 className="h-3.5 w-3.5" /> GitHub
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
