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
    <div className="mb-6 flex justify-center space-x-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          onClick={() => setStep(s)}
          className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center border-2 ${s === step
            ? "border-primary bg-primary text-white font-bold"
            : "border-gray-300 text-gray-500"
            }`}
          title={s === 1 ? "Basic Info" : s === 2 ? "Company Details" : "Payment Info"}
        >
          {s}
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
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
      <div className="w-full max-w-3xl">
        <div className="text-center text-3xl font-bold text-primary mb-6">HireIn</div>

        <StepIndicator />

        <Card>
          <CardHeader>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={step1.formValues.firstName || ""} onChange={handleChange} />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={step1.formValues.lastName || ""} onChange={handleChange} />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="workEmail">Work Email</Label>
                    <Input id="workEmail" value={step1.formValues.workEmail || ""} onChange={handleChange} />
                    {errors.workEmail && <p className="text-red-500 text-sm">{errors.workEmail}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={step1.formValues.password || ""} onChange={handleChange} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={step1.formValues.confirmPassword || ""} onChange={handleChange} />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={step2.formValues.companyName || ""} onChange={handleChange} />
                    {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" value={step2.formValues.industry || ""} onChange={handleChange} />
                    {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input id="companySize" value={step2.formValues.companySize || ""} onChange={handleChange} />
                    {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize}</p>}
                  </div>
                  <div>
                    <Label htmlFor="hiringVolume">Hiring Volume</Label>
                    <Input id="hiringVolume" value={step2.formValues.hiringVolume || ""} onChange={handleChange} />
                    {errors.hiringVolume && <p className="text-red-500 text-sm">{errors.hiringVolume}</p>}
                  </div>
                  <div>
                    <Label>Primary Hiring Needs</Label>
                    <Select
                      isMulti
                      options={options}
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
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" value={step3.formValues.cardNumber || ""} onChange={handleChange} />
                    {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input id="expirationDate" placeholder="MM/YY" value={step3.formValues.expirationDate || ""} onChange={handleChange} />
                    {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" value={step3.formValues.cvv || ""} onChange={handleChange} />
                    {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                  </div>
                  <div>
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input id="billingAddress" value={step3.formValues.billingAddress || ""} onChange={handleChange} />
                    {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={step3.formValues.city || ""} onChange={handleChange} />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" value={step3.formValues.zipCode || ""} onChange={handleChange} />
                    {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
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
    </div>
  )
}
