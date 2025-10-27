"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CountdownTimerProps {
  onTimeExpired: () => void
  durationSeconds?: number
}

export default function CountdownTimer({ onTimeExpired, durationSeconds = 86400 }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsExpired(true)
          onTimeExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onTimeExpired])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <Card className={`border-0 shadow-lg ${isExpired ? "bg-red-50 dark:bg-red-950" : ""}`}>
      <CardHeader
        className={`border-b ${isExpired ? "border-red-200 dark:border-red-800" : "border-slate-200 dark:border-slate-800"}`}
      >
        <CardTitle className="text-lg">Payment Expires In</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div
          className={`text-center py-4 rounded-lg ${isExpired ? "bg-red-100 dark:bg-red-900" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          <p
            className={`text-4xl font-bold font-mono ${isExpired ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}
          >
            {formatTime(timeLeft)}
          </p>
          <p
            className={`text-sm mt-2 ${isExpired ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}
          >
            {isExpired ? "Payment window expired" : "HH:MM:SS"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
