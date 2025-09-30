"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface EmotionChartProps {
  emotions: {
    happy: number
    angry: number
    frustrated: number
    confused: number
    sad: number
    surprised: number
    neutral: number
    hopeful: number
    bored: number
  }
}

export function EmotionChart({ emotions }: EmotionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Destroy existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        const emotionLabels = Object.keys(emotions)
        const emotionValues = Object.values(emotions)

        const colors = [
          "#10b981", // happy - green
          "#ef4444", // angry - red
          "#f97316", // frustrated - orange
          "#8b5cf6", // confused - purple
          "#3b82f6", // sad - blue
          "#eab308", // surprised - yellow
          "#6b7280", // neutral - gray
          "#059669", // hopeful - emerald
          "#64748b", // bored - slate
        ]

        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: emotionLabels.map((label) => label.charAt(0).toUpperCase() + label.slice(1)),
            datasets: [
              {
                data: emotionValues,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const total = emotionValues.reduce((a, b) => a + b, 0)
                    const percentage = ((context.parsed / total) * 100).toFixed(1)
                    return `${context.label}: ${percentage}%`
                  },
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [emotions])

  return (
    <div className="h-80 w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
