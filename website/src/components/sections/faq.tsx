"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Mujhe pehle se experience chahiye kya?",
    a: "Nahi! Fresher Roadmap bilkul zero se start hota hai. Agar tum CSE/IT student ho ya recent graduate ho aur coding basics bhi nahi aate — wahan se shuru karo. Working professionals ke liye alag tracks hain.",
  },
  {
    q: "Content free hai ya paid?",
    a: "Core roadmaps aur GitHub content bilkul free hain. Community Discord bhi free hai. Premium coaching, mock interviews, aur personalized mentorship ke liye paid options available hain.",
  },
  {
    q: "Kitna time lagega?",
    a: "Depends on track. Fresher roadmap: 3–6 months (2 hrs/day). Backend engineering: 4–6 months. Interview prep: 8–12 weeks. Working professionals ke liye weekend-friendly plans bhi hain.",
  },
  {
    q: "Job guarantee hai kya?",
    a: "Koi guaranteed nahi karta job — jo karega woh fraud hai. Lekin jo consistently follow karega, real projects banayega, aur actively apply karega — unke liye outcomes bahut strong hain. 87% placement rate is a real number.",
  },
  {
    q: "Node.js sirf seekhna hai — kya ye program suit karega?",
    a: "Haan! Node.js Mastery track especially Node.js developers ke liye hai — event loop internals, performance, streaming, production debugging. Backend Engineering track bhi heavily Node.js focused hai.",
  },
  {
    q: "Service company se product company switch possible hai?",
    a: "Absolutely. Module 12 (Career Growth) specifically ye cover karta hai. Resume optimization, LinkedIn branding, switching strategy, salary negotiation — sab included hai.",
  },
  {
    q: "Content kaisi language mein hai?",
    a: "Hinglish — technical accuracy ke saath simple explanations. Complex concepts ko unnecessarily complicated nahi banate. Indian developers ki tarah socha hai content design mein.",
  },
  {
    q: "GitHub se content pull hota hai?",
    a: "Haan! Website directly GitHub repository se content fetch karta hai. Ye architecture ensure karta hai ki content hamesha updated rahe. Tum bhi contribute kar sakte ho via pull requests.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400">
            Kuch aur puchna ho toh Discord community mein aa jao.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border transition-all duration-200",
                open === i
                  ? "border-slate-600 bg-slate-800/60"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={cn("font-medium text-sm", open === i ? "text-white" : "text-slate-300")}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 flex-shrink-0 transition-transform duration-200",
                    open === i && "rotate-180 text-blue-400"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
