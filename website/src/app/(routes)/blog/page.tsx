import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: "Backend engineering, Node.js, system design, AWS, and career growth for Indian developers.",
};

const posts = [
  {
    slug: "nodejs-event-loop-explained",
    title: "Node.js Event Loop — Jo Tutorials Nahi Batate",
    description: "Event loop ke 6 phases, microtask vs macrotask queue, aur production mein ye kaise matter karta hai. Real examples ke saath.",
    date: "2024-01-15",
    readingTime: "8 min read",
    tags: ["Node.js", "JavaScript", "Performance"],
    tagVariant: "success" as const,
  },
  {
    slug: "system-design-url-shortener",
    title: "System Design: URL Shortener (Production Grade)",
    description: "100M URLs/day handle karne wala URL shortener design karo. Scale estimation, caching, analytics — sab kuch.",
    date: "2024-01-10",
    readingTime: "12 min read",
    tags: ["System Design", "Redis", "PostgreSQL"],
    tagVariant: "default" as const,
  },
  {
    slug: "backend-interview-secrets",
    title: "Backend Interviews: Jo Senior Engineers Differently Karte Hain",
    description: "Product company interviews mein fail kyun hote hain aur ek senior engineer ki tarah kaise approach karein — honest guide.",
    date: "2024-01-05",
    readingTime: "10 min read",
    tags: ["Interviews", "Career", "Backend"],
    tagVariant: "warning" as const,
  },
  {
    slug: "postgresql-indexing-guide",
    title: "PostgreSQL Indexing — EXPLAIN ANALYZE Padhna Seekho",
    description: "Slow queries 10x fast karne ka systematic approach. B-tree, composite, partial indexes — real production examples.",
    date: "2023-12-28",
    readingTime: "9 min read",
    tags: ["PostgreSQL", "Performance", "Database"],
    tagVariant: "default" as const,
  },
  {
    slug: "aws-for-backend-engineers",
    title: "AWS Basics for Backend Engineers — Practical Guide",
    description: "EC2, S3, RDS, Lambda — jo actually use hote hain production mein. Theory nahi, hands-on approach.",
    date: "2023-12-20",
    readingTime: "15 min read",
    tags: ["AWS", "Cloud", "DevOps"],
    tagVariant: "default" as const,
  },
  {
    slug: "from-service-to-product",
    title: "Service Company se Product Company: 6 Month Mein Switch",
    description: "TCS se Razorpay tak — real journey, real preparation, real mistakes. Ye guide follow karke mera switch hua.",
    date: "2023-12-15",
    readingTime: "7 min read",
    tags: ["Career", "Switch", "India"],
    tagVariant: "warning" as const,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-1.5 text-sm text-pink-300">
              📝 Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Backend Engineering Insights
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Node.js, system design, career growth, AWS — Indian developers ke liye practical articles.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant={post.tagVariant} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{post.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingTime}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1 hidden sm:block" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
