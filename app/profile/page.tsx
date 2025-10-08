"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/lib/slices/profile/profile-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FiEdit2, FiSave } from "react-icons/fi";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <MainLayout>
      {profile && (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="relative h-40 bg-primary-gradient ">
              <div className="absolute -bottom-12 left-8 flex items-center">
                <img
                  src={
                    profile.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(profile.firstName + " " + profile.lastName)
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="ml-4 bg-sky-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Role: {formData.role}</p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={toggleEdit}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                title={isEditing ? "Save Changes" : "Edit Profile"}
              >
                {isEditing ? (
                  <FiSave className="text-blue-600 text-lg" />
                ) : (
                  <FiEdit2 className="text-gray-600 text-lg" />
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="pt-20 px-8 pb-8">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-gray-100 rounded-lg p-1 flex justify-start mb-6">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="company"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    Company Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="hiring"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    Hiring Preferences
                  </TabsTrigger>
                </TabsList>

                {/* Personal Info */}
                <TabsContent value="personal">
                  <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      {[
                        { label: "Full Name", key: "name", value: `${formData.firstName || ""} ${formData.lastName || ""}` },
                        { label: "Email", key: "email", value: formData.email },
                        { label: "Role", key: "role", value: formData.role },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                          <input
                            type="text"
                            value={field.value}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-gray-700 transition ${
                              isEditing
                                ? "border-blue-400 bg-white focus:outline-blue-500"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Company Info */}
                <TabsContent value="company">
                  <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      {[
                        { label: "Company Name", key: "companyName" },
                        { label: "Company Size", key: "companySize" },
                        { label: "Industry", key: "industry" },
                        { label: "Hiring Volume", key: "hiringVolume" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                          <input
                            type="text"
                            value={formData[field.key] || ""}
                            readOnly={!isEditing}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-gray-700 transition ${
                              isEditing
                                ? "border-blue-400 bg-white focus:outline-blue-500"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Hiring Preferences */}
                <TabsContent value="hiring">
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-gray-700 font-semibold mb-3">Primary Hiring Needs</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.primaryHiringNeeds?.map((need: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="text-xs text-gray-400 mt-6 text-center">
                Joined: {new Date(profile.createdAt).toLocaleDateString()} | Last updated:{" "}
                {new Date(profile.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
