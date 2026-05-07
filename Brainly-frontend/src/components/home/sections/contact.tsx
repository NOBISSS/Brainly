import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Phone, User, MessageSquare } from "lucide-react"
import { Button } from "../../ui/button";
import { ScrollReveal } from "./scroll-reveal";
import { sendContactMessage } from "@/api/telegram";
import toast from "react-hot-toast";

export function ContactSection() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  }

  try {
    await sendContactMessage(data)
    toast.success("Message sent!")

    e.currentTarget.reset() // clear form
  } catch {
    toast.error("Failed to send")
  }
}

  const [focused, setFocused] = useState<string | null>(null)

  const fields = [
    { name: "name", label: "Your Name", icon: User, type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "john@example.com" },
    { name: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1 (555) 000-0000" },
  ]

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#F5F3FF]/30 to-background" />
      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#7C3AED]/5 blur-[150px]" />

      <div className="relative mx-auto max-w-2xl">
        <ScrollReveal>
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
              Get in Touch
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
              Contact Us
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Have a question or feedback? We would love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form
            className="mt-12 rounded-2xl border border-border/40 bg-card/60 p-8 backdrop-blur-xl glow-purple"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-5">
              {fields.map((field) => (
                <div key={field.name} className="relative">
                  <label
                    htmlFor={field.name}
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      focused === field.name
                        ? "-top-2.5 text-xs font-medium text-[#7C3AED] bg-card px-2"
                        : "top-3.5 text-sm text-muted-foreground"
                    }`}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon
                      className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${
                        focused === field.name ? "text-[#7C3AED]" : "text-muted-foreground"
                      }`}
                    />
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={focused === field.name ? field.placeholder : ""}
                      onFocus={() => setFocused(field.name)}
                      onBlur={(e) => {
                        if (!e.target.value) setFocused(null)
                      }}
                      className="w-full rounded-xl border border-border/60 bg-card py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-all focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                    />
                  </div>
                </div>
              ))}

              {/* Message */}
              <div className="relative">
                <label
                  htmlFor="message"
                  className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                    focused === "message"
                      ? "-top-2.5 text-xs font-medium text-[#7C3AED] bg-card px-2"
                      : "top-3.5 text-sm text-muted-foreground"
                  }`}
                >
                  Your Message
                </label>
                <div className="relative">
                  <MessageSquare
                    className={`absolute left-4 top-3.5 h-4 w-4 transition-colors ${
                      focused === "message" ? "text-[#7C3AED]" : "text-muted-foreground"
                    }`}
                  />
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder={focused === "message" ? "Tell us what's on your mind..." : ""}
                    onFocus={() => setFocused("message")}
                    onBlur={(e) => {
                      if (!e.target.value) setFocused(null)
                    }}
                    className="w-full resize-none rounded-xl border border-border/60 bg-card py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-all focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                  />
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#7C3AED] text-white shadow-xl shadow-[#7C3AED]/25 transition-all hover:bg-[#6D28D9] hover:shadow-2xl hover:shadow-[#7C3AED]/30"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </motion.div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}
