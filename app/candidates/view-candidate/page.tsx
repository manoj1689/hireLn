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
import { Calendar, Mail, MapPin, Phone, Wallet } from "lucide-react"
import JobDetails from "./JobDetail"
import JobStepper from "./jobStepper"
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
  const interviewStatusColorMap: Record<string, string> = {
    SCHEDULED: "bg-yellow-500 hover:bg-yellow-600",
    CONFIRMED: "bg-blue-500 hover:bg-blue-600",
    IN_PROGRESS: "bg-orange-500 hover:bg-orange-600",
    COMPLETED: "bg-green-600 hover:bg-green-700",
    CANCELLED: "bg-red-600 hover:bg-red-700",
    NO_SHOW: "bg-pink-500 hover:bg-pink-600",
    RESCHEDULED: "bg-orange-500 hover:bg-orange-600",
    INVITED: "bg-purple-500 hover:bg-purple-600",
    JOINED: "bg-teal-500 hover:bg-teal-600",
  };
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
      {/*  Header */}
      <div className="flex flex-col sm:flex-row bg-primary-gradient  space-y-4 justify-between p-4 mb-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-3xl text-white font-bold tracking-tight">Applicant Preview</h1>
          <p className="text-white">We're excited to move forward with your application!</p>
        </div>
      </div>
      <section className="flex flex-col lg:flex-row gap-4  ">

        {/* Profile Header */}
        <div className=" w-full lg:w-1/3 xl:w-1/4  ">
          <div className="shadow-sm rounded-lg mb-4 sm:mb-6 bg-white ">

            <div className="flex flex-col w-full bg-primary-gradient  rounded-t-lg  py-4 justify-center items-center">
              <div className="self-start ">
                {candidateData.applicationStatus &&
                  ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"].includes(
                    candidateData.applicationStatus,
                  ) ? (
                  <div
                    className={`inline-flex items-center px-3 sm:px-4 py-1 border border-transparent rounded-r-lg shadow-sm text-sm font-medium text-white ${getStatusClass(candidateData.applicationStatus)}`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${getStatusDotClass(candidateData.applicationStatus)} mr-2`}
                    />
                    {candidateData.applicationStatus}
                  </div>
                ) : (
                  <div
                    className={`inline-flex items-center px-3 sm:px-4 py-1 border border-transparent rounded-r-lg shadow-sm text-sm font-medium text-white ${getStatusClass(candidateData.applicationStatus)}`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${getStatusDotClass(candidateData.applicationStatus)} mr-2`}
                    />
                    NEW
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center ">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-stone-600">
                  {candidateData.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{candidateData.name || "N/A"}</h1>


                <p className="text-center text-sm text-white mt-2">
                  {candidateData.education || "Degree info not available"}
                </p>
              </div>


            </div>


            {/* Contact Details */}
            <div className="flex flex-col gap-4 w-full p-4">
              {/* Email */}
              {candidateData.email && (
                <a
                  href={`mailto:${candidateData.email}`}
                  className="cursor-pointer block max-w-full"
                >
                  <div className="flex  items-center gap-2 text-gray-800 break-all">
                    <Mail className="text-sky-500 w-4 h-4" />
                    <span className="break-all text-sm">{candidateData.email}</span>
                  </div>
                </a>
              )}


              {/* Phone */}
              {candidateData.phone && (
                <a
                  href={`tel:${candidateData.phone}`}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="text-purple-500 w-4 h-4" />
                    <span className="font-semibold">{candidateData.phone}</span>
                  </div>
                </a>

              )}

              {/* Location */}
              {candidateData.location && (
                <div className="flex items-center gap-2 text-gray-800">
                  <MapPin className="text-orange-500 w-4 h-4" />
                  <span>{candidateData.location}</span>
                </div>
              )}
            </div>


            {/* Skills Section */}
            <div className="space-y-4 px-4">
              <span className=" font-semibold text-[#3B82F6]">Skills</span>
              <div className="flex flex-wrap gap-1 ">
                {(Array.isArray(candidateData.skills) ? candidateData.skills : String(candidateData.skills).split(",")).map(
                  (skill: string, index: number) => {
                    const hue = Math.floor(Math.random() * 360);
                    const bgColor = `hsl(${hue}, 70%, 70%)`;
                    const textColor = `hsl(${hue},90%, 50%)`;

                    return (
                      <span
                        key={index}
                        className="px-4 py-0.5 rounded-lg text-white text-xs font-medium"
                        style={{ backgroundColor: bgColor, }}
                      >
                        {skill.trim()}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2 p-4">
              <span className=" font-semibold text-[#3B82F6]">Experience</span>
              <span className="text-sm font-normal text-neutral-600">{candidateData.experience}</span>
            </div>
            <div className="flex space-x-4 p-4 justify-center">

              <span className="text-2xl font-normal text-blue-600">₹{candidateData.salaryExpectation} <span className="text-red-500">*</span><span className="text-neutral-700">/yr</span></span>
            </div>
            <div className="flex w-full my-4">
              <button
                onClick={() => {
                  if (candidateData.interviewStatus === null && candidateData.applicationStatus === 'APPLIED') {
                    handleOpenModal(); // Schedule Interview
                  } else if (!candidateData.applicationStatus) {
                    openModal(); // Invite
                  }
                }}
                disabled={
                  (candidateData.interviewStatus !== null) ||
                  (candidateData.applicationStatus && candidateData.applicationStatus !== 'APPLIED')
                }
                className={`  mx-auto gap-4 inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white
    ${candidateData.interviewStatus
                    ? interviewStatusColorMap[candidateData.interviewStatus] || 'bg-gray-400'
                    : !candidateData.applicationStatus
                      ? 'bg-primary-gradient hover:scale-105'
                      : candidateData.applicationStatus === 'APPLIED' && candidateData.interviewStatus === null
                        ? 'bg-teal-600 hover:bg-teal-700'
                        : 'bg-gray-400 cursor-not-allowed'
                  }
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${candidateData.applicationStatus === 'APPLIED' ? 'focus:ring-teal-500' : ''}
  `}
              >
                <Calendar />
                {candidateData.interviewStatus
                  ? candidateData.interviewStatus
                  : candidateData.applicationStatus === 'APPLIED'
                    ? 'Schedule Interview'
                    : candidateData.applicationStatus
                      ? 'Already Applied'
                      : 'Invite'}
              </button>


            </div>


            <div className=" flex gap-4 px-4 py-8 justify-around">
              {/* GitHub */}
              {candidateData.github && (
                <a
                  href={candidateData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    src="/images/candidate/github.png"
                    alt="GitHub"
                    className="w-12"
                  />
                </a>
              )}

              {/* WhatsApp */}
              {candidateData.phone && (
                <a
                  href={`https://wa.me/${candidateData.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    src="/images/candidate/whatsapp.png"
                    alt="WhatsApp"
                    className="w-12"
                  />
                </a>
              )}

              {/* LinkedIn */}
              {candidateData.linkedin && (
                <a
                  href={candidateData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    src="/images/candidate/linkedin.png"
                    alt="LinkedIn"
                    className="w-12"
                  />
                </a>
              )}

              {/* Instagram */}
              {candidateData.resume && (
                <a
                  href={candidateData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    src="/images/candidate/download.png"
                    alt="Download"
                    className="w-12"
                  />
                </a>
              )}
            </div>


          </div>

        </div>




        <div className="w-full lg:w-2/3 xl:w-3/4 ">
          {jobData ? (
            <>
              <JobDetails jobData={jobData} />

            </>

          ) : <>
            <div>
              Data not available.
            </div>

          </>}


        </div>

      </section>

      {/* Modal Component */}
      <ApplicationModal
        open={modalOpen}
        onClose={closeModal} // Close the modal
        jobData={jobData}
        candidateData={candidateData}
      />


      <div className="w-full lg:w-full mt-4">

        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="text-lg font-medium">
            Application Status
          </div>


          {/* Modal */}
          <InterviewScheduleModal
            open={isHandleInterviewModal}
            onClose={handleCloseModal}
            candidateId={candidateId || ""}
            applicationId={applications?.[0]?.id || ""}
          />

          {/* Job Stepper */}
          <div>

            <JobStepper />
          </div>
        </div>



      </div>



    </MainLayout>
  )
}

export default App
