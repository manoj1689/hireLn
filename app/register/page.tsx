"use client";
import { useState } from "react";
import Select from "react-select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { createCompanyProfile } from "@/lib/slices/company/company-profile";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/store";
import { CompanyRequest } from "@/interface/company";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/lib/slices/auth-slice";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function CompanyRegistration() {
  const [formData, setFormData] = useState<CompanyRequest>({
    name: "",
    description: "",
    industry: "",
    founded: 2000,
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
    featuredImages: [{ url: "", caption: "" }],
    socialMedia: { linkedin: "", twitter: "", facebook: "", instagram: "" },
    remoteWorkPolicy: "",
    remoteHiringRegions: [],
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const companySizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" },
  ];

  const requiredFields = [
    "name",
    "description",
    "companySize",
    "website",
    "email",
    "phone",
  ];

  // -------------------------------
  // VALIDATION FUNCTION
  // -------------------------------
  const validateForm = () => {
    for (let field of requiredFields) {
      if (!formData[field as keyof CompanyRequest]?.trim()) {
        toast.error(`❗ ${field.replace(/([A-Z])/g, " $1")} is required`);
        return false;
      }
    }

    if (formData.website && !formData.website.startsWith("http")) {
      toast.error("❗ Website must start with http or https");
      return false;
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selected: any) => {
    setFormData({ ...formData, companySize: selected.value });
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
  };

  // -------------------------------------
  // SUBMIT
  // -------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: Partial<CompanyRequest> = {
      ...formData,
      founded: formData.founded || undefined,
    };

    try {
      const resultAction = await dispatch(createCompanyProfile(payload));

      if (createCompanyProfile.fulfilled.match(resultAction)) {
        toast.success("🎉 Company registered successfully!");
        router.push("/dashboard");
      } else {
        toast.error(
          resultAction.payload || "❌ Failed to create company profile"
        );
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.error("Error creating company:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 to-sky-400 items-center">
      <ToastContainer/>
      {/* Header */}
      <header className="w-full container mx-auto flex justify-between items-center p-4">
        <div className="lg:w-1/4 px-4">
          <img
            src="../images/logo/company-logo.png"
            alt="Company Logo"
            className="w-32"
          />
        </div>
        <Button
          className="flex items-center bg-transparent gap-4 hover:scale-105 hover:bg-blue-400 hover:rounded-lg"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={18} className="text-white" />
          <span className="text-white ">Logout</span>
        </Button>
      </header>

      <section className="container mx-auto flex flex-col md:flex-row justify-end h-full gap-8 pt-24">
        {/* Left Side – Full Page Height */}
        <div className="hidden lg:flex w-1/2 h-screen rounded-tr-3xl">
          <div className="relative flex text-center w-full h-full">
            <img
              src="./images/profiles/business-woman.png"
              alt="business-woman"
              className="w-full h-full object-cover rounded-tr-3xl"
            />
            <div className="absolute inset-0 flex flex-col justify-end text-white bg-black/10 rounded-tr-3xl">
              <div>
                <div className="flex justify-start">
                  <div className="w-3/5 bg-orange-400 text-left rounded-tr-3xl p-4">
                    <h3 className="text-4xl font-semibold drop-shadow-md">
                      Build Your Company’s Hiring Edge
                    </h3>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-2/5 bg-white text-right rounded-bl-3xl p-4">
                    <p className="text-lg font-medium opacity-90 text-neutral-600 drop-shadow-sm">
                      Interview and hire efficiently with AI precision
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-1/2 flex bg-white shadow-lg rounded-2xl p-8 justify-center h-auto">
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Company Registration
            </h2>

            <div className="flex flex-col gap-6">
              {/* Company Name + Size */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border outline-none  rounded-lg p-2 border-gray-300"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Company Size *
                  </label>
                  <Select
                    options={companySizeOptions}
                    onChange={handleSelectChange}
                    placeholder="Select company size"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Founded + Website */}
              <div className="flex flex-col lg:flex-row gap-6 mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Founded
                  </label>
                  <input
                    type="number"
                    name="founded"
                    value={formData.founded || ""}
                    onChange={handleChange}
                    className="w-full border outline-none  rounded-lg p-2 border-gray-300"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Website *
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full border outline-none  rounded-lg p-2 border-gray-300"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="flex flex-col xl:flex-row gap-6 mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border outline-none  rounded-lg p-2 border-gray-300"
                    placeholder="example@company.com"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <PhoneInput
                    defaultCountry="in"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border outline-none rounded-lg p-2 border-gray-300 h-[100px]"
                  placeholder="Short company description"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full text-white py-2 rounded-lg"
              >
                Register Company
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
