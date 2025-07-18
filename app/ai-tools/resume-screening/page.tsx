"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import Link from "next/link"

export default function ResumeScreeningPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Screening</h1>
          <p className="text-muted-foreground">Upload resumes to automatically screen and rank candidates</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/ai-tools">Back to AI Tools</Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resume Screening</CardTitle>
              <CardDescription>Upload resumes to automatically screen and rank candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobPosition">Select Job Position</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="frontend">
                      <SelectTrigger id="jobPosition" className="flex-1">
                        <SelectValue placeholder="Select job position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Senior Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Engineer</SelectItem>
                        <SelectItem value="product">Product Designer</SelectItem>
                        <SelectItem value="marketing">Marketing Manager</SelectItem>
                        <SelectItem value="sales">Sales Representative</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Create New Job</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Job Requirements</h3>
                  <div className="rounded-md border p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Required Skills</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge>React</Badge>
                          <Badge>TypeScript</Badge>
                          <Badge>Next.js</Badge>
                          <Badge>TailwindCSS</Badge>
                          <Badge>Redux</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Experience</Label>
                          <div className="text-sm">5+ years</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Education</Label>
                          <div className="text-sm">Bachelor's or higher</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Location</Label>
                          <div className="text-sm">San Francisco, CA (Hybrid)</div>
                        </div>

                        <div className="space-y-2">
                          <Label>Salary Range</Label>
                          <div className="text-sm">$130,000 - $180,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Resumes</Label>
                  <div className="rounded-lg border border-dashed p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Drag and drop resumes here or click to upload</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                    <Button className="mt-4">Browse Files</Button>
                  </div>
                </div>

                <Button className="w-full">Start Analysis</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary" className="flex-1">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="detailed" className="flex-1">
                    Detailed Scores
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex-1">
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <h3 className="text-lg font-medium">Selected Top Candidates</h3>
                  <div className="mt-4 space-y-4">
                    {topCandidates.map((candidate, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {candidate.position} at {candidate.company}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Match: {candidate.matchScore}% • {candidate.experience} years exp.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Email
                            </Button>
                            <Button size="sm">Call</Button>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <div className="mb-1 text-xs font-medium">Skills Match</div>
                            <Progress value={candidate.skillsMatch} className="h-2" />
                          </div>
                          <div>
                            <div className="mb-1 text-xs font-medium">Experience Match</div>
                            <Progress value={candidate.experienceMatch} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-4">
                    <div className="rounded-md border p-4 text-center">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm text-muted-foreground">Total Resumes</div>
                    </div>

                    <div className="rounded-md border p-4 text-center">
                      <div className="text-2xl font-bold text-primary">8</div>
                      <div className="text-sm text-muted-foreground">Qualified Candidates</div>
                    </div>

                    <div className="rounded-md border p-4 text-center">
                      <div className="text-2xl font-bold">76%</div>
                      <div className="text-sm text-muted-foreground">Average Match Score</div>
                    </div>

                    <div className="rounded-md border p-4 text-center">
                      <div className="text-2xl font-bold text-destructive">5</div>
                      <div className="text-sm text-muted-foreground">Auto-rejected</div>
                      <div className="text-xs text-muted-foreground">Below minimum criteria</div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select defaultValue="gpt4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Processing Speed</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-primary text-primary-foreground">
                    Fast
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Accurate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Match Criteria</Label>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Matches required technical skills and competencies
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Experience Level</span>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Years of relevant work experience</div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Education</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Academic qualifications and certifications</div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Culture Fit</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Alignment with company values and culture</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="workAuth" checked />
                    <label
                      htmlFor="workAuth"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Must have work authorization
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="relocate" />
                    <label
                      htmlFor="relocate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Willing to relocate
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remote" />
                    <label
                      htmlFor="remote"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remote work possible
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Start Analysis</Button>
              <Button variant="outline" className="w-full">
                Start AI Interview Round
              </Button>
              <Button variant="ghost" className="w-full">
                Reset Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

// Mock data
const topCandidates = [
  {
    name: "David Chen",
    position: "Senior Frontend Engineer",
    company: "Meta",
    matchScore: 95,
    experience: "7 years",
    skillsMatch: 95,
    experienceMatch: 92,
  },
  {
    name: "Sarah Miller",
    position: "Frontend Lead",
    company: "Google",
    matchScore: 92,
    experience: "6 years",
    skillsMatch: 90,
    experienceMatch: 94,
  },
  {
    name: "Michael Thompson",
    position: "Senior Developer",
    company: "Amazon",
    matchScore: 87,
    experience: "5 years",
    skillsMatch: 88,
    experienceMatch: 85,
  },
]
