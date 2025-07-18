"use client"
import Link from "next/link"
import Image from "next/image"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, MessageSquare, Search, Video, Upload, Settings } from "lucide-react"

export default function AIToolsPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Recruitment Tools</h1>
          <p className="text-muted-foreground">Powered by advanced AI to streamline your recruitment process</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Monthly Usage</span>
          <span className="font-medium text-foreground">873 / 1000</span>
          <Progress value={87.3} className="h-2 w-24" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <AIToolCard
          icon={<FileText className="h-8 w-8 text-primary" />}
          title="Resume Screening"
          description="AI-powered resume analysis to identify top candidates based on job requirements"
          stats={[
            { label: "Success Rate", value: "95%" },
            { label: "Time Saved", value: "4.2h" },
          ]}
          badge="Most Used"
          href="/ai-tools/resume-screening"
        />

        <AIToolCard
          icon={<Search className="h-8 w-8 text-primary" />}
          title="Candidate Matching"
          description="Smart matching algorithm to pair candidates with suitable job positions"
          stats={[
            { label: "Match Accuracy", value: "92%" },
            { label: "Matches/Day", value: "45" },
          ]}
          badge="New"
          href="/ai-tools/candidate-matching"
        />

        <AIToolCard
          icon={<MessageSquare className="h-8 w-8 text-primary" />}
          title="Interview Question Generator"
          description="Generate role-specific interview questions based on job requirements"
          stats={[
            { label: "Questions Generated", value: "2.4k" },
            { label: "Avg. Rating", value: "4.8/5" },
          ]}
          href="/ai-tools/interview-questions"
        />

        <AIToolCard
          icon={<FileText className="h-8 w-8 text-primary" />}
          title="Job Description Writer"
          description="Create compelling job descriptions optimized for candidate engagement"
          stats={[
            { label: "JDs Created", value: "1.8k" },
            { label: "Engagement", value: "+65%" },
          ]}
          href="/ai-tools/job-description-writer"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Performance Overview</CardTitle>
            <CardDescription>Weekly usage and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Image
                src="/images/ai-tools-dashboard.png"
                alt="AI Performance Chart"
                width={800}
                height={300}
                className="h-full w-full object-contain"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Model Selection</Label>
              <Select defaultValue="gpt4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Response Style</Label>
              <RadioGroup defaultValue="professional">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="casual" />
                  <Label htmlFor="casual">Casual</Label>
                </div>
              </RadioGroup>
            </div>

            <Button className="w-full">Configure Settings</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Button variant="outline" className="flex h-auto flex-col items-center justify-center gap-2 p-4">
                <Upload className="h-8 w-8 text-primary" />
                <span>Upload Resumes</span>
              </Button>

              <Button variant="outline" className="flex h-auto flex-col items-center justify-center gap-2 p-4">
                <Video className="h-8 w-8 text-primary" />
                <span>Start AI Interview</span>
              </Button>

              <Button variant="outline" className="flex h-auto flex-col items-center justify-center gap-2 p-4">
                <FileText className="h-8 w-8 text-primary" />
                <span>Create Job Post</span>
              </Button>

              <Button variant="outline" className="flex h-auto flex-col items-center justify-center gap-2 p-4">
                <Settings className="h-8 w-8 text-primary" />
                <span>Configure AI</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

// Helper component for AI tool cards
function AIToolCard({ icon, title, description, stats, badge, href }) {
  return (
    <Card className="relative overflow-hidden">
      {badge && (
        <div className="absolute right-0 top-0">
          <Badge className="rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none bg-primary text-primary-foreground">
            {badge}
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{icon}</div>
          <h3 className="mt-4 text-lg font-medium">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>

          <div className="mt-4 grid w-full grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <Button className="mt-6 w-full" asChild>
            <Link href={href}>Launch Tool</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
