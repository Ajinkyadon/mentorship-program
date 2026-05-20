import {
  Code2, Rocket, Users, BookOpen, Target, GitBranch, Cloud, Award,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Real-World Code",
    description:
      "Sirf theory nahi — production-grade code likhna seekhoge. Real projects, real deployment, real learnings.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitBranch,
    title: "GitHub-Integrated Content",
    description:
      "Saara course content GitHub repository mein hai. Open source, always updated, community-driven.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Target,
    title: "Interview-Focused",
    description:
      "DSA, system design, backend architecture — sab kuch product company interviews ko dhyan mein rakhke.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud Deployment",
    description:
      "AWS, Docker, CI/CD — production pe deploy karna sikhao. 'Works on my machine' se 'Live in production' tak.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: Users,
    title: "Active Community",
    description:
      "Discord community mein 2000+ developers hain. Code reviews, mock interviews, job referrals — sab ek jagah.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Rocket,
    title: "Structured Roadmaps",
    description:
      "Confusion khatam. Clear, opinionated learning paths jo specifically Indian job market ke liye design kiye hain.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: BookOpen,
    title: "Hinglish-Friendly",
    description:
      "Complex concepts simple Hinglish mein explain hote hain. Technical accuracy ke saath Indian context.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Award,
    title: "Project Portfolio",
    description:
      "Resume pe sirf 'Node.js experience' nahi — 3 deployed projects with live URLs. Interviewers notice karte hain.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-24 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-300">
            ✅ Why CodeBharat?
          </div>
          <h2 className="text-4xl font-bold text-white">
            Different kya hai yahan?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Tutorials dekhna aur engineer banna — dono alag hain. Yahan tum engineer bante ho.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="group p-6 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300 space-y-3"
            >
              <div className={`inline-flex p-2.5 rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
