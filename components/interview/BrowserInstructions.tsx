"use client"

import React, { JSX, useEffect, useState } from "react"
import { parse } from "bowser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mic, Lock } from "lucide-react"

const BrowserInstructions = () => {
  const [browserName, setBrowserName] = useState("default")

  useEffect(() => {
    const browser = parse(window.navigator.userAgent)
    setBrowserName(browser.browser.name || "default")
  }, [])

  const InstructionCard = ({
    title,
    steps,
  }: {
    title: string
    steps: string[]
  }) => (
    <Card className="bg-white border shadow-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 text-lg items-center text-blue-600">
          <Lock size={30} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700 leading-relaxed">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-blue-500 font-medium">{index + 1}.</span>
            <span>{step}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const instructions: Record<string, JSX.Element> = {
    Chrome: (
      <InstructionCard
        title="Chrome - Allow Camera & Mic"
        steps={[
          "Click the lock icon next to the URL bar.",
          "Choose 'Site Settings'.",
          "Set Camera and Microphone to 'Allow'.",
          "Reload the page.",
        ]}
      />
    ),
    Firefox: (
      <InstructionCard
        title="Firefox - Enable Permissions"
        steps={[
          "Click the lock icon near the URL.",
          "Click 'More Information' > 'Permissions'.",
          "Set Camera and Microphone to 'Allow'.",
          "Reload the page.",
        ]}
      />
    ),
    Safari: (
      <InstructionCard
        title="Safari - Allow Camera & Mic"
        steps={[
          "Click Safari in the menu bar > 'Settings for This Website'.",
          "Choose 'Allow' for Camera and Microphone.",
          "Reload the page.",
        ]}
      />
    ),
    "Microsoft Edge": (
      <InstructionCard
        title="Edge - Enable Permissions"
        steps={[
          "Click the lock icon next to the URL.",
          "Click 'Permissions for this site'.",
          "Allow Camera and Microphone.",
          "Reload the page.",
        ]}
      />
    ),
    default: (
      <InstructionCard
        title="General Instructions"
        steps={[
          "Locate the lock icon in the address bar.",
          "Open site settings or permissions.",
          "Allow Camera and Microphone access.",
          "Reload the page after allowing.",
        ]}
      />
    ),
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 flex gap-2 items-center">
        <Camera className="w-5 h-5 text-blue-600" />
        Camera & Mic Setup Guide
      </h2>
      {instructions[browserName] || instructions.default}
    </section>
  )
}

export default BrowserInstructions
