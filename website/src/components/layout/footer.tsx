import Link from "next/link";
import { Code2, Globe, MessageCircle, PlayCircle } from "lucide-react";

const footerLinks = {
  Programs: [
    { href: "/programs/freshers-roadmap", label: "Freshers Roadmap" },
    { href: "/programs/backend-engineering", label: "Backend Engineering" },
    { href: "/programs/nodejs-mastery", label: "Node.js Mastery" },
    { href: "/programs/system-design", label: "System Design" },
    { href: "/programs/aws-cloud", label: "AWS & Cloud" },
  ],
  Resources: [
    { href: "/roadmap", label: "Learning Roadmap" },
    { href: "/interview-prep", label: "Interview Prep" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ],
  Community: [
    { href: "/community", label: "Join Discord" },
    { href: "/community#testimonials", label: "Success Stories" },
    { href: "/community#faq", label: "FAQs" },
  ],
};

const socials = [
  { icon: Code2, href: "https://github.com/Ajinkyadon/mentorship-program", label: "GitHub" },
  { icon: Globe, href: "#", label: "Twitter/X" },
  { icon: MessageCircle, href: "#", label: "LinkedIn" },
  { icon: PlayCircle, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                CodeBharat<span className="text-blue-400">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              India ke developers ke liye — zero se senior engineer tak. Real projects, real skills, real jobs.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CodeBharat. Made with ❤️ for Indian developers.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
