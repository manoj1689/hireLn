"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchJobById, updateJob } from "@/lib/slices/job/jobsList-slice"
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal"
import "react-responsive-modal/styles.css"
import Select from "react-select"
import { Button } from "@/components/ui/button"
import { Pencil, MapPin, Layers, Brain, PlusCircle } from "lucide-react"
import { IoCloseOutline } from "react-icons/io5"

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
]

const employmentOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERN', label: 'Internship' },
]

const educationOptions = [
  { label: "High School", value: "High School" },
  { label: "Associate's Degree", value: "Associate's Degree" },
  { label: "Bachelor's Degree", value: "Bachelor's Degree" },
  { label: "Master's Degree", value: "Master's Degree" },
  { label: "PhD", value: "PhD" },
  { label: "No specific requirement", value: "None" },
]

export default function EditJobModal({ jobId, openModal, closeModal }: any) {
  const [jobData, setJobData] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    title: "",
    location: "",
    description: "",
    experience: "",
    education: "Bachelor's Degree", // ✅ Default education
    department: "engineering", // ✅ Default department
    employmentType: "FULL_TIME",
    skills: [],
    softSkills: [],
  })
  const [errors, setErrors] = useState<any>({})
  const [newSkill, setNewSkill] = useState("")
  const [newSoftSkill, setNewSoftSkill] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId)).then((data) => {
        const fetched = data.payload
        setJobData(fetched)
        setFormData({
          ...formData,
          ...fetched,
          education: fetched.education || "Bachelor's Degree",
          department: fetched.department || "engineering",
        })
      })
    }
  }, [jobId, dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSelectChange = (selectedOption: any, name: string) => {
    setFormData({
      ...formData,
      [name]: selectedOption?.value || "",
    })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors: any = {}
    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.experience.trim()) newErrors.experience = "Experience is required"
    if (!formData.education) newErrors.education = "Education is required"
    if (!formData.department) newErrors.department = "Department is required"
    return newErrors
  }

  const handleSubmit = () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (jobId && formData) {
      dispatch(updateJob({ jobId, updatedJob: formData }))
        .then(() => closeModal())
        .catch((err) => console.error("Failed to update job", err))
    }
  }

  const removeItem = (key: "skills" | "softSkills", index: number) => {
    const updated = [...formData[key]]
    updated.splice(index, 1)
    setFormData({ ...formData, [key]: updated })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...(formData.skills || []), newSkill.trim()] })
      setNewSkill("")
    }
  }

  const addSoftSkill = () => {
    if (newSoftSkill.trim()) {
      setFormData({ ...formData, softSkills: [...(formData.softSkills || []), newSoftSkill.trim()] })
      setNewSoftSkill("")
    }
  }

  return (
    <Modal open={openModal} onClose={closeModal} center classNames={{ modal: 'w-full max-w-5xl mx-auto rounded-lg p-6' }}>
      <h2 className="text-xl font-bold mb-6 text-center">Edit Job Details</h2>
      {formData ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="flex items-center gap-2"><Pencil size={16} /> Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="flex items-center gap-2"><MapPin size={16} /> Location</label>
              <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-2 rounded" />
              {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
            </div>

            {/* Description */}
            <div className="lg:col-span-2 space-y-1">
              <label className="flex items-center gap-2"><Layers size={16} /> Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" rows={4} />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label>Experience</label>
              <input name="experience" value={formData.experience} onChange={handleInputChange} className="w-full border p-2 rounded" />
              {errors.experience && <p className="text-red-500 text-xs">{errors.experience}</p>}
            </div>

            {/* Education */}
            <div className="space-y-1">
              <label>Education</label>
              <Select
                options={educationOptions}
                value={educationOptions.find(opt => opt.value === formData.education)}
                onChange={(opt) => handleSelectChange(opt, 'education')}
              />
              {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label>Department</label>
              <Select
                options={departmentOptions}
                value={departmentOptions.find(opt => opt.value === formData.department)}
                onChange={(opt) => handleSelectChange(opt, 'department')}
              />
              {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
            </div>

            {/* Employment Type */}
            <div className="space-y-1">
              <label>Employment Type</label>
              <Select
                options={employmentOptions}
                value={employmentOptions.find(opt => opt.value === formData.employmentType)}
                onChange={(opt) => handleSelectChange(opt, 'employmentType')}
              />
            </div>

            {/* Skills */}
            <div className="lg:col-span-2 space-y-2">
              <label className="flex items-center gap-2"><Brain size={16} /> Skills</label>
              <div className="flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill..."
                  className="border p-2 rounded w-full"
                />
                <Button type="button" variant="default" onClick={addSkill}>
                  <PlusCircle size={16} className="mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {formData.skills?.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-xs font-normal flex items-center gap-1 bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button type="button" onClick={() => removeItem("skills", idx)}>
                      <IoCloseOutline size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2"><Brain size={16} /> Soft Skills</label>
              <div className="flex gap-2">
                <input
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  placeholder="Add soft skill..."
                  className="border p-2 rounded w-full"
                />
                <Button type="button" variant="default" onClick={addSoftSkill}>
                  <PlusCircle size={16} className="mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {formData.softSkills?.map((softSkill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-xs font-normal flex items-center gap-1 bg-green-100 text-green-800"
                  >
                    {softSkill}
                    <button type="button" onClick={() => removeItem("softSkills", idx)}>
                      <IoCloseOutline size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 mt-6">
              <Button type="submit" variant="default">Save Changes</Button>
            </div>
          </div>
        </form>
      ) : (
        <p>Loading job data...</p>
      )}
    </Modal>
  )
}
