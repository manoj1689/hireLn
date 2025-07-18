"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Don't show layout for auth pages
  if (pathname.startsWith("/auth") || !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="container mx-auto pt-20   p-6">{children}</main>
      </div>
    </div>
  )
}
