"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Plus, Search, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainLayout } from "@/components/layout/main-layout"

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const teamMembers = [
    {
      id: 1,
      name: "Emily Johnson",
      email: "emily.johnson@hirein.tech",
      role: "CEO & Co-Founder",
      department: "Executive",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EJ",
      phone: "+1 (555) 123-4567",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@hirein.tech",
      role: "CTO & Co-Founder",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      phone: "+1 (555) 234-5678",
      status: "active",
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@hirein.tech",
      role: "Head of Product",
      department: "Product",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      phone: "+1 (555) 345-6789",
      status: "active",
    },
    {
      id: 4,
      name: "David Rodriguez",
      email: "david.rodriguez@hirein.tech",
      role: "VP of Sales",
      department: "Sales",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
      phone: "+1 (555) 456-7890",
      status: "active",
    },
    {
      id: 5,
      name: "Jessica Lee",
      email: "jessica.lee@hirein.tech",
      role: "Marketing Director",
      department: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
      phone: "+1 (555) 567-8901",
      status: "active",
    },
    {
      id: 6,
      name: "Robert Kim",
      email: "robert.kim@hirein.tech",
      role: "Senior Engineer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RK",
      phone: "+1 (555) 678-9012",
      status: "active",
    },
    {
      id: 7,
      name: "Amanda Thompson",
      email: "amanda.thompson@hirein.tech",
      role: "HR Manager",
      department: "Human Resources",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AT",
      phone: "+1 (555) 789-0123",
      status: "active",
    },
    {
      id: 8,
      name: "James Wilson",
      email: "james.wilson@hirein.tech",
      role: "Finance Director",
      department: "Finance",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JW",
      phone: "+1 (555) 890-1234",
      status: "active",
    },
    {
      id: 9,
      name: "Olivia Martinez",
      email: "olivia.martinez@hirein.tech",
      role: "Customer Success Manager",
      department: "Customer Success",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "OM",
      phone: "+1 (555) 901-2345",
      status: "active",
    },
    {
      id: 10,
      name: "Daniel Park",
      email: "daniel.park@hirein.tech",
      role: "UX Designer",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DP",
      phone: "+1 (555) 012-3456",
      status: "active",
    },
  ]

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <MainLayout>
<div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/company" className="hover:text-foreground">
          Company
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Team Members</span>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your company's team members and their access</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Invite a new team member to join your company.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Full name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input id="role" placeholder="Job title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="customer-success">Customer Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="access-level" className="text-right">
                  Access Level
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="limited">Limited Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Team Members ({teamMembers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left font-medium">Name</th>
                  <th className="h-12 px-4 text-left font-medium">Role</th>
                  <th className="h-12 px-4 text-left font-medium">Department</th>
                  <th className="h-12 px-4 text-left font-medium">Contact</th>
                  <th className="h-12 px-4 text-left font-medium">Status</th>
                  <th className="h-12 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{member.role}</td>
                    <td className="p-4">{member.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    </MainLayout>
    
  )
}
