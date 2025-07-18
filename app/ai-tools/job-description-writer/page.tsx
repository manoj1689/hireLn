"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import Link from "next/link"

export default function JobDescriptionWriterPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Description Writer</h1>
          <p className="text-muted-foreground">Create compelling job descriptions optimized for candidate engagement</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/ai-tools">Back to AI Tools</Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Description Generator</CardTitle>
              <CardDescription>Create professional and engaging job descriptions with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select defaultValue="jobDescription">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jobDescription">Job Description</SelectItem>
                      <SelectItem value="emailTemplate">Email Template</SelectItem>
                      <SelectItem value="interviewQuestions">Interview Questions</SelectItem>
                      <SelectItem value="offerLetter">Offer Letter</SelectItem>
                      <SelectItem value="rejectionLetter">Rejection Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Job Position</Label>
                  <Input placeholder="e.g., Senior Frontend Developer" />
                </div>

                <div className="space-y-2">
                  <Label>Key Requirements</Label>
                  <Input placeholder="e.g., React, TypeScript, 5+ years experience" />
                </div>

                <div className="space-y-2">
                  <Label>Company Values</Label>
                  <Input placeholder="e.g., Innovation, Collaboration, Excellence" />
                </div>

                <div className="space-y-2">
                  <Label>Additional Details (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific details about the role, team, or company culture..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Generate Content</Button>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Generated Content</h3>
                  <div className="mt-4 rounded-md bg-muted p-4 text-sm">
                    <p className="whitespace-pre-line">
                      <strong>Senior Frontend Developer</strong>
                      <strong>About the Role:</strong>
                      We're looking for a Senior Frontend Developer to join our engineering team. You'll be responsible
                      for building and maintaining user interfaces for our web applications, collaborating with
                      designers and backend developers, and mentoring junior developers.
                      <strong>Key Responsibilities:</strong>• Develop and maintain responsive web applications using
                      modern JavaScript frameworks • Write clean, maintainable, and efficient code • Collaborate with
                      designers to implement UI/UX designs • Work with backend developers to integrate frontend with
                      APIs • Optimize applications for maximum speed and scalability • Mentor junior developers and
                      conduct code reviews
                      <strong>Requirements:</strong>• 5+ years of experience in frontend development • Strong
                      proficiency in React, TypeScript, and JavaScript • Experience with responsive design and
                      cross-browser compatibility • Knowledge of modern frontend build pipelines and tools •
                      Understanding of server-side rendering and state management • Excellent problem-solving and
                      communication skills
                      <strong>Nice to Have:</strong>• Experience with Next.js or other React frameworks • Knowledge of
                      testing frameworks like Jest or React Testing Library • Understanding of CI/CD pipelines •
                      Experience with GraphQL
                      <strong>Benefits:</strong>• Competitive salary and equity package • Health, dental, and vision
                      insurance • Flexible work arrangements • Professional development budget • Collaborative and
                      innovative work environment
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Saved Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Frontend Developer JD</div>
                    <div className="text-xs text-muted-foreground">Created 2 days ago</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Interview Invitation</div>
                    <div className="text-xs text-muted-foreground">Created 1 week ago</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Offer Letter Template</div>
                    <div className="text-xs text-muted-foreground">Created 2 weeks ago</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">1.8k</div>
                    <div className="text-sm text-muted-foreground">JDs Created</div>
                  </div>

                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">+65%</div>
                    <div className="text-sm text-muted-foreground">Engagement</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">Most Popular Content Types</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Job Descriptions</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Email Templates</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Offer Letters</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Rejection Letters</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Be specific about job requirements to attract qualified candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Highlight your company culture and values</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Use inclusive language to attract diverse candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Personalize templates for better candidate engagement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
