"use client"

import { motion } from "framer-motion"
import { Flame, User } from "lucide-react"
import { cn } from "../lib/utils"

export function Navbar() {
  const navLinks = [
    { name: "Learn", href: "#/learn" },
    { name: "Join Battle", href: "#/battle" },
    { name: "Curriculum", href: "#/curriculum", active: true },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              SkillForge
            </motion.div>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "relative px-4 py-2 rounded-md text-sm font-medium transition-colors",
                link.active ? "text-blue-400" : "text-gray-300 hover:text-white hover:bg-gray-800/50",
              )}
            >
              {link.name}
              {link.active && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Streak/Fire icon (like LeetCode) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center cursor-pointer"
          >
            <Flame className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
              5
            </div>
          </motion.div>

          {/* Profile icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <User className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-gray-900 opacity-50 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

