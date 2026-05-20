import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: string;
  content: string;
}

export interface Program {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  skills: string[];
  outcomes: string[];
  icon: string;
  color: string;
  featured: boolean;
}

// Static program data — update here to add/remove programs
export const programs: Program[] = [
  {
    slug: "freshers-roadmap",
    title: "Freshers Roadmap",
    description:
      "Zero se job-ready tak. Complete roadmap for CSE/IT students and recent graduates with zero industry experience.",
    duration: "3–6 months",
    level: "beginner",
    skills: ["JavaScript", "Node.js", "Express", "MongoDB", "Git", "HTML/CSS", "REST APIs"],
    outcomes: [
      "Build full-stack projects independently",
      "Crack fresher interviews at product companies",
      "Deploy applications to production",
      "Understand software engineering fundamentals",
    ],
    icon: "🚀",
    color: "from-emerald-500 to-teal-600",
    featured: true,
  },
  {
    slug: "backend-engineering",
    title: "Backend Engineering",
    description:
      "For 2–4 year developers. Go deep into scalable systems, production engineering, and senior-level backend architecture.",
    duration: "4–6 months",
    level: "advanced",
    skills: ["Node.js Internals", "PostgreSQL", "Redis", "AWS", "Docker", "System Design", "CI/CD"],
    outcomes: [
      "Design scalable backend systems",
      "Crack 15–40 LPA product company interviews",
      "Handle production incidents confidently",
      "Build cloud-native applications",
    ],
    icon: "⚙️",
    color: "from-blue-500 to-indigo-600",
    featured: true,
  },
  {
    slug: "nodejs-mastery",
    title: "Node.js Mastery",
    description:
      "Master Node.js from event loop internals to production-grade microservices. For developers serious about backend excellence.",
    duration: "3–4 months",
    level: "intermediate",
    skills: ["Event Loop", "Streams", "Worker Threads", "Express", "NestJS", "Testing", "Performance"],
    outcomes: [
      "Understand Node.js internals deeply",
      "Build performant backend services",
      "Write production-grade Node.js code",
      "Debug complex async issues",
    ],
    icon: "💚",
    color: "from-green-500 to-emerald-600",
    featured: true,
  },
  {
    slug: "system-design",
    title: "System Design Prep",
    description:
      "Crack the toughest interview round. Design scalable systems like URL shorteners, chat apps, and notification services.",
    duration: "6–8 weeks",
    level: "advanced",
    skills: ["HLD", "LLD", "Scalability", "Caching", "Databases", "Queues", "Microservices"],
    outcomes: [
      "Clear system design rounds at product companies",
      "Design systems for 10M+ users",
      "Articulate trade-offs confidently",
      "Understand distributed systems fundamentals",
    ],
    icon: "🏗️",
    color: "from-purple-500 to-violet-600",
    featured: true,
  },
  {
    slug: "interview-preparation",
    title: "Interview Preparation",
    description:
      "DSA + JS + Backend + Behavioral. Complete interview preparation for fresher and mid-level developer roles.",
    duration: "8–12 weeks",
    level: "intermediate",
    skills: ["DSA", "JavaScript", "Node.js", "SQL", "OS", "DBMS", "CN", "HR Prep"],
    outcomes: [
      "Solve LeetCode medium problems confidently",
      "Clear technical rounds at top companies",
      "Handle behavioral interviews professionally",
      "Negotiate salary effectively",
    ],
    icon: "🎯",
    color: "from-orange-500 to-red-500",
    featured: false,
  },
  {
    slug: "aws-cloud",
    title: "AWS & Cloud Engineering",
    description:
      "From zero cloud knowledge to deploying production systems on AWS. Docker, Kubernetes, CI/CD, and more.",
    duration: "6–8 weeks",
    level: "intermediate",
    skills: ["AWS EC2", "S3", "RDS", "Lambda", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
    outcomes: [
      "Deploy applications independently on AWS",
      "Set up CI/CD pipelines",
      "Understand cloud architecture",
      "Manage production infrastructure",
    ],
    icon: "☁️",
    color: "from-sky-500 to-blue-600",
    featured: false,
  },
  {
    slug: "fullstack-roadmap",
    title: "Full-Stack Roadmap",
    description:
      "Frontend to backend to deployment. Complete full-stack development with React, Node.js, and modern tooling.",
    duration: "5–7 months",
    level: "intermediate",
    skills: ["React", "Next.js", "Node.js", "PostgreSQL", "TypeScript", "Tailwind", "Deployment"],
    outcomes: [
      "Build complete full-stack applications",
      "Work on both frontend and backend",
      "Deploy and maintain production apps",
      "Apply for full-stack developer roles",
    ],
    icon: "🌐",
    color: "from-pink-500 to-rose-600",
    featured: false,
  },
  {
    slug: "career-switch",
    title: "Career Switch Track",
    description:
      "From support/testing/non-tech to software development. Structured path for career switchers entering the developer world.",
    duration: "4–5 months",
    level: "beginner",
    skills: ["Programming Basics", "JavaScript", "Node.js", "Databases", "Git", "APIs"],
    outcomes: [
      "Transition into software development",
      "Build a developer portfolio from scratch",
      "Get first developer job",
      "Understand real-world development workflows",
    ],
    icon: "🔄",
    color: "from-amber-500 to-yellow-600",
    featured: false,
  },
];

// Fetch a single post from GitHub raw content
export async function fetchGitHubContent(path: string): Promise<string | null> {
  const GITHUB_RAW =
    process.env.GITHUB_RAW_BASE ||
    "https://raw.githubusercontent.com/Ajinkyadon/mentorship-program/main";

  try {
    const res = await fetch(`${GITHUB_RAW}/${path}`, {
      next: { revalidate: 3600 }, // ISR — revalidate every hour
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

export function parseFrontmatter(raw: string) {
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}
