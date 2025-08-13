"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { DepartmentStat } from "@/interface/dashboard"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  departmentStats: DepartmentStat[]
}

export function DepartmentChart({ departmentStats }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

 
  if (!mounted || !departmentStats || departmentStats.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  const chartData = {
    labels: departmentStats.map((item) => item.department),
    datasets: [
      {
        data: departmentStats.map((item) => item.jobCount),
        backgroundColor: departmentStats.map(() =>
          `hsl(${Math.floor(Math.random() * 360)}, 80%, 85%)`
        ),
        borderWidth: 1,
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
        callbacks: {
          label: function (context: any) {
            const value = context.parsed
            const label = context.label
            return `${label}: ${value} positions`
          },
        },
      },
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  )
}
