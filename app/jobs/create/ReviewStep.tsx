'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppDispatch, RootState } from '@/lib/store'
import { useSelector, useDispatch } from 'react-redux'
import { submitJobPublishStep } from '@/lib/slices/job/jobPublish-slice' // Add import for your slice action
import { useRouter } from 'next/navigation'
import JobPublishModal from './JobPublishModal'

export default function ReviewStepPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state to control visibility
  // Get the jobData from Redux
  const jobData: any = useSelector((state: RootState) => state.jobRequirement.response?.jobData)
  const JobStep3 = useSelector((state: RootState) => state.jobRequirement.response)
  const JobStep4 = useSelector((state: RootState) => state.jobPublish.response)


  // If jobData is null or undefined, display a loading message
  if (!jobData) {
    return <div>Loading...</div>
  }

  

  // Destructure the jobData to avoid undefined errors
  const { basic_info, job_details, requirements } = jobData || {}

  // if (!basic_info || !job_details || !requirements) {
  //   return <div>Loading...</div> // Show loading if any part of jobData is missing
  // }

  // Track the publishing options
  const [publishOptions, setPublishOptions] = useState({
    internalJobBoard: false,
    externalJobBoards: true,
    socialMedia: false
  })

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setPublishOptions(prevState => ({
      ...prevState,
      [name]: checked
    }))
  }

  // Handle job publishing
  const handlePublishJob = async () => {
    // Ensure sessionId is available and valid (string)
    const sessionId = JobStep3?.sessionId || 'default-session-id' // Add fallback value here

    if (!sessionId) {
      alert('Session ID is required!')
      return
    }

    const publishRequest = {
      internalJobBoard: publishOptions.internalJobBoard,
      externalJobBoards: publishOptions.externalJobBoards,
      socialMedia: publishOptions.socialMedia,
      applicationFormFields: {
        resumeUpload: true,  // Assuming resume is required
        portfolioLink: "optional",  // Using 'optional' string, as in your example
        expectedJoiningDate: "required",  // Using 'required' string, as in your example
        coverLetterRequired: false  // Assuming cover letter is not required
      }
    }

    // Dispatch the publish action
    try {
      await dispatch(submitJobPublishStep({ sessionId, details: publishRequest })).unwrap()
      setIsModalOpen(true); // Open the modal after successful job publish
    } catch (error) {
      alert('Error occurred while publishing the job.')
    }
  }

  // Function to handle closing the modal and redirecting
  const handleModalClose = () => {
    setIsModalOpen(false);  // Close the modal
    router.push('/jobs');    // Redirect to /jobs page
  }


  return (
    <div className="mx-auto py-10 px-4 space-y-6">
      {/* Displaying Basic Info */}
      <div className="rounded-md bg-gray-50 p-4 shadow-sm">
        <h3 className="text-lg font-medium">{basic_info.jobTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{basic_info.department}</Badge>
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

      {/* Displaying Responsibilities and Requirements in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Responsibilities */}
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Key Responsibilities</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {job_details.keyResponsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Requirements</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.requiredSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
            <li>{requirements.educationLevel}</li>
            {requirements.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Displaying Soft Skills and Languages in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soft Skills */}
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Soft Skills</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.softSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div className="rounded-md bg-gray-100 p-4 shadow-sm">
          <h4 className="font-medium">Languages</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
            {requirements.languages.map((language, index) => (
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="internalJobBoard"
              name="internalJobBoard"
              checked={publishOptions.internalJobBoard}
              onChange={handleCheckboxChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="internalJobBoard" className="font-medium">
                Internal Job Board
              </label>
              <p className="text-sm text-gray-500">Post this job to your company's internal job board</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="externalJobBoards"
              name="externalJobBoards"
              checked={publishOptions.externalJobBoards}
              onChange={handleCheckboxChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="externalJobBoards" className="font-medium">
                External Job Boards
              </label>
              <p className="text-sm text-gray-500">Publish this job to external job boards (Indeed, LinkedIn, etc.)</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="socialMedia"
              name="socialMedia"
              checked={publishOptions.socialMedia}
              onChange={handleCheckboxChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="socialMedia" className="font-medium">
                Social Media
              </label>
              <p className="text-sm text-gray-500">Share this job on your company's social media accounts</p>
            </div>
          </div>
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
        <Button onClick={handlePublishJob} className="bg-blue-600 text-white">
          Publish Job
        </Button>
      </div>
      {/* Job Publish Modal */}
      <JobPublishModal
        isOpen={isModalOpen}
        onClose={handleModalClose}  // Pass the close handler to the modal
        jobData={JobStep4}  // Pass job data to the modal
      />
    </div>
  )
}
