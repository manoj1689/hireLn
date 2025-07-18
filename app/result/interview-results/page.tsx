"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchInterviews } from "@/lib/slices/interviews/fetch-interview-slice"
import { InterviewResponse } from "@/interface/interview"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Download, Eye, Search, ArrowLeft } from "lucide-react"

const InterviewResultPage: React.FC = () => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { interviews, loading, error } = useSelector((state: RootState) => state.fetchInterview);

    const [searchQuery, setSearchQuery] = useState("")
    const [positionFilter, setPositionFilter] = useState("all")
    const [sortBy, setSortBy] = useState("date")

    useEffect(() => {
        dispatch(fetchInterviews({ status: "COMPLETED" }))
    }, [dispatch])

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600"
        if (score >= 80) return "text-blue-600"
        if (score >= 70) return "text-yellow-600"
        return "text-red-600"
    }

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

    const filteredResults = interviews
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

    const handleViewDetails = (interviewId: string) => {
        router.push(`/result/interview-result-details?interview_id=${interviewId}`)
    }

    if (loading) return <div className="text-center py-8">Loading interview results...</div>
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            className="mb-2 p-0 h-auto text-muted-foreground hover:text-foreground"
                            onClick={() => router.push("/dashboard")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">AI Interview Results</h1>
                        <p className="text-muted-foreground mt-1">Review and analyze completed AI interviews</p>
                    </div>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search candidates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={positionFilter} onValueChange={setPositionFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
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
                                <SelectTrigger className="w-full sm:w-[200px]">
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

                {filteredResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={"/placeholder.svg"} alt={result.candidateName} />
                                        <AvatarFallback>{getInitials(result.candidateName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-semibold">{result.candidateName}</h3>
                                            <Badge variant="secondary">{result.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{result.candidateEmail}</p>
                                        <p className="text-sm font-medium">{result.jobTitle}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8">
                                    <div className="text-center space-y-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(result.scheduledAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {result.duration} min
                                        </div>
                                    </div>

                                    <div className="hidden md:block space-y-2 min-w-[200px]">
                                        <div className="flex justify-between text-xs">
                                            <span>Technical</span>
                                            <span>{result.feedback?.skills?.technical ?? 0}%</span>
                                        </div>
                                        <Progress value={result.feedback?.skills?.technical ?? 0} className="h-1" />
                                        <div className="flex justify-between text-xs">
                                            <span>Communication</span>
                                            <span>{result.feedback?.skills?.communication ?? 0}%</span>
                                        </div>
                                        <Progress value={result.feedback?.skills?.communication ?? 0} className="h-1" />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <div className={`text-3xl font-bold ${getScoreColor(result.feedback?.overallScore ?? 0)}`}>
                                            {result.feedback?.overallScore ?? 0}
                                        </div>
                                        <Progress value={result.feedback?.overallScore ?? 0} className="w-20 h-2" />
                                        <div className="text-xs text-muted-foreground">Overall Score</div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(result.id)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View Details</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </MainLayout>

    )
}

export default InterviewResultPage
