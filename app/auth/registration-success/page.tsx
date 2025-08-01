"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import AuthNavbar from "@/components/auth-navbar/page"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
 

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const step3 = useSelector((state: RootState) => state.registerStep3)
  console.log("step3 data",step3)
  return (<>
    <div>
      <AuthNavbar />
    </div>
    <div className="flex flex-col  min-h-screen items-center  bg-gradient-to-r from-[#63A7D4] to-[#F295BE] px-4 gap-8">
       <div className="flex container  pt-24 py-12  w-full">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white text-sm font-medium hover:underline"
        >
          <FaArrowLeft /> back to home
        </button>
      </div>

      <Card className=" border-8  bg-white shadow-lg rounded-3xl ">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-medium">Registration Successful!</CardTitle>
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
              <h3 className="text-lg font-medium">Selected Plan Details</h3>

              <div className="rounded-lg border ">
                <div className="bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white p-4 rounded-t-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Plan Type</span>
                    <span className="text-sm">Professional</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm font-medium">Billing</span>
                    <span className="text-sm">$299/month</span>
                  </div>
                </div>

                <div className=" p-4">
                  <h4 className="text-sm font-medium">Included Features:</h4>
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Unlimited job postings</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Advanced AI screening</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Video interviews</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
            <div className="flex w-full justify-center">
              <Button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
                Get Started
                <FaArrowRight className="w-4 h-4" />
              </Button>
            </div>


            <div className="text-center text-sm font-light text-gray-500">
              <Link href="/auth/login" className="text-primary hover:underline">
                Return to registration page
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  </>


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
