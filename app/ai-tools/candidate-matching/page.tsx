"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CandidateMatchingPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Matching</h1>
          <p className="text-muted-foreground">Match candidates with suitable job positions</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/ai-tools">Back to AI Tools</Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Matching</CardTitle>
              <CardDescription>Match candidates with suitable job positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Candidate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="michael">Michael Chen</SelectItem>
                        <SelectItem value="sarah">Sarah Wilson</SelectItem>
                        <SelectItem value="david">David Rodriguez</SelectItem>
                        <SelectItem value="emma">Emma Thompson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Or Upload Resume</Label>
                    <div className="flex h-10 items-center gap-2 rounded-md border px-3">
                      <Input type="file" className="border-0 p-0 focus-visible:ring-0" />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Candidate Profile</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Skills</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">TypeScript</Badge>
                        <Badge variant="outline">UI/UX</Badge>
                        <Badge variant="outline">Figma</Badge>
                        <Badge variant="outline">User Research</Badge>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Experience</div>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">Product Designer at TechCorp (3 years)</div>
                        <div className="text-sm">UI Designer at DesignStudio (2 years)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Find Matching Positions</Button>

                <div>
                  <h3 className="text-lg font-medium">Matching Results</h3>
                  <div className="mt-4 space-y-4">
                    {matchingPositions.map((position, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{position.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {position.department} • {position.location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{position.matchScore}%</div>
                            <Progress value={position.matchScore} className="h-2 w-20" />
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-medium">Skills Match</div>
                            <Progress value={position.skillsMatch} className="mt-1 h-1" />
                          </div>
                          <div>
                            <div className="text-xs font-medium">Experience Match</div>
                            <Progress value={position.experienceMatch} className="mt-1 h-1" />
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {position.applicants} applicants • Posted {position.posted}
                          </div>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Match Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Matching Priority</Label>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Skills</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Experience</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Location</span>
                      <span className="text-sm font-medium">Low</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Salary Range</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Include Jobs</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="activeJobs" checked />
                    <label
                      htmlFor="activeJobs"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Active jobs only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remoteJobs" checked />
                    <label
                      htmlFor="remoteJobs"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include remote jobs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hybridJobs" />
                    <label
                      htmlFor="hybridJobs"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include hybrid jobs
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Apply Settings</Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-sm text-muted-foreground">Match Accuracy</div>
                  </div>

                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm text-muted-foreground">Matches/Day</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">Top Matched Positions</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Product Designer</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>UX Researcher</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>UI Designer</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

// Mock data
const matchingPositions = [
  {
    title: "Senior Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    matchScore: 92,
    skillsMatch: 95,
    experienceMatch: 90,
    applicants: 24,
    posted: "3 days ago",
  },
  {
    title: "UX Designer",
    department: "Product",
    location: "Remote",
    matchScore: 87,
    skillsMatch: 90,
    experienceMatch: 85,
    applicants: 18,
    posted: "1 week ago",
  },
  {
    title: "UI/UX Lead",
    department: "Design",
    location: "New York, NY",
    matchScore: 82,
    skillsMatch: 85,
    experienceMatch: 80,
    applicants: 32,
    posted: "2 weeks ago",
  },
]
