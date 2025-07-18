"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchJobById } from "@/lib/slices/job/jobsList-slice"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchCandidateById } from "@/lib/slices/candidate/candidate-slice"
import { MainLayout } from "@/components/layout/main-layout"
import ApplicationModal from "./applicationModal"
import InterviewScheduleModal from "@/app/interviews/scheduleInterviewModal"
import { fetchApplications } from "@/lib/slices/applicant/getapplications-slice"
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState("overview")
  const [jobData, setJobData] = useState<any>(null)
  const [candidateData, setCandidateData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [isHandleInterviewModal, setIsHandleInterviewModal] = useState(false);

  const handleOpenModal = () => setIsHandleInterviewModal(true);
  const handleCloseModal = () => setIsHandleInterviewModal(false);

  const jobId = searchParams.get("job_id")
  const candidateId = searchParams.get("candidate_id")
  const applications = useSelector((state: RootState) => state.getApplication.data)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (jobId) {
          const jobResult = await dispatch(fetchJobById(jobId))
          setJobData(jobResult.payload)
        }

        if (candidateId) {
          const candidateResult = await dispatch(fetchCandidateById(candidateId))
          setCandidateData(candidateResult.payload)

          // 🔁 Fetch applications after candidate is fetched
          await dispatch(fetchApplications({ candidate_id: candidateId }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [jobId, candidateId, modalOpen, dispatch])


  const renderStars = (rating = 0) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<i key={i} className={`fas fa-star ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}></i>)
    }
    return stars
  }
  const openModal = () => setModalOpen(true);  // Function to open modal
  const closeModal = () => setModalOpen(false);  // Function to close modal
  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-orange-500"
      case "SCREENING":
        return "bg-yellow-500"
      case "INTERVIEW":
        return "bg-purple-500"
      case "OFFER":
        return "bg-green-500"
      case "HIRED":
        return "bg-green-600"
      case "REJECTED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }
  const getStatusDotClass = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "bg-neutral-400"
      case "SCREENING":
        return "bg-yellow-200"
      case "INTERVIEW":
        return "bg-purple-200"
      case "OFFER":
        return "bg-green-200"
      case "HIRED":
        return "bg-green-300"
      case "REJECTED":
        return "bg-red-300"
      default:
        return "bg-gray-300"
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidate profile...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!candidateData) {
    return (
      <section className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Candidate not found</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="flex items-center mb-4 sm:mb-6">
        <a href="#" className="text-sm text-gray-500 hover:text-teal-600 cursor-pointer">
          <i className="fas fa-arrow-left mr-2"></i>
          <span className="hidden sm:inline">Back to Candidates</span>
          <span className="sm:hidden">Back</span>
        </a>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-700">Candidate Profile</span>
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-sm rounded-lg mb-4 sm:mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 bg-gray-200 flex items-center justify-center mx-auto sm:mx-0">
                <i className="fas fa-user text-gray-400 text-xl sm:text-2xl"></i>
              </div>
              <div className="text-center sm:text-left w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{candidateData.name || "N/A"}</h1>
                <p className="text-base sm:text-lg text-gray-600 mt-1">
                  {candidateData.experience
                    ? `${candidateData.experience} years experience`
                    : "Experience not specified"}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <div className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>{candidateData.location || "Location not specified"}</span>
                  </div>
                  {candidateData.email && (
                    <>
                      <span className="hidden sm:inline mx-3">•</span>
                      <div className="flex items-center justify-center sm:justify-start">
                        <i className="fas fa-envelope mr-2"></i>
                        <span className="truncate max-w-xs">{candidateData.email}</span>
                      </div>
                    </>
                  )}
                </div>
                {candidateData.salaryExpectation && (
                  <div className="flex items-center justify-center sm:justify-start mt-2 text-sm text-gray-500">
                    <i className="fas fa-dollar-sign mr-2"></i>
                    <span>Expected: ${candidateData.salaryExpectation.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end mt-4 lg:mt-0">
              <div className="relative">
                {candidateData.applicationStatus &&
                  ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"].includes(
                    candidateData.applicationStatus,
                  ) ? (
                  <div
                    className={`inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${getStatusClass(candidateData.applicationStatus)}`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${getStatusDotClass(candidateData.applicationStatus)} mr-2`}
                    />
                    {candidateData.applicationStatus}
                  </div>
                ) : (
                  <button
                    onClick={openModal}
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Apply
                  </button>
                )}
              </div>

              {/* Modal Component */}
              <ApplicationModal
                open={modalOpen}
                onClose={closeModal} // Close the modal
                jobData={jobData}
                candidateData={candidateData}
              />
              <div className="flex mt-4 space-x-2 sm:space-x-3">
                {candidateData.email && (
                  <a
                    href={`mailto:${candidateData.email}`}
                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-envelope mr-1 sm:mr-2"></i>
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}
                {candidateData.phone && (
                  <a
                    href={`tel:${candidateData.phone}`}
                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-phone mr-1 sm:mr-2"></i>
                    <span className="hidden sm:inline">Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-gray-200">
          <nav className="flex overflow-x-auto -mb-px">
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeTab === "overview"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap cursor-pointer flex-shrink-0`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-user mr-2"></i>
              Overview
            </button>
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeTab === "experience"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap cursor-pointer flex-shrink-0`}
              onClick={() => setActiveTab("experience")}
            >
              <i className="fas fa-briefcase mr-2"></i>
              Experience
            </button>
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeTab === "education"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap cursor-pointer flex-shrink-0`}
              onClick={() => setActiveTab("education")}
            >
              <i className="fas fa-graduation-cap mr-2"></i>
              Education
            </button>
            <button
              className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeTab === "documents"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap cursor-pointer flex-shrink-0`}
              onClick={() => setActiveTab("documents")}
            >
              <i className="fas fa-file-alt mr-2"></i>
              Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Content - Tab Content */}
        <div className="w-full lg:w-8/12">
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
                <p className="text-gray-600 mb-6">
                  {candidateData.experience
                    ? `Professional with ${candidateData.experience} years of experience`
                    : "Professional summary not available"}
                </p>

                <h2 className="text-lg font-medium text-gray-900 mb-4">Key Skills</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {candidateData.skills && candidateData.skills.length > 0 ? (
                    candidateData.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>

                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900 break-words">{candidateData.email || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{candidateData.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900">{candidateData.location || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Salary Expectation</label>
                      <p className="text-sm text-gray-900">
                        {candidateData.salaryExpectation
                          ? `$${candidateData.salaryExpectation.toLocaleString()}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Links</h2>
                <div className="space-y-2">
                  {candidateData.linkedin && (
                    <div className="flex items-center">
                      <i className="fab fa-linkedin text-blue-600 mr-3 flex-shrink-0"></i>
                      <a
                        href={candidateData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 break-all"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {candidateData.github && (
                    <div className="flex items-center">
                      <i className="fab fa-github text-gray-800 mr-3 flex-shrink-0"></i>
                      <a
                        href={candidateData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 break-all"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {candidateData.portfolio && (
                    <div className="flex items-center">
                      <i className="fas fa-globe text-purple-600 mr-3 flex-shrink-0"></i>
                      <a
                        href={candidateData.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 break-all"
                      >
                        Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Work Experience</h2>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-briefcase text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Experience Level</h4>
                      <p className="text-sm text-gray-600">
                        {candidateData.experience
                          ? `${candidateData.experience} years of professional experience`
                          : "Experience level not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Education</h2>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Educational Background</h4>
                      <p className="text-sm text-gray-600">
                        {candidateData.education || "Education information not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Documents</h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {candidateData.resume && (
                      <li className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0 flex-1">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <i className="far fa-file-pdf text-red-500 text-lg"></i>
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-gray-900">Resume</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span>PDF Document</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <a
                              href={candidateData.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                              <i className="fas fa-eye"></i>
                            </a>
                            <a
                              href={candidateData.resume}
                              download
                              className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                              <i className="fas fa-download"></i>
                            </a>
                          </div>
                        </div>
                      </li>
                    )}
                    {!candidateData.resume && (
                      <li className="p-4">
                        <div className="text-center text-gray-500">
                          <i className="fas fa-file-alt text-gray-300 text-2xl mb-2"></i>
                          <p>No documents available</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {/* Application Status */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-gray-200"></div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                  <i className="fas fa-check text-xs text-green-600"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Application Received</div>
                  <div className="text-gray-500">May 23, 2025</div>
                </div>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                  <i className="fas fa-check text-xs text-green-600"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Resume Screened</div>
                  <div className="text-gray-500">May 24, 2025</div>
                </div>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                  <i className="fas fa-check text-xs text-green-600"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Initial Screening</div>
                  <div className="text-gray-500">May 24, 2025</div>
                </div>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-yellow-100 border-2 border-yellow-600 flex items-center justify-center">
                  <i className="fas fa-clock text-xs text-yellow-600"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Technical Interview</div>
                  <div className="text-gray-500">May 26, 2025</div>
                </div>
              </div>

              <div className="relative pl-10 pb-6">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                  <i className="fas fa-circle text-xs text-gray-300"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-400">Team Interview</div>
                  <div className="text-gray-400">Not scheduled</div>
                </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                  <i className="fas fa-circle text-xs text-gray-300"></i>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-400">Final Decision</div>
                  <div className="text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </div>
          {/* Application Status - Desktop (below tab content) */}
        </div>

        {/* Right Sidebar - Desktop only */}
        <div className="w-full lg:w-4/12">
          {/* Job Details */}
          {jobData && (
            <div className="bg-[#e0f8f5] shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900">{jobData.title}</h3>
                  <p className="text-sm text-gray-600">{jobData.department}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-map-marker-alt mr-3 text-gray-400 flex-shrink-0"></i>
                    <span className="text-gray-700">{jobData.location}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <i className="fas fa-briefcase mr-3 text-gray-400 flex-shrink-0"></i>
                    <span className="text-gray-700">{jobData.employmentType?.replace("_", " ")}</span>
                  </div>

                  {jobData.salaryMin && jobData.salaryMax && (
                    <div className="flex items-center text-sm">
                      <i className="fas fa-dollar-sign mr-3 text-gray-400 flex-shrink-0"></i>
                      <span className="text-gray-700">
                        ${jobData.salaryMin.toLocaleString()} - ${jobData.salaryMax.toLocaleString()}
                        {jobData.salaryPeriod && ` ${jobData.salaryPeriod}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <i className="fas fa-calendar-alt mr-3 text-gray-400 flex-shrink-0"></i>
                    <span className="text-gray-700">Status: {jobData.status}</span>
                  </div>

                  {(jobData.isRemote || jobData.isHybrid) && (
                    <div className="flex items-center text-sm">
                      <i className="fas fa-home mr-3 text-gray-400 flex-shrink-0"></i>
                      <span className="text-gray-700">
                        {jobData.isHybrid ? "Hybrid" : jobData.isRemote ? "Remote" : "On-site"}
                      </span>
                    </div>
                  )}
                </div>

                {jobData.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{jobData.description}</p>
                  </div>
                )}

                {jobData.requirements && jobData.requirements.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {jobData.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <i className="fas fa-check text-teal-500 mr-2 mt-0.5 text-xs flex-shrink-0"></i>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobData.skills && jobData.skills.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">

              <div>
                {candidateData.interviewStatus === null ? (
                  <button
                    onClick={handleOpenModal}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${candidateData.applicationStatus === 'APPLIED'
                      ? 'bg-teal-600 hover:bg-teal-700 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${candidateData.applicationStatus === 'APPLIED' ? 'focus:ring-teal-500' : ''
                      } whitespace-nowrap`}
                    disabled={candidateData.applicationStatus !== 'APPLIED'}
                  >
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Schedule Interview
                  </button>
                ) : (
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                    disabled
                  >
                    {candidateData.interviewStatus}
                  </button>
                )}

                {/* Modal */}
                <InterviewScheduleModal
                  open={isHandleInterviewModal}
                  onClose={handleCloseModal}
                  candidateId={candidateId || ""}
                  applicationId={applications?.[0]?.id || ""}
                />
              </div>

              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer">
                <i className="fas fa-envelope mr-2"></i>
                Start Ai Round
              </button>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer">
                <i className="fas fa-envelope mr-2"></i>
                Send Message
              </button>
              {candidateData.resume && (
                <a
                  href={candidateData.resume}
                  download
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Resume
                </a>
              )}
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 whitespace-nowrap cursor-pointer">
                <i className="fas fa-sticky-note mr-2"></i>
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
