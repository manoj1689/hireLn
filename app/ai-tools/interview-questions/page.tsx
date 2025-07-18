"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function InterviewQuestionsPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Question Generator</h1>
          <p className="text-muted-foreground">Generate role-specific interview questions based on job requirements</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/ai-tools">Back to AI Tools</Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate Interview Questions</CardTitle>
              <CardDescription>Create tailored questions for specific roles and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Job Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Senior Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Engineer</SelectItem>
                      <SelectItem value="product">Product Manager</SelectItem>
                      <SelectItem value="design">UX Designer</SelectItem>
                      <SelectItem value="marketing">Marketing Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <Select defaultValue="technical">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Skills</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="cultural">Cultural Fit</SelectItem>
                      <SelectItem value="problem-solving">Problem Solving</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Key Skills to Assess</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>State Management</Badge>
                    <Badge>API Integration</Badge>
                    <Badge className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      Add Skill
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select defaultValue="senior">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead/Manager (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Context (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific requirements or context for the role..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="w-full">Generate Questions</Button>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Generated Questions</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Copy All
                      </Button>
                      <Button variant="outline" size="sm">
                        Save Template
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {generatedQuestions.map((question, index) => (
                      <div key={index} className="rounded-md border p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5 h-6 min-w-[24px]">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-medium">{question.question}</div>
                              {question.hint && (
                                <div className="mt-2 text-sm text-muted-foreground">{question.hint}</div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate More Questions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Saved Question Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-3">
                  <div className="font-medium">Frontend Developer Technical</div>
                  <div className="mt-1 text-xs text-muted-foreground">15 questions • Created 2 days ago</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Use
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="font-medium">Product Manager Behavioral</div>
                  <div className="mt-1 text-xs text-muted-foreground">12 questions • Created 1 week ago</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Use
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="font-medium">Leadership Assessment</div>
                  <div className="mt-1 text-xs text-muted-foreground">10 questions • Created 2 weeks ago</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Use
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Question Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">2.4k</div>
                    <div className="text-sm text-muted-foreground">Questions Generated</div>
                  </div>

                  <div className="rounded-md border p-3 text-center">
                    <div className="text-2xl font-bold">4.8/5</div>
                    <div className="text-sm text-muted-foreground">Avg. Rating</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">Most Popular Categories</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Technical Skills</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Behavioral</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Problem Solving</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Cultural Fit</span>
                      <span className="font-medium">12%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Get Feedback</span>
                  </Button>
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
const generatedQuestions = [
  {
    question: "Explain the difference between controlled and uncontrolled components in React.",
    hint: "Look for understanding of state management and form handling in React.",
  },
  {
    question:
      "How do you handle state management in large React applications? What libraries or patterns do you prefer?",
    hint: "Assess knowledge of Redux, Context API, or other state management solutions.",
  },
  {
    question: "Describe your experience with TypeScript. How has it improved your development process?",
    hint: "Look for practical experience with TypeScript and understanding of its benefits.",
  },
  {
    question: "How do you approach performance optimization in React applications?",
    hint: "Check for knowledge of React.memo, useMemo, useCallback, code splitting, etc.",
  },
  {
    question: "Can you explain how you would implement server-side rendering with Next.js?",
    hint: "Assess understanding of SSR, getServerSideProps, and Next.js architecture.",
  },
]
