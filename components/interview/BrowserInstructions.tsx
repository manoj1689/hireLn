"use client"

import React, { JSX, useEffect, useState } from "react"
import Bowser from "bowser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Lock } from "lucide-react"
import { FiSettings, FiToggleRight, FiRefreshCw } from "react-icons/fi"

const stepIcons = [<FiSettings size={20} />, <FiToggleRight size={20} />, <FiRefreshCw size={20} />]

type InstructionCardProps = {
  image: string
  title: string
  steps: string[]
}

const InstructionCard = ({ image, title, steps }: InstructionCardProps) => (
  <Card className="bg-sky-100 border shadow-sm p-4">

        <CardTitle className="flex items-center gap-4 text-lg ">
          <img
            src={image}
            alt={`${title} instruction`}
            className="w-12  rounded"
          />
          {title}
        </CardTitle>
    
  
    <CardContent className="flex justify-around items-start pt-4  text-sm text-gray-700 leading-relaxed">
      {steps.map((step, index) => (
        <div
          key={index}
          className="relative flex w-full justify-center items-start gap-3"
        >
          <div className="flex flex-col items-center">
            {/* Step Icon */}
            <div className="bg-white shadow rounded-full p-2 text-blue-600 z-10">
              {stepIcons[index]}
            </div>

          
            {/* Step Label */}
            <div className="mt-1 w-auto text-center text-blue-400  px-4">{step}</div>
          </div>

          {/* Horizontal Line (only if not last step) */}
          {index !== steps.length - 1 && (
            <div className="absolute top-5 left-1/2 w-full h-0.5 bg-blue-400 z-0"></div>
          )}
        </div>
      ))}
    </CardContent>

  </Card>
)
const BrowserInstructions = () => {
  const [browserName, setBrowserName] = useState<string>("default")

  useEffect(() => {
    const parser = Bowser.getParser(window.navigator.userAgent)
    const name = parser.getBrowserName()
    setBrowserName(name || "default")
  }, [])

const instructions: Record<string, JSX.Element> = {
  Chrome: (
    <InstructionCard
      image="./images/instructions/chrome.png"
      title="Chrome - Enable Camera & Mic"
      steps={[
        "Click the lock icon.",
        "Allow Camera & Mic.",
        "Reload page.",
      ]}
    />
  ),
  Firefox: (
    <InstructionCard
      image="./images/instructions/firefox.png"
      title="Firefox - Enable Camera & Mic"
      steps={[
        "Click lock icon.",
        "Allow in Permissions.",
        "Reload page.",
      ]}
    />
  ),
  Safari: (
    <InstructionCard
      image="./images/instructions/safari.png"
      title="Safari - Enable Camera & Mic"
      steps={[
        "Safari > Website Settings.",
        "Allow Camera & Mic.",
        "Reload page.",
      ]}
    />
  ),
  "Microsoft Edge": (
    <InstructionCard
      image="./images/instructions/edge.png"
      title="Edge - Enable Camera & Mic"
      steps={[
        "Click lock icon.",
        "Allow Camera & Mic.",
        "Reload page.",
      ]}
    />
  ),
  default: (
    <InstructionCard
      image="./images/instructions/default.png"
      title="Enable Camera & Mic"
      steps={[
        "Click lock icon.",
        "Allow Camera & Mic.",
        "Reload page.",
      ]}
    />
  ),
}


  const current = instructions[browserName] || instructions.default

  return (
    <section className="space-y-4">
      {current}
    </section>
  )
}

export default BrowserInstructions
