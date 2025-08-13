"use client"
import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchCandidateById } from "@/lib/slices/candidate/candidate-slice"
import { MainLayout } from "@/components/layout/main-layout"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

const CandidateDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(true)
    const [candidateData, setCandidateData] = useState<any>(null)

    const candidateId = searchParams.get("candidate_id")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (candidateId) {
                    const candidateResult = await dispatch(fetchCandidateById(candidateId))
                    setCandidateData(candidateResult.payload)
                }
            } catch (error) {
                console.error("Error fetching candidate:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [candidateId, dispatch])

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading candidate profile...</p>
                </div>
            </section>
        )
    }

    if (!candidateData) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Candidate not found</p>
            </section>
        )
    }

    return (
        <MainLayout>
            {/* Breadcrumb */}
            <div className="flex items-center mb-4 sm:mb-6">
                <span onClick={() => router.push("/candidates")} className="text-sm text-gray-500 hover:text-teal-600 cursor-pointer">
                    <i className="fas fa-arrow-left mr-2"></i>
                    <span className="hidden sm:inline">Back to Candidates List</span>
                    <span className="sm:hidden">Back</span>
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-700">Candidate Profile</span>
            </div>
            {/* Header */}
            <div className="bg-primary-gradient p-4 mb-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-white font-bold">Candidate Details</h1>
                <p className="text-white">View and manage candidate information with ease</p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="bg-white shadow rounded-lg p-4">
                    {/* Profile Avatar */}
                    <div className="flex flex-col  bg-sky-100 p-4 rounded-lg shadow-lg items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-stone-600">
                            {candidateData.name
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>
                        <h2 className="mt-2 text-lg font-bold">{candidateData.name}</h2>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 space-y-3">
                        {candidateData.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="text-sky-500 w-4 h-4" />
                                <span>{candidateData.email}</span>
                            </div>
                        )}
                        {candidateData.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="text-purple-500 w-4 h-4" />
                                <span>{candidateData.phone}</span>
                            </div>
                        )}
                        {candidateData.address?.length > 0 && (
                            <div className="flex items-center gap-2">
                                <MapPin className="text-orange-500 w-4 h-4" />
                                <span>{candidateData.address.join(", ")}</span>
                            </div>
                        )}
                    </div>

                    {/* Personal Info */}
                    <div className="mt-6">
                        <h3 className="text-blue-500 font-semibold mb-2">Personal Info</h3>
                        <ul className="text-sm space-y-1">
                            <li><strong>DOB:</strong> {candidateData.personalInfo?.dob || "N/A"}</li>
                            <li><strong>Gender:</strong> {candidateData.personalInfo?.gender || "N/A"}</li>
                            <li><strong>Marital Status:</strong> {candidateData.personalInfo?.maritalStatus || "N/A"}</li>
                            <li><strong>Nationality:</strong> {candidateData.personalInfo?.nationality || "N/A"}</li>
                        </ul>
                    </div>
                    <div className="mt-6">
                        {/* Languages */}
                        {candidateData.languages?.length > 0 && (
                            <section>
                                <h3 className="text-blue-500 font-semibold mb-2">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(candidateData.languages)
                                        ? candidateData.languages
                                        : String(candidateData.languages).split(",")
                                    ).map((lang: string, i: number) => {
                                        const hue = Math.floor(Math.random() * 360);
                                        const bgColor = `hsl(${hue}, 90%, 85%)`;
                                        const textColor = `hsl(${hue}, 30%, 40%)`;
                                        return (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                                                style={{ backgroundColor: bgColor, color: textColor }}
                                            >
                                                {lang.trim()}
                                            </span>
                                        );
                                    })}

                                </div>
                            </section>
                        )}

                    </div>
                    <div className="mt-6">
                        {candidateData.summary && (
                            <>

                                <div className="bg-orange-100 p-4 rounded-lg shadow-sm border-2 border-orange-200 border-dashed">
                                    <p className="text-sm text-orange-700 leading-relaxed">{candidateData.summary}</p>
                                </div>
                            </>

                        )}
                    </div>


                    {/* Social Links */}
                    <div className="flex gap-4 mt-6 justify-center">
                        {candidateData.github && (
                            <a href={`https://${candidateData.github}`} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/github.png" alt="GitHub" className="w-8" />
                            </a>
                        )}
                        {candidateData.linkedin && (
                            <a href={`https://${candidateData.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/linkedin.png" alt="LinkedIn" className="w-8" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Education */}
                    {candidateData.education?.length > 0 && (
                        <section>
                            <h3 className="text-blue-500 font-semibold mb-2">Education</h3>
                            {candidateData.education.map((edu: any, i: number) => (
                                <div key={i} className="mb-2">
                                    <strong>{edu.degree}</strong>, {edu.institution} {edu.location && `(${edu.location})`}
                                    {edu.grade && <div className="text-xs text-gray-500">Grade: {edu.grade}</div>}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Experience */}
                    {candidateData.experience?.length > 0 && (
                        <section>
                            <h3 className="text-blue-500 font-semibold mb-2">Experience</h3>
                            {candidateData.experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <strong>{exp.title}</strong> - {exp.company} ({exp.location})
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills */}
                    {candidateData.technicalSkills?.length > 0 && (
                        <section>
                            <h3 className="text-blue-500 font-semibold mb-2">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(candidateData.technicalSkills) ? candidateData.technicalSkills : String(candidateData.technicalSkills).split(",")).map(
                                    (technicalSkills: string, index: number) => {
                                        const hue = Math.floor(Math.random() * 360);
                                        const bgColor = `hsl(${hue}, 90%, 85%)`;
                                        const textColor = `hsl(${hue}, 30%, 40%)`;
                                        return (
                                            <span
                                                key={index}
                                                className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                                                style={{ backgroundColor: bgColor, color: textColor }}
                                            >
                                                {technicalSkills.trim()}
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        </section>
                    )}
                    {/* Previous Jobs */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-sky-600">Previous Jobs</span>
                        {candidateData?.previousJobs?.map((job: any, index: number) => (
                            <div
                                key={index}
                                className="flex flex-col items-start gap-4"
                            >
                                {/* Left: Title + Company + Location */}
                                <div className="flex flex-col">
                                    <p className="text-base font-semibold text-gray-700">{job.title}</p>
                                    <p className="text-base font-medium text-gray-600">{job.company}</p>
                                    {job.location && (
                                        <p className="text-sm text-gray-600">{job.location}</p>
                                    )}
                                </div>

                                {/* Right: Dates */}
                                <div className="flex flex-col items-start lg:items-end text-sm text-gray-600">
                                    {(job.start_date || job.end_date) && (
                                        <span>
                                            {job.start_date} - {job.end_date || "Present"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Projects */}
                    {candidateData.projects?.length > 0 && (
                        <section>
                            <h3 className="text-blue-500 font-semibold mb-2">Projects</h3>
                            {candidateData.projects.map((proj: any, i: number) => (
                                <div key={i} className="mb-2">
                                    <a href={proj.url} target="_blank" className="text-teal-600 font-semibold">{proj.title}</a>
                                    <p className="text-sm">{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}



                    {candidateData.hobbies?.length > 0 && (
                        <section>
                            <h3 className="text-blue-500 font-semibold mb-2">Hobbies</h3>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(candidateData.hobbies)
                                    ? candidateData.hobbies
                                    : String(candidateData.hobbies).split(",")
                                ).map((hobby: string, i: number) => {
                                    const hue = Math.floor(Math.random() * 360);
                                    const bgColor = `hsl(${hue}, 90%, 85%)`;
                                    const textColor = `hsl(${hue}, 30%, 40%)`;
                                    return (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                                            style={{ backgroundColor: bgColor, color: textColor }}
                                        >
                                            {hobby.trim()}
                                        </span>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </MainLayout>
    )
}

export default CandidateDetails
