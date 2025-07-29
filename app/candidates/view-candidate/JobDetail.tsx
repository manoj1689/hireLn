"use client"

import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { JSX } from "react"
import {
    FaMapMarkerAlt,
    
    
   
    FaCheck,
   
} from "react-icons/fa"

type JobData = {
    title: string
    department?: string
    location: string
    isRemote?: boolean
    isHybrid?: boolean
    employmentType?: string
    salaryMin?: number
    salaryMax?: number
    salaryPeriod?: string
    experience?: string
    education?: string
    description?: string
    requirements?: string[]
    responsibilities?: string[]
    skills?: string[]
    certifications?: string[]
    languages?: string[]
    softSkills?: string[]
    status?: string
}

const BadgeGridItem = ({
    label,
    value,
    icon,
    bgColor,
}: {
    label: string
    value: string
    icon: JSX.Element
    bgColor: string
}) => (
    <div className={`rounded-xl py-4 px-4 text-center shadow-sm ${bgColor}`}>
        <div className="text-white text-xs px-2 py-1 rounded w-fit mx-auto mb-2 font-medium bg-opacity-80">
            {label}
        </div>
        <div className="flex justify-center text-white mb-1 text-xl">{icon}</div>
        <p className="text-white text-sm font-semibold">{value}</p>
    </div>
)



const JobPreview = ({ jobData }: { jobData: JobData }) => {
    if (!jobData) return <div>Data not available.</div>

    const randomColor = () =>
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 65%)`

    return (
        <div className="space-y-4">
            {/* Top Details */}
            <div className="flex flex-col lg:flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4 justify-between items-center">
                <div className="w-full lg:w-2/3 xl:w-1/2">
                    <h3 className="text-neutral-700 font-bold text-2xl">{jobData.title}</h3>
                     <p className="text-sm text-sky-400 italic ">{jobData.education}</p>
                    <p className="text-lg text-gray-500 ">{jobData.department}</p>
                </div>

                <div className="space-y-1 gap-4 text-sm w-full lg:w-1/3 xl:w-1/2 text-end">
                    {jobData.status && (
                        <div className="flex justify-end">
                            <span className="font-medium bg-rose-400 px-2 py-1 rounded-full text-white text-sm">{jobData.status}</span>
                        </div>
                    )}
                    {jobData.salaryMin && jobData.salaryMax && (
                        <p>
                            <span className="font-semibold lg:text-lg text-sky-500">₹{jobData.salaryMin}–₹{jobData.salaryMax}{" "}</span>
                            {jobData.salaryPeriod && `/ ${jobData.salaryPeriod}`}
                        </p>
                    )}
                    {jobData.experience && (
                        <div className="flex justify-end">
                            <span className="font-medium text-lg text-stone-600">{jobData.experience}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Interview Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Job Type */}
                <div className="bg-red-100 rounded-xl py-4">
                    <div className="flex justify-start">
                        <span className="text-sm font-semibold bg-red-400 text-white px-2 py-1 rounded-r-lg mb-2">Type</span>
                    </div>
                    <div className="px-4 flex flex-col items-center justify-center text-center">
                        <Video className="w-10 h-10 text-red-400 mb-2" />
                        <p className="text-sm text-stone-400 capitalize">Work Mode</p>
                        <p className="text-lg font-semibold text-stone-500 capitalize">
                            {jobData.isRemote
                                ? "Remote"
                                : jobData.isHybrid
                                    ? "Hybrid"
                                    : "On-site"}
                        </p>
                    </div>
                </div>

                {/* Job Info / Status */}
                <div className="bg-green-100 rounded-xl py-4">
                    <div className="flex justify-start">
                        <span className="text-sm font-semibold bg-green-400 text-white px-2 py-1 rounded-r-lg mb-2">Info</span>
                    </div>
                    <div className="px-4 flex flex-col items-center justify-center text-center">
                        <Calendar className="w-10 h-10 text-green-400 mb-2" />
                        <p className="text-sm text-stone-400">Status</p>
                        <p className="text-lg font-semibold text-stone-500 capitalize">
                            {jobData.status || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Job Time */}
                <div className="bg-blue-100 rounded-xl py-4">
                    <div className="flex justify-start">
                        <span className="text-sm font-semibold bg-blue-400 text-white px-2 py-1 rounded-r-lg mb-2">Time</span>
                    </div>
                    <div className="px-4 flex flex-col items-center justify-center text-center">
                        <Clock className="w-10 h-10 text-blue-400 mb-2" />
                        <p className="text-sm text-stone-400">Duration</p>
                        <p className="text-lg font-semibold text-stone-500">
                            {jobData.employmentType === "FULL_TIME"
                                ? "8–10 hrs / Full Time"
                                : "Part Time"}
                        </p>
                    </div>
                </div>

                {/* Job Location */}
                <div className="bg-orange-100 rounded-xl py-4">
                    <div className="flex justify-start">
                        <span className="text-sm font-semibold bg-orange-400 text-white px-2 py-1 rounded-r-lg mb-2">Location</span>
                    </div>
                    <div className="px-4 flex flex-col items-center justify-center text-center">
                        <FaMapMarkerAlt className="w-10 h-10 text-orange-400 mb-2" />
                        <p className="text-sm text-stone-400">City</p>
                        <p className="text-lg font-semibold text-stone-500">
                            {jobData.location || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
           
            {/* Description */}
            {jobData.description && (
                <>
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Description</h4>
                    <div className="bg-orange-100 p-4 rounded-lg shadow-sm border-2 border-orange-200 border-dashed">
                        <p className="text-sm text-orange-700 leading-relaxed">{jobData.description}</p>
                    </div>
                </>

            )}

            {/* Requirements */}
            {Array.isArray(jobData.requirements) && jobData.requirements.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        {jobData.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <FaCheck className="mt-1 text-teal-500" />
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-3/5">
                    {/* Skills */}
                    {Array.isArray(jobData.skills) && jobData.skills.length > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-800 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {jobData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-0.5 rounded-lg text-white text-xs font-medium"
                                        style={{ backgroundColor: randomColor() }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex w-full lg:w-2/5 h-auto">
                    {/* Languages */}
                    {Array.isArray(jobData.languages) && jobData.languages.length > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full">
                            <h4 className="text-md font-semibold text-gray-800 mb-2">Languages</h4>
                            <div className="flex flex-wrap gap-2">
                                {jobData.languages.map((lang: any, i) => {
                                    let label = typeof lang === "object" && lang.language && lang.proficiency
                                        ? `${lang.language} (${lang.proficiency})`
                                        : typeof lang === "string"
                                            ? lang
                                            : JSON.stringify(lang)
                                    return (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                        >
                                            {label}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>


            {/* Responsibilities */}
            {Array.isArray(jobData.responsibilities) && jobData.responsibilities.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Responsibilities</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {jobData.responsibilities.map((res, i) => (
                            <li key={i}>{res}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Soft Skills */}
                {Array.isArray(jobData.softSkills) && jobData.softSkills.length > 0 && (
                    <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {jobData.softSkills.map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-0.5 rounded-lg text-white text-sm font-medium"
                                    style={{ backgroundColor: randomColor() }}
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {Array.isArray(jobData.certifications) && jobData.certifications.length > 0 && (
                    <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                            {jobData.certifications.map((cert: any, index: number) => {
                                const label =
                                    typeof cert === "object" && cert.name
                                        ? cert.name
                                        : typeof cert === "string"
                                            ? cert
                                            : JSON.stringify(cert);
                                return (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>



        </div>
    )
}

export default JobPreview
