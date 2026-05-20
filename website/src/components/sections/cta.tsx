import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-slate-900/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
              🚀 Start Today — It&apos;s Free
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Aaj hi apna{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                developer journey
              </span>{" "}
              shuru karo
            </h2>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              2,400+ developers already learning. Content GitHub pe free hai. Community Discord pe active hai. Sirf shuru karna hai.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/programs">
                  Explore Programs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://github.com/Ajinkyadon/mentorship-program"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>

            <p className="text-slate-600 text-sm">
              No credit card required · Open source content · Active community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
