

import { motion } from "framer-motion"
import { Link2, FolderOpen, Tag, Globe, Youtube, Twitter, FileText, Files } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const features = [
  {
    icon: Link2,
    title: "Save Links Instantly",
    description: "Capture any link from anywhere with a single click. Never lose a valuable resource again.",
  },
  {
    icon: FolderOpen,
    title: "Organize by Workspace",
    description: "Create workspaces for different projects, topics, or teams. Keep everything structured.",
  },
  {
    icon: Tag,
    title: "Tag Everything",
    description: "Add custom tags to your links for powerful filtering and instant retrieval.",
  },
  {
    icon: Globe,
    title: "Access Anytime",
    description: "Your links are synced across all devices. Access your second brain from anywhere.",
  },
]

const platforms = [
  { icon: Youtube, label: "YouTube", color: "#7C3AED" },
  { icon: Twitter, label: "Twitter", color: "#5B21B6" },
  { icon: FileText, label: "Docs", color: "#7C3AED" },
  { icon: Files, label: "Files", color: "#5B21B6" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#F5F3FF]/50 to-background" />
      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
              What is{" "}
              <span className="gradient-text">Second Brainly</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              A powerful link management platform that acts as your digital second brain.
              Save, organize, and access your links effortlessly.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group h-full rounded-2xl border border-border/40 bg-card/60 p-6 backdrop-blur-xl transition-all hover:border-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] transition-colors group-hover:bg-[#7C3AED] group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Platform cards */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <span className="mr-2 text-sm font-medium text-muted-foreground">Works with:</span>
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.label}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-card/60 px-4 py-2 backdrop-blur-sm"
              >
                <platform.icon className="h-4 w-4" style={{ color: platform.color }} />
                <span className="text-sm font-medium text-foreground">{platform.label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
