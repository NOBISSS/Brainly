

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "../../ui/button"
// import { ParticleField } from "./particle-field"
import { useCountUp } from "../../../hooks/use-count-up";
import { useNavigate } from "react-router-dom";

function StatItem({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  
  const { count, ref } = useCountUp(value, 2000)
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-foreground sm:text-4xl">
        {count.toLocaleString()}
        {suffix && <span className="gradient-text">{suffix}</span>}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function HeroSection() {
  const navigate=useNavigate();
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#F5F3FF] to-background" />
      <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#7C3AED]/5 blur-[150px]" />

      {/* 3D Particles */}
      {/* <ParticleField /> */}

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-xs font-medium text-[#7C3AED]">Now in Public Beta</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            <span>Second</span>{" "}
            <span className="gradient-text">Brainly</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-xl font-medium text-foreground/80 sm:text-2xl md:text-3xl"
          >
            Your Second Brain on the Internet
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Save. Organize. Never lose links again.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              size="lg"
              className="group bg-[#7C3AED] px-8 text-white shadow-xl shadow-[#7C3AED]/25 transition-all hover:bg-[#6D28D9] hover:shadow-2xl hover:shadow-[#7C3AED]/30"
              onClick={()=>navigate("/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={()=>navigate("/signin")}
              className="border-border/60 bg-transparent px-8 text-foreground hover:bg-accent"
            >
              Login
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-xl sm:mt-20 sm:gap-12 sm:p-8"
        >
          <StatItem value={12500} suffix="+" label="Active Users" />
          <StatItem value={8400} suffix="+" label="Workspaces" />
          <StatItem value={2100000} suffix="+" label="Links Saved" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-[#7C3AED]/30 pt-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-[#7C3AED]/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
