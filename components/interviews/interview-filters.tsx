"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Filter, Search, CalendarDays } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface InterviewFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStatus?: string
  onStatusChange: (value?: string) => void
  selectedType?: string
  onTypeChange: (value?: string) => void
  fromDate?: Date
  toDate?: Date
  onFromDateChange: (date: Date | null) => void
  onToDateChange: (date: Date | null) => void
  onClearFilters: () => void
}

export function InterviewFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClearFilters,
}: InterviewFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates or positions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select
            value={selectedStatus || "ALL"}
            onValueChange={(value) => onStatusChange(value === "ALL" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={selectedType || "ALL"}
            onValueChange={(value) => onTypeChange(value === "ALL" ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="PHONE">Phone</SelectItem>
              <SelectItem value="IN_PERSON">In Person</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
              <SelectItem value="PANEL">Panel</SelectItem>
            </SelectContent>
          </Select>

          {/* From Date */}
          <div className="flex items-center gap-2">
            <CalendarDays className="text-muted-foreground" />
            <DatePicker
              selected={fromDate}
              onChange={onFromDateChange}
              placeholderText="From Date"
              className="border rounded px-3 py-2 text-sm"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* To Date */}
          <div className="flex items-center gap-2">
            <CalendarDays className="text-muted-foreground" />
            <DatePicker
              selected={toDate}
              onChange={onToDateChange}
              placeholderText="To Date"
              className="border rounded px-3 py-2 text-sm"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* Clear Filters */}
          <Button variant="outline" onClick={onClearFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
