"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

import {
  fetchUserSettings,
  updateEmailSettings,
  updateGeneralSettings,
  updateNotificationSettings,
} from "@/lib/slices/settings/settings-slice"
import { UserSettings } from "@/interface/setting"
import { ChevronRight, Bell, Globe, HelpCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { toast, ToastContainer } from "react-toastify" // ✅ Add this
import { MainLayout } from "@/components/layout/main-layout"
export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>()

  const [activeTab, setActiveTab] = useState("general")


  const { data: settings } = useSelector((state: RootState) => state.setting)

  const [formData, setFormData] = useState<UserSettings | null>(null)

  useEffect(() => {
    dispatch(fetchUserSettings())
  }, [dispatch])

  useEffect(() => {
    if (settings) setFormData(settings)
  }, [settings])

  const handleChange = (field: string, value: any) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
  }

  const saveGeneralSettings = async () => {
    if (!formData) return
    try {
      await dispatch(updateGeneralSettings({
        language: formData.language,
        timezone: formData.timezone,
        dateFormat: formData.dateFormat,
        autoSave: formData.autoSave,
      })).unwrap()
      toast.success("General settings updated!")
    } catch (err) {
      toast.error("Failed to update general settings")
    }
  }

  const saveEmailSettings = async () => {
    if (!formData) return
    try {
      await dispatch(updateEmailSettings({
        emailDailyDigest: formData.emailDailyDigest,
        emailNewCandidateAlerts: formData.emailNewCandidateAlerts,
        emailMarketingEmails: formData.emailMarketingEmails,
      })).unwrap()
      toast.success("Email settings updated!")
    } catch (err) {
      toast.error("Failed to update email settings")
    }
  }

  const saveNotificationSettings = async () => {
    if (!formData) return
    try {
      await dispatch(updateNotificationSettings({
        emailNewApplications: formData.emailNewApplications,
        pushNewApplications: formData.pushNewApplications,
        emailInterviewReminders: formData.emailInterviewReminders,
        pushInterviewReminders: formData.pushInterviewReminders,
        emailTaskDeadlines: formData.emailTaskDeadlines,
        pushTaskDeadlines: formData.pushTaskDeadlines,
        emailProductUpdates: formData.emailProductUpdates,
        pushProductUpdates: formData.pushProductUpdates,
        emailSecurityAlerts: formData.emailSecurityAlerts,
        pushSecurityAlerts: formData.pushSecurityAlerts,
      })).unwrap()
      toast.success("Notification settings updated!")
    } catch (err) {
      toast.error("Failed to update notification settings")
    }
  }

  const toggleSwitch = (field: keyof UserSettings) => {
    if (!formData) return
    setFormData({ ...formData, [field]: !formData[field] })
  }

  if (!formData) return <div className="p-4">Loading settings...</div>

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <ToastContainer position="top-right" autoClose={3000} />


        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> Help & Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your general account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(val) => handleChange("language", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(val) => handleChange("timezone", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="UTC+5:30">UTC+5:30 (India)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <RadioGroup
                    value={formData.dateFormat}
                    onValueChange={(val) => handleChange("dateFormat", val)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MM/DD/YYYY" id="mm-dd" />
                      <Label htmlFor="mm-dd">MM/DD/YYYY</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DD/MM/YYYY" id="dd-mm" />
                      <Label htmlFor="dd-mm">DD/MM/YYYY</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto Save</Label>
                  <Switch
                    checked={formData.autoSave}
                    onCheckedChange={() => toggleSwitch("autoSave")}
                  />
                </div>
                <Button onClick={saveGeneralSettings}>Save</Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Manage your email preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Daily Digest", key: "emailDailyDigest" },
                  { label: "New Candidate Alerts", key: "emailNewCandidateAlerts" },
                  { label: "Marketing Emails", key: "emailMarketingEmails" },
                ].map(({ label, key }) => (
                  <div className="flex items-center justify-between" key={key}>
                    <Label>{label}</Label>
                    <Switch
                      checked={formData[key as keyof UserSettings] as boolean}
                      onCheckedChange={() => toggleSwitch(key as keyof UserSettings)}
                    />
                  </div>
                ))}
                <Button onClick={saveEmailSettings}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "New Applications", email: "emailNewApplications", push: "pushNewApplications" },
                  { label: "Interview Reminders", email: "emailInterviewReminders", push: "pushInterviewReminders" },
                  { label: "Task Deadlines", email: "emailTaskDeadlines", push: "pushTaskDeadlines" },
                  { label: "Product Updates", email: "emailProductUpdates", push: "pushProductUpdates" },
                  { label: "Security Alerts", email: "emailSecurityAlerts", push: "pushSecurityAlerts" },
                ].map(({ label, email, push }) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={formData[email as keyof UserSettings] as boolean}
                          onCheckedChange={() => toggleSwitch(email as keyof UserSettings)}
                        />
                        <Label className="text-xs">Email</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={formData[push as keyof UserSettings] as boolean}
                          onCheckedChange={() => toggleSwitch(push as keyof UserSettings)}
                        />
                        <Label className="text-xs">Push</Label>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={saveNotificationSettings}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </MainLayout>

  )
}
