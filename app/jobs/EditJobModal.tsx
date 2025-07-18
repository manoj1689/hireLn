"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchJobById, updateJob } from "@/lib/slices/job/jobsList-slice"
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal"
import "react-responsive-modal/styles.css"
import Select from "react-select"
import { Button } from "@/components/ui/button"

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

const employmentOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERN', label: 'Internship' },
];

const salaryPeriodOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'hourly', label: 'Hourly' },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'CLOSED', label: 'Closed' },
];

const languageOptions = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
];

const educationOptions = [
  { label: "High School", value: "High School" },
  { label: "Associate's Degree", value: "Associate's Degree" },
  { label: "Bachelor's Degree", value: "Bachelor's Degree" },
  { label: "Master's Degree", value: "Master's Degree" },
  { label: "PhD", value: "PhD" },
  { label: "No specific requirement", value: "None" },
];

type EditJobModalProps = {
  jobId: string | null
  openModal: boolean
  closeModal: () => void
}

export default function EditJobModal({ jobId, openModal, closeModal }: EditJobModalProps) {
  const [jobData, setJobData] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId)).then((data) => {
        setJobData(data.payload)
        setFormData(data.payload)
      })
    }
  }, [jobId, dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (selectedOption: any, name: string) => {
    setFormData({
      ...formData,
      [name]: Array.isArray(selectedOption)
        ? selectedOption.map((opt: any) => opt.value)
        : selectedOption?.value || "",
    })
  }

  const handleSubmit = () => {
    console.log("form data",formData)
    if (jobId && formData) {
      dispatch(updateJob({ jobId, updatedJob: formData }))
        .then(() => closeModal())
        .catch((err) => console.error("Failed to update job", err))
    }
  }

  return (
    <Modal open={openModal} onClose={closeModal} classNames={{ modal: 'w-full max-w-5xl mx-auto rounded-lg' }}>
      <h2 className="text-lg font-bold mb-4">Edit Job Details</h2>
      {formData ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <strong>Title:</strong>
              <input name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <strong>Location:</strong>
              <input name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full border p-2 rounded" />
            </div>
            <div className="lg:col-span-2">
              <strong>Description:</strong>
              <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full border p-2 rounded" rows={4} />
            </div>
            <div>
              <strong>Experience:</strong>
              <input name="experience" value={formData.experience || ''} onChange={handleInputChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <strong>Education:</strong>
              <Select options={educationOptions} value={educationOptions.find(opt => opt.value === formData.education)} onChange={(opt) => handleSelectChange(opt, 'education')} />
            </div>
            <div>
              <strong>Department:</strong>
              <Select options={departmentOptions} value={departmentOptions.find(opt => opt.value === formData.department)} onChange={(opt) => handleSelectChange(opt, 'department')} />
            </div>
            <div>
              <strong>Employment Type:</strong>
              <Select options={employmentOptions} value={employmentOptions.find(opt => opt.value === formData.employmentType)} onChange={(opt) => handleSelectChange(opt, 'employmentType')} />
            </div>
            <div>
              <strong>Skills:</strong>
              <textarea name="skills" value={(formData.skills || []).join("\n")} onChange={(e) => setFormData({ ...formData, skills: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} className="w-full border p-2 rounded" rows={3} />
            </div>
            <div>
              <strong>Requirements:</strong>
              <textarea name="requirements" value={(formData.requirements || []).join("\n")} onChange={(e) => setFormData({ ...formData, requirements: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} className="w-full border p-2 rounded" rows={3} />
            </div>
            {/* <div className="lg:col-span-2">
              <strong>Languages:</strong>
              <Select isMulti options={languageOptions} value={languageOptions.filter(opt => formData.languages?.includes(opt.value))} onChange={(opts) => handleSelectChange(opts, 'languages')} />
            </div> */}
            <div>
              <strong>Status:</strong>
              <Select options={statusOptions} value={statusOptions.find(opt => opt.value === formData.status)} onChange={(opt) => handleSelectChange(opt, 'status')} />
            </div>
            <div className="lg:col-span-2">
              <strong>Responsibilities:</strong>
              <textarea name="responsibilities" value={(formData.responsibilities || []).join("\n")} onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} className="w-full border p-2 rounded" rows={3} />
            </div>
            <div>
              <strong>Certifications:</strong>
              <textarea name="certifications" value={(formData.certifications || []).join("\n")} onChange={(e) => setFormData({ ...formData, certifications: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} className="w-full border p-2 rounded" rows={2} />
            </div>
            <div>
              <strong>Soft Skills:</strong>
              <textarea name="softSkills" value={(formData.softSkills || []).join("\n")} onChange={(e) => setFormData({ ...formData, softSkills: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} className="w-full border p-2 rounded" rows={2} />
            </div>
            <div className="lg:col-span-2 space-y-2">
              <strong>Other Options:</strong>
              <div className="flex flex-wrap gap-4">
                {['isRemote', 'isHybrid', 'internalJobBoard', 'externalJobBoards', 'socialMedia'].map(flag => (
                  <label key={flag} className="flex items-center gap-2">
                    <input type="checkbox" checked={!!formData[flag]} onChange={(e) => setFormData({ ...formData, [flag]: e.target.checked })} />
                    {flag}
                  </label>
                ))}
              </div>
              <div>
                <strong>Application Form Fields:</strong>
                {Object.entries(formData.applicationFormFields || {}).map(([key, val], idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input value={key} readOnly className="p-2 border rounded bg-gray-100 w-1/3" />
                    <input value={val} onChange={(e) => {
                      const updated = { ...formData.applicationFormFields }
                      updated[key] = e.target.value
                      setFormData({ ...formData, applicationFormFields: updated })
                    }} className="p-2 border rounded w-2/3" />
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const key = `field_${Date.now()}`
                    setFormData({ ...formData, applicationFormFields: { ...formData.applicationFormFields, [key]: "" } })
                  }}
                  variant="outline"
                >
                  Add Field
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button type="submit" variant="default">Save Changes</Button>
          </div>
        </form>
      ) : (
        <p>Loading job data...</p>
      )}
    </Modal>
  )
}
