"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"

type TimerProps = {
  duration: number
  onExpire: () => void
  isPaused: boolean
  startTime?: number
}

export default function Timer({ duration, onExpire, isPaused, startTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const controls = useAnimationControls()
  const [hasExpired, setHasExpired] = useState(false)
  const hasCalledOnExpire = useRef(false)

  // Synchronize timer with server time
  useEffect(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(duration - elapsed, 0)
      setTimeLeft(remaining)
      
      // If synced time is already expired or very close to expiry
      if (remaining <= 1 && !hasCalledOnExpire.current) {
        hasCalledOnExpire.current = true
        setHasExpired(true)
        onExpire()
      }
    } else {
      setTimeLeft(duration)
      setHasExpired(false)
      hasCalledOnExpire.current = false
    }
  }, [startTime, duration, onExpire])

  // Reset expired state when component remounts (each question)
  useEffect(() => {
    setHasExpired(false)
    hasCalledOnExpire.current = false
    
    return () => {
      // Clean up on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Shake animation when time is running low
  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      controls.start({
        x: [0, -2, 2, -2, 0],
        transition: { duration: 0.5 },
      })
    }

    // Scale up animation when time expires
    if (timeLeft === 0) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 },
      })
    }
  }, [timeLeft, controls])

  // Timer countdown
  useEffect(() => {
    // Clear existing interval first
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    if (isPaused) {
      return
    }

    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newValue = prev - 1
          
          if (newValue <= 0) {
            // Clear interval and call onExpire only once
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            
            if (!hasCalledOnExpire.current) {
              hasCalledOnExpire.current = true
              setHasExpired(true)
              onExpire()
            }
            
            return 0
          }
          
          return newValue
        })
      }, 1000)
    } else if (!hasExpired && !hasCalledOnExpire.current) {
      // Just in case we start with timeLeft = 0
      hasCalledOnExpire.current = true
      setHasExpired(true)
      onExpire()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [timeLeft, onExpire, isPaused, hasExpired])

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100

  // Determine color based on time left
  const getColor = () => {
    if (timeLeft <= 5) return "text-red-500"
    if (timeLeft <= 10) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <motion.div animate={controls} className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#eab308" : "#22c55e"}
            strokeWidth="8"
            strokeDasharray="276.46"
            strokeDashoffset={276.46 - (276.46 * progress) / 100}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className={`text-3xl font-bold ${getColor()}`}>{timeLeft}</span>
      </div>
      <p className="mt-2 text-white font-medium">Time Left</p>
    </motion.div>
  )
}

