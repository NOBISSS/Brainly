import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, ExternalLink } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#", color: "hover:bg-foreground/10" },
  { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:bg-[#0077B5]/10" },
  { icon: Twitter, label: "Twitter", href: "#", color: "hover:bg-[#1DA1F2]/10" },
]

export function DeveloperSection() {
  return (
    <section id="developer" className="relative px-4 py-24 sm:py-32">
      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
              Meet the Creator
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
              Built with Passion
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-16 overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl glow-purple">
            <div className="flex flex-col items-center gap-8 p-8 sm:p-12 md:flex-row md:gap-12">
              {/* Developer Image */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="relative shrink-0"
              >
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#7C3AED]/20 sm:h-48 sm:w-48">
                  <img src="/avatar.png" alt="dev" className="w-[200px] h-[200px]" />

                </div>
                <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-[#7C3AED] text-white">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </motion.div>

              {/* Developer Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground">
                  The Developer
                </h3>
                <p className="mt-1 text-sm font-medium text-[#7C3AED]">
                  Full-Stack Developer & Creator
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Passionate about building tools that simplify digital life. Second Brainly was born 
                  from the frustration of losing important links across different platforms. 
                  The goal is simple: give everyone a reliable second brain on the internet.
                </p>

                {/* Social Links */}
                <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 text-muted-foreground transition-all ${link.color} hover:text-foreground`}
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
