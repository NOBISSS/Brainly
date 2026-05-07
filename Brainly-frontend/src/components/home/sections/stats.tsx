

import { Users, Layout, Link2, Activity } from "lucide-react"
import { useCountUp } from "../../../hooks/use-count-up"
import { ScrollReveal } from "./scroll-reveal"
import { useEffect } from "react"

const stats = [
  { icon: Users, value: 12500, suffix: "+", label: "Total Users", description: "Growing every day" },
  { icon: Layout, value: 8400, suffix: "+", label: "Total Workspaces", description: "Organized knowledge" },
  { icon: Link2, value: 2100000, suffix: "+", label: "Links Saved", description: "And counting" },
  { icon: Activity, value: 99.9, suffix: "%", label: "Uptime", description: "Always reliable" },
]

function StatCard({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const isPercentage = stat.label === "Uptime"
  const hasAnimated = sessionStorage.getItem("statsSectionAnimated")

const { count, ref } = useCountUp(
  isPercentage ? 999 : stat.value,
  hasAnimated ? 0 : 2500
)

  useEffect(() => {
  sessionStorage.setItem("statsSectionAnimated", "true")
}, [])

  const displayValue = isPercentage
    ? (count / 10).toFixed(1)
    : count.toLocaleString()

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        ref={ref}
        className="group rounded-2xl border border-border/40 bg-card/60 p-8 backdrop-blur-xl transition-all hover:border-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/5 glow-purple"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] transition-colors group-hover:bg-[#7C3AED] group-hover:text-white">
          <stat.icon className="h-6 w-6" />
        </div>
        <p className="text-4xl font-bold text-foreground sm:text-5xl tabular-nums">
          {displayValue}
          <span className="gradient-text">{stat.suffix}</span>
        </p>
        <p className="mt-2 text-lg font-semibold text-foreground">{stat.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
      </div>
    </ScrollReveal>
  )
}

export function StatsSection() {
  

  return (
    <section id="stats" className="relative px-4 py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#F5F3FF]/30 to-background" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/5 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
              By the Numbers
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
              Trusted by Thousands
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Join a growing community of users who rely on Second Brainly to organize their digital life.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
