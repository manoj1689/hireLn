"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const departmentData = [
  { name: "Engineering", value: 45, color: "#0CC5B9" },
  { name: "Sales", value: 20, color: "#6366F1" },
  { name: "Marketing", value: 15, color: "#F59E0B" },
  { name: "Design", value: 18, color: "#10B981" },
]

export function DepartmentChart() {
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
    labels: departmentData.map((item) => item.name),
    datasets: [
      {
        data: departmentData.map((item) => item.value),
        backgroundColor: departmentData.map((item) => item.color),
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
        display: false, // You can enable it if you want
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  )
}
