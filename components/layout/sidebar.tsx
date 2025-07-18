"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Menu,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button: only visible below lg */}
      <button
        className="fixed z-50 top-4 left-4 bg-white p-2 rounded-md shadow-md border lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar: visible on lg, toggleable below lg */}
      <div
        className={cn(
          "fixed top-16 left-0  max-lg:h-full h-auto w-64 border-r bg-white transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:mt-16 "
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm">
              <NavItem href="/dashboard" icon={Home} title="Dashboard" isActive={pathname === "/dashboard"} />
              <NavItem href="/jobs" icon={Briefcase} title="Jobs" isActive={pathname.startsWith("/jobs")} />
              <NavItem
                href="/candidates"
                icon={Users}
                title="Candidates"
                isActive={pathname.startsWith("/candidates")}
              />
               <NavItem
                href="/interviews"
                icon={Calendar}
                title="Interviews"
                isActive={pathname.startsWith("/interviews")}
              />
              <NavItem
                href="/ai-tools"
                icon={BarChart3}
                title="AI Tools"
                isActive={pathname.startsWith("/ai-tools")}
              />
             
              <div className="mt-6">
                <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Administration</h3>
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4" />
                      <span>Company</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-7 mt-1 grid gap-1">
                      <Link href="/company/profile" className="rounded-md px-4 py-1.5 text-sm hover:bg-muted">
                        Profile
                      </Link>
                      <Link href="/company/team" className="rounded-md px-4 py-1.5 text-sm hover:bg-muted">
                        Team Members
                      </Link>
                      <Link href="/company/billing" className="rounded-md px-4 py-1.5 text-sm hover:bg-muted">
                        Billing
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <NavItem
                  href="/reports"
                  icon={FileText}
                  title="Reports"
                  isActive={pathname.startsWith("/reports")}
                />
                <NavItem
                  href="/settings"
                  icon={Settings}
                  title="Settings"
                  isActive={pathname.startsWith("/settings")}
                />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  isActive?: boolean
}

function NavItem({ href, icon: Icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-4 py-2 hover:bg-muted",
        isActive && "bg-primary/10 font-medium text-primary",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  )
}
