'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppDispatch, RootState } from '@/lib/store'
import { useSelector, useDispatch } from 'react-redux'
import { submitJobPublishStep } from '@/lib/slices/job/jobPublish-slice'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ReviewStepPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const jobData: any = useSelector((state: RootState) => state.jobRequirement.response?.jobData)
  const JobStep3 = useSelector((state: RootState) => state.jobRequirement.response)
  const JobStep4 = useSelector((state: RootState) => state.jobPublish.response)

  if (!jobData) {
    return <div>Loading...</div>
  }

  const { basic_info = {}, job_details = {}, requirements = {} } = jobData || {}

  const [publishOptions, setPublishOptions] = useState({
    internalJobBoard: false,
    externalJobBoards: true,
    socialMedia: false
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setPublishOptions(prevState => ({
      ...prevState,
      [name]: checked
    }))
  }

  const handlePublishJob = async () => {
    const sessionId = JobStep3?.sessionId || 'default-session-id'

    if (!sessionId) {
      alert('Session ID is required!')
      return
    }

    const publishRequest = {
      internalJobBoard: publishOptions.internalJobBoard,
      externalJobBoards: publishOptions.externalJobBoards,
      socialMedia: publishOptions.socialMedia,
      applicationFormFields: {
        resumeUpload: true,
        portfolioLink: "optional",
        expectedJoiningDate: "required",
        coverLetterRequired: false
      }
    }

    try {
      const response = await dispatch(
        submitJobPublishStep({ sessionId, details: publishRequest })
      ).unwrap()

      const message = response?.message || 'Job published successfully!'
      const toastId = toast.success(message)

      setTimeout(() => {
        toast.dismiss(toastId)
        router.push('/jobs')
      }, 1000)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to publish job')
    }
  }

  const handleClose = () => {
    router.push('/jobs')
  }

  return (
    <div className="mx-auto  px-4 space-y-4">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Displaying Basic Info */}
      <div className="rounded-md bg-gray-50 p-4 shadow-sm">
        <h3 className="text-lg font-medium">{basic_info.jobTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{basic_info.department}</Badge>
           <Badge variant="outline">{requirements.educationLevel}</Badge>
          
          <Badge variant="outline">{basic_info.location}</Badge>
          <Badge variant="outline">{basic_info.employmentType}</Badge>
          <Badge variant="outline">
            ${basic_info.salaryMin} - ${basic_info.salaryMax} / {basic_info.salaryPeriod}
          </Badge>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Job Description</h4>
          <p className="mt-1 text-sm text-gray-600">{job_details.jobDescription}</p>
        </div>
      </div>

      {/* Responsibilities and Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Key Responsibilities</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {job_details.keyResponsibilities?.map((resp: string, index: number) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Requirements</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.requiredSkills?.map((skill: string, index: number) => (
              <li key={index}>{skill}</li>
            ))}
           
            {requirements.certifications?.map((cert: string, index: number) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Soft Skills and Languages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Soft Skills</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.softSkills?.map((skill: string, index: number) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Languages</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.languages?.map((language: { name: string; proficiency: string }, index: number) => (
              <li key={index}>
                {language.name} - {language.proficiency}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="rounded-md border p-4 shadow-sm">
        <h3 className="font-medium">Publishing Options</h3>
        <div className="mt-4 space-y-4">
          {[
            {
              id: 'internalJobBoard',
              label: 'Internal Job Board',
              description: 'Post this job to your company\'s internal job board'
            },
            {
              id: 'externalJobBoards',
              label: 'External Job Boards',
              description: 'Publish this job to external job boards (Indeed, LinkedIn, etc.)'
            },
            {
              id: 'socialMedia',
              label: 'Social Media',
              description: 'Share this job on your company\'s social media accounts'
            }
          ].map(({ id, label, description }) => (
            <div className="flex items-start gap-2" key={id}>
              <input
                type="checkbox"
                id={id}
                name={id}
                checked={publishOptions[id as keyof typeof publishOptions]}
                onChange={handleCheckboxChange}
                className="mt-1"
              />
              <div>
                <label htmlFor={id} className="font-medium">
                  {label}
                </label>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <div className="rounded-md border p-4 shadow-sm">
        <h3 className="font-medium">Application Form</h3>
        <p className="mt-1 text-sm text-gray-500">Customize the application form for this job posting</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Resume/CV</span>
            <span className="text-sm font-medium text-green-600">Required</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Cover Letter</span>
            <span className="text-sm font-medium">Optional</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Portfolio</span>
            <span className="text-sm font-medium">Optional</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Years of Experience</span>
            <span className="text-sm font-medium text-green-600">Required</span>
          </div>
        </div>
        <Button variant="link" className="mt-2 h-auto p-0 text-primary">
          Customize application form
        </Button>
      </div>

      {/* Publish Button */}
      <div className="mt-4 text-center">
        <Button onClick={handlePublishJob} className="bg-primary-gradient text-white">
          Publish Job
        </Button>
      </div>
    </div>
  )
}
