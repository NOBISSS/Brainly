

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += 100 / steps
      if (current >= 100) {
        setProgress(100)
        clearInterval(timer)
        setTimeout(onComplete, 400)
      } else {
        // Easing: fast at start, slow in middle, fast at end
        const eased = current < 50
          ? current + Math.random() * 2
          : current + Math.random() * 0.5
        setProgress(Math.min(eased, 99))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-[#A855F7]/8 blur-[100px]" />
        </div>

        {/* Brain icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="relative flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-[#7C3AED]/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-1 rounded-xl border border-[#A855F7]/30"
            />
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative z-10">
              <path
                d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"
                fill="#7C3AED"
                opacity="0.8"
              />
              <path d="M9 21h6M10 19v2M14 19v2" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M12 2v3M8.5 5l-1.5-2M15.5 5l1.5-2"
                stroke="#A855F7"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-lg font-medium text-foreground/80"
        >
          Unlocking your Second Brain...
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 280 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative h-1.5 overflow-hidden rounded-full bg-[#7C3AED]/10"
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Percentage */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm font-mono text-muted-foreground tabular-nums"
        >
          {Math.round(progress)}%
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
