"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Download, Filter, Calendar, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./date-range-picker"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("recruitment")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Reports</span>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analyze your recruitment metrics and performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="mr-2 h-4 w-4" />
            <DatePickerWithRange />
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent p-0">
          <TabsTrigger
            value="recruitment"
            className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Recruitment
          </TabsTrigger>
          <TabsTrigger
            value="candidates"
            className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Candidates
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            AI Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recruitment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+14% from last month</p>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 w-[75%] rounded-full bg-primary"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24 days</div>
                <p className="text-xs text-muted-foreground">-3 days from last month</p>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 w-[65%] rounded-full bg-primary"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,240</div>
                <p className="text-xs text-muted-foreground">-$450 from last month</p>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 w-[45%] rounded-full bg-primary"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Offer Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 w-[86%] rounded-full bg-primary"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hiring by Department</CardTitle>
                <CardDescription>Number of hires per department in the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="flex h-full flex-col justify-end space-y-2">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-primary"></div>
                      <span className="text-sm">Engineering</span>
                      <div className="ml-auto">42</div>
                    </div>
                    <div className="h-24 w-full rounded-sm bg-primary"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-blue-500"></div>
                      <span className="text-sm">Sales</span>
                      <div className="ml-auto">35</div>
                    </div>
                    <div className="h-20 w-full rounded-sm bg-blue-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-green-500"></div>
                      <span className="text-sm">Marketing</span>
                      <div className="ml-auto">28</div>
                    </div>
                    <div className="h-16 w-full rounded-sm bg-green-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-yellow-500"></div>
                      <span className="text-sm">Product</span>
                      <div className="ml-auto">22</div>
                    </div>
                    <div className="h-12 w-full rounded-sm bg-yellow-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-purple-500"></div>
                      <span className="text-sm">HR</span>
                      <div className="ml-auto">15</div>
                    </div>
                    <div className="h-8 w-full rounded-sm bg-purple-500"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recruitment Funnel</CardTitle>
                <CardDescription>Candidate progression through recruitment stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Applications</span>
                      <span className="text-sm text-muted-foreground">1,245</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-full rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Screening</span>
                      <span className="text-sm text-muted-foreground">645</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[52%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Interview</span>
                      <span className="text-sm text-muted-foreground">320</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[26%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Assessment</span>
                      <span className="text-sm text-muted-foreground">185</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[15%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Offer</span>
                      <span className="text-sm text-muted-foreground">145</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[12%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Hired</span>
                      <span className="text-sm text-muted-foreground">127</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[10%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recruitment Efficiency</CardTitle>
              <CardDescription>Monthly recruitment metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end">
                  <div className="flex h-full w-full flex-col justify-end">
                    <div className="grid grid-cols-6 gap-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                        <div key={month} className="flex flex-col items-center">
                          <div className="flex w-full gap-1">
                            <div
                              className="h-40 w-3 rounded-t bg-primary"
                              style={{ height: `${Math.floor(Math.random() * 150) + 50}px` }}
                            ></div>
                            <div
                              className="h-40 w-3 rounded-t bg-blue-500"
                              style={{ height: `${Math.floor(Math.random() * 150) + 50}px` }}
                            ></div>
                            <div
                              className="h-40 w-3 rounded-t bg-green-500"
                              style={{ height: `${Math.floor(Math.random() * 150) + 50}px` }}
                            ></div>
                          </div>
                          <span className="mt-2 text-xs">{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs">Time to Hire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Cost per Hire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Offer Acceptance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,245</div>
                <p className="text-xs text-muted-foreground">+245 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Qualified Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,876</div>
                <p className="text-xs text-muted-foreground">58% qualification rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average AI Match Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Candidate Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Top: LinkedIn (42%)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Sources</CardTitle>
                <CardDescription>Where candidates are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="flex h-full flex-col justify-end space-y-2">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-primary"></div>
                      <span className="text-sm">LinkedIn</span>
                      <div className="ml-auto">42%</div>
                    </div>
                    <div className="h-24 w-full rounded-sm bg-primary"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-blue-500"></div>
                      <span className="text-sm">Company Website</span>
                      <div className="ml-auto">28%</div>
                    </div>
                    <div className="h-16 w-full rounded-sm bg-blue-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-green-500"></div>
                      <span className="text-sm">Indeed</span>
                      <div className="ml-auto">15%</div>
                    </div>
                    <div className="h-8 w-full rounded-sm bg-green-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-yellow-500"></div>
                      <span className="text-sm">Referrals</span>
                      <div className="ml-auto">10%</div>
                    </div>
                    <div className="h-6 w-full rounded-sm bg-yellow-500"></div>

                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded bg-purple-500"></div>
                      <span className="text-sm">Other</span>
                      <div className="ml-auto">5%</div>
                    </div>
                    <div className="h-3 w-full rounded-sm bg-purple-500"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Candidate Skills Distribution</CardTitle>
                <CardDescription>Most common skills among candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">JavaScript</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[68%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">React</span>
                      <span className="text-sm text-muted-foreground">62%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[62%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">TypeScript</span>
                      <span className="text-sm text-muted-foreground">54%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[54%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Node.js</span>
                      <span className="text-sm text-muted-foreground">48%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[48%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Python</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[42%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">SQL</span>
                      <span className="text-sm text-muted-foreground">38%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[38%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+8 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Applications per Job</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Time to Fill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32 days</div>
                <p className="text-xs text-muted-foreground">-4 days from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Job Posting Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5k</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Performance</CardTitle>
              <CardDescription>Applications and hires by job title</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left font-medium">Job Title</th>
                      <th className="h-12 px-4 text-left font-medium">Department</th>
                      <th className="h-12 px-4 text-left font-medium">Applications</th>
                      <th className="h-12 px-4 text-left font-medium">Interviews</th>
                      <th className="h-12 px-4 text-left font-medium">Hires</th>
                      <th className="h-12 px-4 text-left font-medium">Time to Fill</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Senior Frontend Developer</td>
                      <td className="p-4">Engineering</td>
                      <td className="p-4">124</td>
                      <td className="p-4">18</td>
                      <td className="p-4">3</td>
                      <td className="p-4">28 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Product Manager</td>
                      <td className="p-4">Product</td>
                      <td className="p-4">86</td>
                      <td className="p-4">12</td>
                      <td className="p-4">2</td>
                      <td className="p-4">35 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Sales Representative</td>
                      <td className="p-4">Sales</td>
                      <td className="p-4">142</td>
                      <td className="p-4">24</td>
                      <td className="p-4">5</td>
                      <td className="p-4">21 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">UX Designer</td>
                      <td className="p-4">Design</td>
                      <td className="p-4">98</td>
                      <td className="p-4">14</td>
                      <td className="p-4">2</td>
                      <td className="p-4">32 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Backend Engineer</td>
                      <td className="p-4">Engineering</td>
                      <td className="p-4">112</td>
                      <td className="p-4">16</td>
                      <td className="p-4">4</td>
                      <td className="p-4">30 days</td>
                    </tr>
                    <tr>
                      <td className="p-4">Marketing Specialist</td>
                      <td className="p-4">Marketing</td>
                      <td className="p-4">76</td>
                      <td className="p-4">10</td>
                      <td className="p-4">2</td>
                      <td className="p-4">25 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Match Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Interviews Conducted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">345</div>
                <p className="text-xs text-muted-foreground">+28% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186 hours</div>
                <p className="text-xs text-muted-foreground">+42 hours from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Tool Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">873 / 1000</div>
                <p className="text-xs text-muted-foreground">87% of monthly quota</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Tool Performance</CardTitle>
                <CardDescription>Effectiveness of AI recruitment tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Resume Screening</span>
                      <span className="text-sm text-muted-foreground">95%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[95%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Candidate Matching</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">AI Interviews</span>
                      <span className="text-sm text-muted-foreground">88%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[88%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Job Description Writer</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Usage Trends</CardTitle>
                <CardDescription>Monthly AI tool usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="flex h-full items-end">
                    <div className="flex h-full w-full flex-col justify-end">
                      <div className="grid grid-cols-6 gap-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                          <div key={month} className="flex flex-col items-center">
                            <div
                              className="w-12 rounded-t bg-primary"
                              style={{ height: `${Math.floor(Math.random() * 150) + 100}px` }}
                            ></div>
                            <span className="mt-2 text-xs">{month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
