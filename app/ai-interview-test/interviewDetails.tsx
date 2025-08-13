import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Clock, Video, Globe, Calendar, GraduationCap } from "lucide-react"
import { InterviewResponse } from "@/interface/interview"
import { InterviewJoinData } from "@/interface/join-interview"
import dayjs from "dayjs"

type InterviewCardProps = {
    interview: InterviewJoinData
}

export default function InterviewCard({ interview }: InterviewCardProps) {
    const initials = interview.candidateName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()

    return (
        <>
            <Card className="bg-blue-50 shadow-md rounded-xl text-center p-4  space-y-4">
                {/* Avatar & Name */}
                <div className="flex gap-3">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-300 text-white text-2xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left ">
                        <h2 className="text-lg font-semibold text-gray-800">{interview.candidateName}</h2>
                        <div className="flex gap-2 items-center">
                            <Mail className="w-4 h-4 text-sky-500" />
                            <span>{interview.candidateEmail}</span>
                        </div>

                        <div className="flex gap-2 items-center">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{interview.candidateLocation}</span>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <CardContent className=" text-sm text-left text-gray-700">
                    <div>
                        {/* Education */}
                        {Array.isArray(interview.candidateEducation) && interview.candidateEducation.length > 0 && (
                            <div>
                                {interview.candidateEducation.map((edu, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4"
                                    >
                                        {/* Left: Degree */}
                                        <span><GraduationCap size={20} color="cyan"/></span><p className="text-base font-semibold text-gray-900">{edu.degree}</p>
                                         
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Skills */}
                <div className="flex flex-wrap  gap-2">
                    {interview.candidateSkills.map((skill) => (
                        <span
                            key={skill}
                            className="bg-blue-400 shadow-md rounded-full px-2 py-1 text-xs font-medium text-white"
                        >
                            {skill}
                        </span>
                    ))}
                </div>






            </Card>

            {/* Grid Section */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-sm font-medium">
                {/* Type */}
                <div className="bg-red-100 rounded-xl px-4 py-3 relative shadow-sm">
                    <span className="absolute top-0 left-10 bg-red-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
                        Type
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                        <Video className="text-red-400 w-12 h-12" />
                        <span className="text-gray-600 text-lg">{interview.interviewType}</span>
                    </div>
                </div>

                {/* Time */}
                <div className="bg-green-100 rounded-xl px-4 py-3 relative shadow-sm">
                    <span className="absolute top-0 left-10 bg-green-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
                        Date
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                        <Calendar className="text-green-400 w-12 h-12" />
                        <span className="text-gray-600 text-lg">{dayjs(interview.scheduledAt).format("D MMM YYYY, h:mm a")}</span>

                    </div>
                </div>

                {/* Zone */}
                <div className="bg-blue-100 rounded-xl px-4 py-3 relative shadow-sm">
                    <span className="absolute top-0 left-10 bg-blue-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
                        Time
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                        <Clock className="text-blue-400 w-12 h-12" />
                        <span className="text-gray-600 text-lg">{interview.duration} min.</span>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-orange-100 rounded-xl px-4 py-3 relative shadow-sm">
                    <span className="absolute top-0 left-10 bg-orange-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
                        Location
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                        <MapPin className="text-orange-400 w-12 h-12" />
                        <span className="text-gray-600 text-lg">{interview.candidateLocation}</span>
                    </div>
                </div>
            </div>
        </>

    )
}
