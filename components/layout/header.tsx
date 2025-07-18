"use client"

import { useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { logout } from "@/lib/slices/auth-slice"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
export function Header() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.auth)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <header className="border-b fixed bg-white z-10  w-full">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="pl-8 flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-primary">HireIn</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  2
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem
                  title="New candidate application"
                  description="Sarah Anderson applied for Senior Frontend Developer"
                  time="10 minutes ago"
                  isNew
                />
                <NotificationItem
                  title="Interview scheduled"
                  description="Interview with Michael Chen at 2:00 PM tomorrow"
                  time="1 hour ago"
                  isNew
                />
                <NotificationItem
                  title="Job posting expires soon"
                  description="UX Designer job posting expires in 2 days"
                  time="5 hours ago"
                />
                <NotificationItem
                  title="Candidate assessment completed"
                  description="David Thompson completed the technical assessment"
                  time="Yesterday"
                />
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>{user?.name || "Emily Johnson"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              <div className="p-2 border-b">
                <p className="text-sm font-medium">{user?.name || "Emily Johnson"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "emily.johnson@example.com"}</p>
              </div>
              <div className="py-2">
                <MenuItem href="/profile" label="My Profile" />
                <MenuItem href="/settings" label="Settings" />
                <MenuItem href="/company/profile" label="Company Profile" />
                <MenuItem href="/company/team" label="Team Management" />
                <MenuItem href="/company/billing" label="Billing & Subscription" />
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}

function MenuItem({ href, label }) {
  return (
    <Link href={href} className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted/50 transition-colors">
      {label}
    </Link>
  )
}

function NotificationItem({ title, description, time, isNew = false }) {
  return (
    <div className={`p-3 border-b hover:bg-muted/50 ${isNew ? "bg-muted/20" : ""}`}>
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium">{title}</h4>
        {isNew && <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary text-white rounded-full">New</span>}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <p className="text-xs text-muted-foreground mt-2">{time}</p>
    </div>
  )
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="8" height="8" rx="2" fill="#FF5A5A" />
      <rect x="4" y="14" width="8" height="8" rx="2" fill="#5A9CFF" />
      <rect x="4" y="24" width="8" height="8" rx="2" fill="#FFB800" />
      <rect x="14" y="4" width="18" height="28" rx="2" fill="#0CC5B9" />
    </svg>
  )
}
