"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"

export default function RegistrationSuccessPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-bold text-primary">HireIn</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>Welcome to HireIn! Your account has been created successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Verify Your Email Address</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We&apos;ve sent a verification link to your inbox. Please check your email and click the link to
                        verify your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Plan Details</h3>
                <div className="rounded-md border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Plan Type</span>
                    <span className="text-sm">Professional</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm font-medium">Billing</span>
                    <span className="text-sm">$299/month</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-medium">Included Features:</h4>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center gap-2 text-xs">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span>Unlimited job postings</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span>Advanced AI screening</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span>Video interviews</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Get Started
              </Button>

              <div className="text-center text-sm text-gray-500">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Return to registration page
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="8" height="8" rx="2" fill="#FF5A5A" />
      <rect x="4" y="14" width="8" height="8" rx="2" fill="#5A9CFF" />
      <rect x="4" y="24" width="8" height="8" rx="2" fill="#FFB800" />
      <rect x="14" y="4" width="18" height="28" rx="2" fill="#0CC5B9" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
