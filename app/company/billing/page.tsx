"use client"

import Link from "next/link"
import { ChevronRight, CreditCard, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MainLayout } from "@/components/layout/main-layout"

export default function BillingPage() {
  return (
    <MainLayout>
  <div className="container mx-auto ">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/company" className="hover:text-foreground">
          Company
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Billing</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0">
              <TabsTrigger
                value="subscription"
                className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Subscription
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Payment Methods
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center justify-center gap-2 border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Billing History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>You are currently on the Business plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Business Plan</h3>
                        <p className="text-sm text-muted-foreground">$199 per month</p>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Current Plan
                      </div>
                    </div>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Up to 25 team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Unlimited job postings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Advanced AI recruitment tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Custom branding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">API access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Priority support</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button>Upgrade Plan</Button>
                      <Button variant="outline">View All Plans</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Plan Usage</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Team Members</span>
                          <span>18 / 25</span>
                        </div>
                        <Progress value={72} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>AI Credits</span>
                          <span>873 / 1000</span>
                        </div>
                        <Progress value={87} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Storage</span>
                          <span>4.2 GB / 10 GB</span>
                        </div>
                        <Progress value={42} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Your subscription will renew on <strong>June 15, 2023</strong>. You can cancel or change your plan
                    at any time.
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add-ons</CardTitle>
                  <CardDescription>Enhance your plan with additional features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Additional AI Credits</h3>
                        <p className="text-sm text-muted-foreground">Get more AI-powered recruitment capabilities</p>
                      </div>
                      <Button variant="outline">Add ($49 / 500 credits)</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Advanced Analytics</h3>
                        <p className="text-sm text-muted-foreground">Deeper insights into your recruitment process</p>
                      </div>
                      <Button variant="outline">Add ($29 / month)</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h3 className="font-medium">Additional Team Members</h3>
                        <p className="text-sm text-muted-foreground">Add more users to your account</p>
                      </div>
                      <Button variant="outline">Add ($15 / user / month)</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your payment methods</CardDescription>
                    </div>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Visa ending in 4242</h3>
                          <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Default
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Mastercard ending in 8888</h3>
                          <p className="text-sm text-muted-foreground">Expires 09/2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Make Default
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your billing details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="mb-1 text-sm font-medium">Billing Contact</h3>
                        <p className="text-sm">James Wilson</p>
                        <p className="text-sm">james.wilson@hirein.tech</p>
                        <p className="text-sm">+1 (555) 890-1234</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-sm font-medium">Billing Address</h3>
                        <p className="text-sm">HireIn Technologies</p>
                        <p className="text-sm">123 Market Street, Suite 400</p>
                        <p className="text-sm">San Francisco, CA 94105</p>
                        <p className="text-sm">United States</p>
                      </div>
                    </div>
                    <Button variant="outline">Edit Billing Information</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing History</CardTitle>
                      <CardDescription>View and download your invoices</CardDescription>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left font-medium">Invoice</th>
                          <th className="h-12 px-4 text-left font-medium">Date</th>
                          <th className="h-12 px-4 text-left font-medium">Amount</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-4">INV-001-23</td>
                          <td className="p-4">May 15, 2023</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">INV-001-22</td>
                          <td className="p-4">Apr 15, 2023</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">INV-001-21</td>
                          <td className="p-4">Mar 15, 2023</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">INV-001-20</td>
                          <td className="p-4">Feb 15, 2023</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">INV-001-19</td>
                          <td className="p-4">Jan 15, 2023</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4">INV-001-18</td>
                          <td className="p-4">Dec 15, 2022</td>
                          <td className="p-4">$199.00</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden space-y-4 md:block">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Our support team is ready to assist you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
              <Button variant="secondary" className="w-full">
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    </MainLayout>
  
  )
}
