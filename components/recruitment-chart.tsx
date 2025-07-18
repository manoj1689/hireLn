"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const data = [
  { month: "Jan", applications: 150 },
  { month: "Feb", applications: 230 },
  { month: "Mar", applications: 224 },
  { month: "Apr", applications: 218 },
  { month: "May", applications: 135 },
  { month: "Jun", applications: 147 },
]

export function RecruitmentChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Applications",
        data: data.map((d) => d.applications),
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, "rgba(12, 197, 185, 0.2)")
          gradient.addColorStop(1, "rgba(12, 197, 185, 0)")
          return gradient
        },
        borderColor: "#0CC5B9",
        tension: 0.4,
        pointBackgroundColor: "#0CC5B9",
        pointBorderColor: "#0CC5B9",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 6,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#888",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          drawBorder: false,
          color: "#e2e8f0",
        },
        ticks: {
          color: "#888",
          font: {
            size: 12,
          },
          stepSize: 20,
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
