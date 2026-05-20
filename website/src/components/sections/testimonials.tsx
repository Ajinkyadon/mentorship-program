import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Rahul Kumar",
    role: "Backend Engineer @ Razorpay",
    prev: "Previously: TCS (Support)",
    content:
      "3 saal TCS mein support project pe tha. CodeBharat ke backend program ke baad, Razorpay mein 22 LPA pe join kiya. System design aur Node.js internals ne interview completely turn kar diya.",
    rating: 5,
    initial: "R",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Priya Sharma",
    role: "SDE-2 @ Swiggy",
    prev: "Previously: Wipro (CRUD developer)",
    content:
      "Wipro mein sirf CRUD APIs banata tha. Yahan se AWS, Docker, aur proper backend architecture seekha. Swiggy mein SDE-2 clear kiya — system design round pehli baar crack hua!",
    rating: 5,
    initial: "P",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Amit Patel",
    role: "Full Stack Developer @ Urban Company",
    prev: "Previously: No experience (CSE fresher)",
    content:
      "College ke baad completely confused tha. Fresher roadmap follow kiya, 3 projects deploy kiye, aur 6 months mein first job. Resume mein real deployed projects the — interviewers impressed hue.",
    rating: 5,
    initial: "A",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Neha Singh",
    role: "Backend Engineer @ Meesho",
    prev: "Previously: Manual Testing (Career Switch)",
    content:
      "Testing se development switch karna scary tha. Career Switch track ne structured path diya. 5 months mein programming basics se full backend developer. Meesho mein 16 LPA milti hai ab.",
    rating: 5,
    initial: "N",
    color: "from-orange-500 to-amber-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm text-amber-300">
            ⭐ Student Success Stories
          </div>
          <h2 className="text-4xl font-bold text-white">
            Real developers, real results
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Ye sirf testimonials nahi hain — ye real career transformations hain.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="relative overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Quote className="h-6 w-6 text-slate-700 absolute top-5 right-5" />

                {/* Rating */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-300 text-sm leading-relaxed">&quot;{t.content}&quot;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-blue-400 text-xs">{t.role}</div>
                    <div className="text-slate-500 text-xs">{t.prev}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
