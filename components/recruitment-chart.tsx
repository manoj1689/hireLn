"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface RecruitmentData {
  month: string
  applications: number
}

export function RecruitmentChart({ recruitmentTrends }: { recruitmentTrends: RecruitmentData[] }) {
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
    labels: recruitmentTrends.map((d) => d.month),
    datasets: [
      {
        label: "Applications",
        data: recruitmentTrends.map((d) => d.applications),
        backgroundColor: "rgba(12, 197, 185, 0.6)",
        borderColor: "#0CC5B9",
        borderWidth: 1,
        borderRadius: 6,
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
          stepSize: 1,
          beginAtZero: true,
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  )
}
