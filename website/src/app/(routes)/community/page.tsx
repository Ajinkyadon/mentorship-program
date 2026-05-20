import type { Metadata } from "next";
import { ArrowRight, Users, MessageSquare, Code2, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the CodeBharat community — 2000+ developers learning together. Discord, code reviews, mock interviews, and more.",
};

const channels = [
  { name: "#introductions", desc: "Apna developer journey share karo" },
  { name: "#daily-learning-log", desc: "Aaj kya seekha — daily updates" },
  { name: "#code-review", desc: "Apna code review ke liye share karo" },
  { name: "#interview-experiences", desc: "Interview experiences share karo" },
  { name: "#job-opportunities", desc: "Jobs, referrals, aur opportunities" },
  { name: "#system-design", desc: "Design problems discuss karo" },
  { name: "#wins-milestones", desc: "Apni wins celebrate karo! 🎉" },
  { name: "#resources", desc: "Useful links, books, tools" },
];

const events = [
  { day: "Monday", title: "Week Goals", desc: "Is hafte kya seekhna hai — share karo community mein" },
  { day: "Wednesday", title: "Code Review Live", desc: "Community members ka code live review hota hai" },
  { day: "Friday", title: "System Design Discussion", desc: "Ek design problem — community saath solve karta hai" },
  { day: "Sunday", title: "Weekly Wins", desc: "Hafte bhar ki achievements celebrate karo" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300">
              👥 Community
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              2,400+ developers, ek community
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Akele seekhna mushkil hai. Yahan ek active community hai — code reviews, mock interviews, job referrals, aur daily support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" asChild>
                <a href="https://discord.gg/codebharat" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-4 w-4" />
                  Join Discord
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/Ajinkyadon/mentorship-program" target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Discord Members", value: "2,400+", icon: MessageSquare, color: "text-indigo-400" },
            { label: "GitHub Stars", value: "340+", icon: Code2, color: "text-slate-300" },
            { label: "Weekly Events", value: "4/week", icon: Users, color: "text-blue-400" },
            { label: "Countries", value: "12+", icon: PlayCircle, color: "text-red-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5 text-center space-y-2">
                <Icon className={`h-6 w-6 mx-auto ${color}`} />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discord channels */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Discord Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {channels.map((ch) => (
              <div key={ch.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="font-mono text-blue-400 text-sm font-medium">{ch.name}</div>
                <div className="text-xs text-slate-500 mt-1">{ch.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly events */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Weekly Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map((ev) => (
              <Card key={ev.day}>
                <CardContent className="p-5 space-y-2">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{ev.day}</div>
                  <div className="font-bold text-white">{ev.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{ev.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Testimonials />
      <FAQSection />
    </div>
  );
}
