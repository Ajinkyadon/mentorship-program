import { HeroSection } from "@/components/sections/hero";
import { WhyUsSection } from "@/components/sections/why-us";
import { ProgramsGrid } from "@/components/sections/programs-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="py-24 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
                🎯 Learning Programs
              </div>
              <h2 className="text-4xl font-bold text-white">Apna track choose karo</h2>
              <p className="text-slate-400 max-w-xl">
                Chahe fresher ho ya 3 saal ka experience — yahan har kisi ke liye structured path hai.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium flex-shrink-0"
            >
              View all programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProgramsGrid featured />
        </div>
      </section>
      <WhyUsSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
