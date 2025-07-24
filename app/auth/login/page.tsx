"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from 'react-redux';
import { login } from "@/lib/slices/login-slice" // path to your login thunk
import { MdOutlineEmail, MdLockOutline} from "react-icons/md";
import { SlEnvolope } from "react-icons/sl";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppDispatch } from "@/lib/store"
import AuthNavbar from "@/components/auth-navbar/page"
import { FaArrowLeft } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Dispatch the async thunk and unwrap the result to catch errors
      await dispatch(login({ email, password })).unwrap()
      router.push("/dashboard")
    } catch (err: any) {
      setError(err || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <AuthNavbar />
      </div>
      <div className="flex flex-col  min-h-screen items-center  bg-gradient-to-r from-[#63A7D4] to-[#F295BE] px-4 ">
       <div className="flex container  pt-24 py-12  w-full">
              <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white text-sm font-medium hover:underline"
            >
              <FaArrowLeft /> back to home
            </button>
        </div>
        
        <div className="flex flex-col md:flex-row w-full container lg:max-w-5xl 2xl:max-w-6xl border-8  bg-white shadow-lg rounded-3xl overflow-hidden">

          {/* Left Side Image */}
          <div className="hidden md:flex w-1/2  ">
            <img
              src="../images/auth/hiring.webp"
              alt="Hiring By AI"
              className="object-contain h-auto "
            />
          </div>

          {/* Right Side Form */}
          <div className="flex w-full md:w-1/2 h-auto ">
            <div className="shadow-none border-none  m-auto  ">
              <CardHeader>
                <CardTitle className="text-center text-2xl lg:text-3xl">Welcome Back</CardTitle>
                <CardDescription className="font-medium lg:text-md mt-4 text-center">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4  lg:space-y-8">

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-normal">Email</Label>
                    <div className="relative">
                      <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10" // Padding-left for the icon
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="font-normal">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm font-light text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10" // Padding-left for the icon
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-4 lg:mt-8 text-center font-light text-sm lg:text-md">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </div>
              </CardContent>
            </div>
          </div>
        </div>


      </div>
    </>

  )
}


