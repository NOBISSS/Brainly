
import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LoadingScreen } from "./sections/loading-screen"
import { Navbar } from "./sections/navbar"
import { HeroSection } from "./sections/hero"
import { FeaturesSection } from "./sections/features"
import { ProblemSolutionSection } from "./sections/problem-solution"
import { StatsSection } from "./sections/stats"
import { DeveloperSection } from "./sections/developer"
import { ContactSection } from "./sections/contact"
import { Footer } from "./sections/footer"

export default function HomePage() {
  const [loading, setLoading] = useState(() => {
  return !sessionStorage.getItem("homeLoaded")
})


  const handleLoadingComplete = useCallback(() => {
  sessionStorage.setItem("homeLoaded", "true")
  setLoading(false)
}, [])


  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Navbar />
              <main>
                <section id="hero"><HeroSection /></section>
                <section id="features"><FeaturesSection /></section>
                <section id="problem"><ProblemSolutionSection /></section>
                <section id="stats"><StatsSection /></section>
                <section id="developer"><DeveloperSection /></section>
                <section id="contact"><ContactSection /></section>
              </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
