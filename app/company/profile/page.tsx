"use client"

import {
  ChevronRight, Save
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getCompanyProfile,
  updateCompanyProfile
} from "@/lib/slices/company/company-profile";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { CompanyFormData } from "@/interface/company";
import CompanyLocationsPage from "./CompanyLocations";
import { MainLayout } from "@/components/layout/main-layout";

export default function CompanyProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error } = useSelector((state: RootState) => state.companyProfile);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    industry: "",
    description: "",
    founded: 0,
    companySize: "",
    website: "",
    email: "",
    phone: "",
    taxId: "",
    logo: "",
    coverImage: "",
    primaryColor: "#10b981",
    secondaryColor: "#3b82f6",
    careerHeadline: "",
    careerDescription: "",
    featuredImages: [],
    remoteWorkPolicy: "",
    remoteHiringRegions: [],
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  });

  useEffect(() => {
    dispatch(getCompanyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setFormData({
        ...company,
        linkedin: company.socialMedia?.linkedin ?? "",
        twitter: company.socialMedia?.twitter ?? "",
        facebook: company.socialMedia?.facebook ?? "",
        instagram: company.socialMedia?.instagram ?? "",
      });
    }
  }, [company]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (region: string) => {
    setFormData((prev) => {
      const exists = prev.remoteHiringRegions.includes(region);
      const updatedRegions = exists
        ? prev.remoteHiringRegions.filter((r) => r !== region)
        : [...prev.remoteHiringRegions, region];
      return { ...prev, remoteHiringRegions: updatedRegions };
    });
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      socialMedia: {
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        facebook: formData.facebook,
        instagram: formData.instagram,
      },
    };
    dispatch(updateCompanyProfile(payload));
  };

  return (
    <MainLayout>
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/company" className="hover:text-foreground">Company</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Profile</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information and settings</p>
      </div>

      {loading && <p>Loading company profile...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={formData.name ?? ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry ?? ""}
                    onChange={(e) => handleChange("industry", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea
                  id="company-description"
                  rows={4}
                  value={formData.description ?? ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded?.toString() ?? ""}
                    onChange={(e) => handleChange("founded", e.target.value ? Number(e.target.value) : 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Input
                    id="company-size"
                    value={formData.companySize ?? ""}
                    onChange={(e) => handleChange("companySize", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website ?? ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone ?? ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID / EIN</Label>
                  <Input
                    id="tax-id"
                    value={formData.taxId ?? ""}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your company's social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin ?? ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter ?? ""}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook ?? ""}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram ?? ""}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Set your company branding colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input
                  id="primary-color"
                  type="color"
                  value={formData.primaryColor ?? "#10b981"}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input
                  id="secondary-color"
                  type="color"
                  value={formData.secondaryColor ?? "#3b82f6"}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Branding
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Page</CardTitle>
              <CardDescription>Customize your career page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="career-headline">Headline</Label>
                <Input
                  id="career-headline"
                  value={formData.careerHeadline ?? ""}
                  onChange={(e) => handleChange("careerHeadline", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="career-description">Description</Label>
                <Textarea
                  id="career-description"
                  rows={4}
                  value={formData.careerDescription ?? ""}
                  onChange={(e) => handleChange("careerDescription", e.target.value)}
                />
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Career Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <CompanyLocationsPage />
        </TabsContent>
      </Tabs>
    </div>
    </MainLayout>

  );
}
