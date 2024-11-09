"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faComments,
  faProjectDiagram,
  faUserSecret,
  faUserGraduate,
  faEnvelope,
  faSun,
  faMoon,
  faChevronUp,
  faQuoteLeft,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState, useRef } from "react"
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@nextui-org/tooltip"
import AuthCard from "./Auth-card"

export default function VybeLandingPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const featuresY = useTransform(scrollYProgress, [0, 0.5], ["20%", "0%"])
  const featuresOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const testimonials = [
    { name: "Alex Johnson", role: "PSIT Student", text: "VYBE has transformed how I collaborate with peers!" },
    { name: "Sarah Lee", role: "Mentor", text: "It's a game-changer in education." },
    { name: "Mike Chen", role: "PSIT Alumni", text: "I wish VYBE existed during my student years." },
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  if (!mounted) return null

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } transition-all duration-300`}
    >


      {/* Hero Section */}
      <header id="home" ref={heroRef} className="container mx-auto px-9 py-40 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide mb-6">
            Connect, Collaborate, Create on{" "}
            <motion.span
              className="text-[#ff3b3f] inline-block"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              VYBE
            </motion.span>
          </h1>
          <p className="text-2xl mb-10">The exclusive social hub for PSIT students and mentors.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onOpen}
              className="bg-[#ff3b3f] hover:bg-[#ff8e3c] text-white font-bold py-4 px-8 rounded-full transition-transform duration-300"
            >
              Join Now
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            backgroundImage: [
              "radial-gradient(circle, #ff3b3f 10%, transparent 10%)",
              "radial-gradient(circle, #ff3b3f 10%, transparent 10%)",
            ],
            backgroundPosition: ["0% 0%, 100% 100%", "100% 100%, 0% 0%"],
            backgroundSize: ["20px 20px", "30px 30px"],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </header>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="opaque" className="items-center justify-center p-8">
        <ModalContent className="max-w-[600px]">
          <ModalBody>
            <AuthCard />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="container mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {[
            { icon: faComments, title: "Real-time Chat", description: "Instant communication among peers." },
            { icon: faProjectDiagram, title: "Project Collaboration", description: "Work together on projects." },
            { icon: faUserSecret, title: "Anonymous Community", description: "Share ideas anonymously." },
            { icon: faUserGraduate, title: "Mentor Support", description: "Guidance from mentors." },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className={`p-8 rounded-xl shadow-lg hover:shadow-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } relative overflow-hidden`}
              whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#ff3b3f] to-[#ff8e3c] opacity-0"
                whileHover={{ opacity: 0.1 }}
              />
              <FontAwesomeIcon icon={feature.icon} className="text-5xl mb-6 text-[#ff3b3f]" />
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">What Our Users Say</h2>
        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-[#ff3b3f] mb-4" />
              <p className="text-xl mb-4">{testimonials[currentTestimonial].text}</p>
              <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
              <p className="text-sm text-gray-500">{testimonials[currentTestimonial].role}</p>
              <FontAwesomeIcon icon={faQuoteRight} className="text-4xl text-[#ff3b3f] mt-4" />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Get in Touch</h2>
        <motion.form
          className="max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <Input type="text" placeholder="Your Name" className="w-full" />
          </div>
          <div className="mb-6">
            <Input type="email" placeholder="Your Email" className="w-full" />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="Your Message"
              rows={4}
              className={`w-full p-3 rounded-md ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } border border-gray-300`}
            ></textarea>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="w-full bg-[#ff3b3f] hover:bg-[#ff8e3c] text-white font-bold py-3 rounded-md transition-colors duration-300">
              Send Message
            </Button>
          </motion.div>
        </motion.form>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 VYBE. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4">
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[#ff3b3f] hover:text-[#ff8e3c] transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6"
          >
            <Tooltip content="Scroll to Top">
              <motion.button
                className="p-4 rounded-full bg-[#ff3b3f] text-white shadow-lg"
                onClick={scrollToTop}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </motion.button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}