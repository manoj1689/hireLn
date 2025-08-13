"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { updateStep1Form, registerStep1 } from "@/lib/slices/register/register-step-1"
import { updateStep2Form, registerStep2 } from "@/lib/slices/register/register-step-2"
import { updateStep3Form, registerStep3 } from "@/lib/slices/register/register-step-3"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Select from "react-select"
import { ToastContainer, toast } from 'react-toastify';
import AuthNavbar from "@/components/auth-navbar/page"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Mail, Lock, User } from "lucide-react";
import { FiBriefcase, FiGrid, FiUsers, FiTrendingUp, FiClipboard } from "react-icons/fi";
import { FiCreditCard, FiCalendar, FiLock, FiMapPin, FiHome } from "react-icons/fi"

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const step1 = useSelector((state: RootState) => state.registerStep1)
  const step2 = useSelector((state: RootState) => state.registerStep2)
  const step3 = useSelector((state: RootState) => state.registerStep3)

  const options = [
    { label: "Engineers", value: "engineers" },
    { label: "Designers", value: "designers" },
    { label: "Managers", value: "managers" },
    { label: "Sales", value: "sales" },
  ];


  useEffect(() => {
    const showToast = (msg: string, type: "success" | "error") => {
      toast[type](msg, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    };

    if (step === 1) {
      if (step1.error) showToast(step1.error, "error");
      else if (step1.successMessage) showToast(step1.successMessage, "success");
    }

    if (step === 2) {
      if (step2.error) showToast(step2.error, "error");
      else if (step2.successMessage && !step1.error) showToast(step2.successMessage, "success");
    }

    if (step === 3) {
      if (step3.error) showToast(step3.error, "error");
      else if (step3.successMessage && !step1.error && !step2.error) {
        showToast(step3.successMessage, "success");
      }
    }
  }, [step1.error, step1.successMessage, step2.error, step2.successMessage, step3.error, step3.successMessage, step]);

  console.log("step-2 msg", step2)
  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {

      if (!step1.formValues.firstName) newErrors.firstName = "First name is required"
      if (!step1.formValues.lastName) newErrors.lastName = "Last name is required"
      if (!step1.formValues.workEmail) newErrors.workEmail = "Email is required"
      if (!step1.formValues.password) newErrors.password = "Password is required"
      if (step1.formValues.password !== step1.formValues.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (step === 2) {
      if (!step2.formValues.companyName) newErrors.companyName = "Company name is required"
      if (!step2.formValues.industry) newErrors.industry = "Industry is required"
      if (!step2.formValues.companySize) newErrors.companySize = "Company size is required"
      if (!step2.formValues.hiringVolume) newErrors.hiringVolume = "Hiring volume is required"
      if (!step2.formValues.primaryHiringNeeds || step2.formValues.primaryHiringNeeds.length === 0)
        newErrors.primaryHiringNeeds = "Select at least one hiring need"
    }

    if (step === 3) {
      if (!step3.formValues.cardNumber) newErrors.cardNumber = "Card number is required"
      if (!step3.formValues.expirationDate) newErrors.expirationDate = "Expiration date is required"
      if (!step3.formValues.cvv) newErrors.cvv = "CVV is required"
      if (!step3.formValues.billingAddress) newErrors.billingAddress = "Billing address is required"
      if (!step3.formValues.city) newErrors.city = "City is required"
      if (!step3.formValues.zipCode) newErrors.zipCode = "Zip code is required"
      if (!step3.formValues.termsAgreement) newErrors.termsAgreement = "You must agree to the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: any) => {
    const { id, value, checked, type } = e.target
    const payload: any = { [id]: type === "checkbox" ? checked : value }

    if (step === 1) dispatch(updateStep1Form(payload))
    else if (step === 2) dispatch(updateStep2Form(payload))
    else if (step === 3) dispatch(updateStep3Form(payload))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      if (step === 1) {
        const result = await dispatch(registerStep1(step1.formValues) as any)
        if (registerStep1.fulfilled.match(result)) setStep(2)
      } else if (step === 2) {
        const result = await dispatch(registerStep2({ ...step2.formValues, sessionId: step1.sessionId }) as any)
        if (registerStep2.fulfilled.match(result)) setStep(3)
      } else if (step === 3) {
        const result = await dispatch(registerStep3({ ...step3.formValues, sessionId: step1.sessionId }) as any)
        console.log("result after 3 dispatch",result)
        if (registerStep3.fulfilled.match(result)) router.push("/auth/registration-success")
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Simple Step Indicator UI
  const StepIndicator = () => (
    <div className=" flex justify-center">
      <div className="relative w-full max-w-xl px-4 flex items-center justify-between">

        {/* Horizontal connecting line */}
        <div className="absolute top-1/4 left-0 right-0 h-0.5 text-primary-foreground bg-gray-300 z-0" />

        {[1, 2, 3].map((s, index) => (
          <div key={s} className="flex flex-col justify-center items-center">
            <div
              key={s}
              onClick={() => setStep(s)}
              className={`z-10 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center border-2
            ${s === step
                  ? "border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white font-bold"
                  : "border-gray-300 text-gray-500 bg-white"
                }`}
              title={s === 1 ? "Basic Info" : s === 2 ? "Company Details" : "Payment Info"}
            >
              {s}
            </div>
            <div className=" text-xs text-center text-muted-foreground">
              <div className="mt-4">{s === 1 ? "Basic Info" : s === 2 ? "Company Details" : "Payment Info"}</div>

            </div>
          </div>

        ))}
      </div>
    </div>
  );


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

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="w-full  border-8  bg-white max-w-4xl shadow-lg rounded-3xl overflow-hidden ">

          <div className="mt-4 space-y-4">
            <div className="text-center text-2xl lg:text-3xl">
              Registration
            </div>
            <div>
              <StepIndicator />
            </div>

          </div>


          <Card className="border-none">
            <CardHeader className="flex w-full items-center">
              <CardTitle>
                {step === 1 && "Basic Information"}
                {step === 2 && "Company Details"}
                {step === 3 && "Payment Information"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Please provide your account details"}
                {step === 2 && "Tell us about your organization"}
                {step === 3 && "Set up your payment method for after trial"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-4 ">
                {step === 1 && (
                  <>
                    <div className="flex w-full flex-col md:flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={step1.formValues.firstName || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-2 w-full">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            value={step1.formValues.lastName || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 w-full mt-4">
                      <Label htmlFor="workEmail">Work Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="workEmail"
                          placeholder="Enter your work email"
                          value={step1.formValues.workEmail || ""}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                      {errors.workEmail && <p className="text-red-500 text-sm">{errors.workEmail}</p>}
                    </div>

                    <div className="flex w-full flex-col md:flex-row gap-4 mt-4">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={step1.formValues.password || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                      </div>

                      <div className="space-y-2 w-full">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={step1.formValues.confirmPassword || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex w-full flex-col md:flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="companyName">Company Name</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiBriefcase />
                          </span>
                          <Input
                            id="companyName"
                            placeholder="e.g., MobiRizer Pvt. Ltd."
                            value={step2.formValues.companyName || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                      </div>

                      <div className="space-y-2 w-full">
                        <Label htmlFor="industry">Industry</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiGrid />
                          </span>
                          <Input
                            id="industry"
                            placeholder="e.g., Software Development"
                            value={step2.formValues.industry || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Primary Hiring Needs</Label>
                      <Select
                        isMulti
                        options={options}
                        placeholder="Select primary roles you are hiring for"
                        value={(step2.formValues.primaryHiringNeeds || []).map((val: string) =>
                          options.find((opt) => opt.value === val) || { label: val, value: val }
                        )}
                        onChange={(selectedOptions) => {
                          dispatch(
                            updateStep2Form({
                              primaryHiringNeeds: selectedOptions.map((opt) => opt.value),
                            })
                          );
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                      {errors.primaryHiringNeeds && <p className="text-red-500 text-sm">{errors.primaryHiringNeeds}</p>}
                    </div>

                    <div className="flex w-full flex-col md:flex-row gap-4 mt-4">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="companySize">Company Size</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiUsers />
                          </span>
                          <Input
                            id="companySize"
                            placeholder="e.g., 50-100 employees"
                            value={step2.formValues.companySize || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize}</p>}
                      </div>

                      <div className="space-y-2 w-full">
                        <Label htmlFor="hiringVolume">Hiring Volume</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiTrendingUp />
                          </span>
                          <Input
                            id="hiringVolume"
                            placeholder="e.g., 10-20 candidates per month"
                            value={step2.formValues.hiringVolume || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                        {errors.hiringVolume && <p className="text-red-500 text-sm">{errors.hiringVolume}</p>}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    {/* Card Number + Expiration */}
                    <div className="flex w-full flex-col md:flex-row gap-4 mt-4">
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={step3.formValues.cardNumber || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiCreditCard className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                      </div>
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="expirationDate">Expiration Date</Label>
                        <div className="relative">
                          <Input
                            id="expirationDate"
                            placeholder="MM/YY"
                            value={step3.formValues.expirationDate || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate}</p>}
                      </div>
                    </div>

                    {/* CVV + Billing Address */}
                    <div className="flex w-full flex-col md:flex-row gap-4 mt-4">
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={step3.formValues.cvv || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                      </div>
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <div className="relative">
                          <Input
                            id="billingAddress"
                            placeholder="123 Street Name"
                            value={step3.formValues.billingAddress || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiHome className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress}</p>}
                      </div>
                    </div>

                    {/* City + Zip Code */}
                    <div className="flex w-full flex-col md:flex-row gap-4 mt-4">
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="city">City</Label>
                        <div className="relative">
                          <Input
                            id="city"
                            placeholder="Mumbai"
                            value={step3.formValues.city || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                      </div>
                      <div className="space-y-2 w-full relative">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <div className="relative">
                          <Input
                            id="zipCode"
                            placeholder="400001"
                            value={step3.formValues.zipCode || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-center space-x-2 mt-4">
                      <input
                        type="checkbox"
                        id="termsAgreement"
                        checked={step3.formValues.termsAgreement || false}
                        onChange={handleChange}
                      />
                      <Label htmlFor="termsAgreement">I agree to the Terms and Conditions</Label>
                    </div>
                    {errors.termsAgreement && <p className="text-red-500 text-sm">{errors.termsAgreement}</p>}
                  </>
                )}
                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setErrors({})
                        setStep(step - 1)
                      }}
                      disabled={loading}
                    >
                      Previous
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    {step === 3 ? "Submit" : "Next"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
        </div>
         <div className="flex gap-2 mt-4 lg:mt-8 text-center font-light text-sm lg:text-md items-center">
                  Already! have an account?{" "}
                  <Link href="/auth/login" className="text-white text-md lg:text-lg hover:underline">
                    Sign In
                  </Link>
                </div>
      </div>

    </>

  )
}
