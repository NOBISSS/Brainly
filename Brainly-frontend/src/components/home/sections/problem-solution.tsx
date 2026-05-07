

import { motion } from "framer-motion"
import { X, Check, MessageCircle, Bookmark, LinkIcon, Database, Search, Zap } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const problems = [
  { icon: MessageCircle, text: "Messy WhatsApp history with lost links" },
  { icon: Bookmark, text: "Forgotten bookmarks buried in browsers" },
  { icon: LinkIcon, text: "Scattered links across apps and devices" },
]

const solutions = [
  { icon: Database, text: "One centralized place for all your links" },
  { icon: Search, text: "Structured and searchable organization" },
  { icon: Zap, text: "Lightning fast search and retrieval" },
]

export function ProblemSolutionSection() {
  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
              Why Second Brainly
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
              The Problem We Solve
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Problem Column */}
          <ScrollReveal direction="left">
            <div className="rounded-2xl border border-red-200/60 bg-red-50/30 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">The Problem</h3>
              </div>
              <div className="flex flex-col gap-4">
                {problems.map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                    className="flex items-start gap-3 rounded-xl bg-card/80 p-4 border border-red-100/50"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-400">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Solution Column */}
          <ScrollReveal direction="right">
            <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED]/10 text-[#7C3AED]">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">The Solution</h3>
              </div>
              <div className="flex flex-col gap-4">
                {solutions.map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                    className="flex items-start gap-3 rounded-xl bg-card/80 p-4 border border-[#7C3AED]/10"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Arrow connecting */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 flex items-center justify-center">
            <div className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-6 py-3 backdrop-blur-xl">
              <p className="text-sm font-medium text-foreground">
                From chaos to <span className="font-bold gradient-text">clarity</span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
