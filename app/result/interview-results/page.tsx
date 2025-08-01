"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchInterviews } from "@/lib/slices/interviews/fetch-interview-slice"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, RotateCcw, Search, XCircle } from "lucide-react"
import { InterviewResultHeader } from "./result-header"
import { cn } from "@/lib/utils"

const InterviewResultPage: React.FC = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { interviews, loading, error } = useSelector((state: RootState) => state.fetchInterview)

    const [searchQuery, setSearchQuery] = useState("")
    const [positionFilter, setPositionFilter] = useState("all")
    const [sortBy, setSortBy] = useState("date")

    useEffect(() => {
        dispatch(fetchInterviews({ status: "COMPLETED" }))
    }, [dispatch])

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

    const filteredResults = useMemo(() => {
        return interviews
            .filter((result) => {
                const matchesSearch =
                    result.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    result.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    result.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

                const matchesPosition =
                    positionFilter === "all" || result.jobTitle.toLowerCase().includes(positionFilter.toLowerCase())

                return matchesSearch && matchesPosition
            })
            .sort((a, b) => {
                if (sortBy === "score") return (b.feedback?.overallScore ?? 0) - (a.feedback?.overallScore ?? 0)
                if (sortBy === "name") return a.candidateName.localeCompare(b.candidateName)
                if (sortBy === "position") return a.jobTitle.localeCompare(b.jobTitle)
                return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
            })
    }, [interviews, searchQuery, positionFilter, sortBy])

    const handleViewDetails = (interviewId: string) => {
        router.push(`/result/interview-result-details?interview_id=${interviewId}`)
    }

    if (loading) return <div className="text-center py-8">Loading interview results...</div>
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>

    return (
        <MainLayout>
            <div className="space-y-6">
                <InterviewResultHeader />

                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search candidates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={positionFilter} onValueChange={setPositionFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Positions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Positions</SelectItem>
                                    <SelectItem value="designer">Product Designer</SelectItem>
                                    <SelectItem value="developer">Developer</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="researcher">UX Researcher</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Interview Date</SelectItem>
                                    <SelectItem value="score">Overall Score</SelectItem>
                                    <SelectItem value="name">Candidate Name</SelectItem>
                                    <SelectItem value="position">Position</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {filteredResults.map((result) => {
                    const hue = Math.floor(Math.random() * 360)
                    const avatarBgColor = `hsl(${hue}, 90%, 85%)`
                    const avatarTextColor = `hsl(${hue}, 40%, 40%)`

                    const statusConfig = {
                        SCHEDULED: {
                            color: "bg-blue-50 text-blue-700 border border-blue-200",
                            icon: <Calendar className="h-3 w-3" />,
                            pulse: true,
                        },
                        COMPLETED: {
                            color: "bg-green-50 text-green-700 border border-green-200",
                            icon: <CheckCircle className="h-3 w-3" />,
                            pulse: false,
                        },
                        CANCELLED: {
                            color: "bg-red-50 text-red-700 border border-red-200",
                            icon: <XCircle className="h-3 w-3" />,
                            pulse: false,
                        },
                        RESCHEDULED: {
                            color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
                            icon: <RotateCcw className="h-3 w-3" />,
                            pulse: true,
                        },
                        NO_SHOW: {
                            color: "bg-gray-50 text-gray-700 border border-gray-200",
                            icon: <AlertCircle className="h-3 w-3" />,
                            pulse: false,
                        },
                    }

                    const currentStatus = statusConfig[result.status as keyof typeof statusConfig] || statusConfig.SCHEDULED

                    return (
                        <Card key={result.id} className="hover:shadow-md transition-shadow p-4">
                            <div className=" flex justify-end items-center gap-2 flex-shrink-0  sm:hidden">
                                <Badge
                                    className={cn(
                                        "text-xs font-medium inline-flex items-center px-2 py-1 rounded-md",
                                        currentStatus.color,
                                        currentStatus.pulse && "animate-pulse"
                                    )}
                                >
                                    {currentStatus.icon}
                                    <span className="ml-1">{result.status.replace("_", " ")}</span>
                                </Badge>
                            </div>


                            <div className="flex flex-wrap justify-between items-start gap-4 mt-2">
                                <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                                    <Avatar className="h-14 w-14 ring-2 ring-white">
                                        <AvatarFallback
                                            className="text-white font-semibold"
                                            style={{ backgroundColor: avatarBgColor, color: avatarTextColor }}
                                        >
                                            {getInitials(result.candidateName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div >
                                        <div className="flex gap-2">
                                            <h3 className="text-lg font-semibold">{result.candidateName}</h3>
                                            <div className=" justify-end items-center gap-2 flex-shrink-0 hidden sm:block">
                                                <Badge
                                                    className={cn(
                                                        "text-xs font-medium inline-flex items-center px-2 py-1 rounded-md",
                                                        currentStatus.color,
                                                        currentStatus.pulse && "animate-pulse"
                                                    )}
                                                >
                                                    {currentStatus.icon}
                                                    <span className="ml-1">{result.status.replace("_", " ")}</span>
                                                </Badge>
                                            </div>
                                        </div>


                                        <p className="text-sm text-sky-500 font-medium">{result.candidateEducation}</p>
                                        <p className="text-sm text-muted-foreground">{result.candidateEmail}</p>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-[200px] text-sm text-muted-foreground space-y-1">
                                    <p><span className="font-medium text-black">{result.jobTitle}</span></p>
                                    <p>{result.jobEducation}</p>
                                    <p>{result.jobDepartment}</p>
                                </div>

                                <div className="flex-1 min-w-[150px] text-sm text-muted-foreground space-y-1">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(result.scheduledAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {result.duration} min
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(result.id)}
                                        className="flex items-center gap-1"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Result
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </MainLayout>
    )
}

export default InterviewResultPage
