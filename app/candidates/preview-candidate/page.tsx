"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { previewCandidate, clearCandidateState } from "@/lib/slices/aitools/parse-resume-slice";
import { Mail, Phone, MapPin } from "lucide-react";

interface PreviewCandidateDetailsProps {
  resumeId: string;
}

const PreviewCandidateDetails: React.FC<PreviewCandidateDetailsProps> = ({ resumeId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { previewCandidate: candidateData, loading, error } = useSelector(
    (state: RootState) => state.resumeParser
  );

  useEffect(() => {
    if (resumeId) {
      dispatch(previewCandidate(resumeId));
    }

    return () => {
      dispatch(clearCandidateState());
    };
  }, [resumeId, dispatch]);
  console.log("resume _id ",resumeId)
  if (loading) return <p>Loading candidate...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!candidateData) return <p>No candidate found.</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Left Sidebar */}
      <div className="bg-white shadow rounded-lg p-4">
        {/* Profile Avatar */}
        <div className="flex flex-col bg-sky-100 p-4 rounded-lg shadow-lg items-center">
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

        {/* Languages */}
           <div className="mt-6">
            {/* Languages */}
            {candidateData.languages?.length > 0 && (
              <section>
                <h3 className="text-blue-500 font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(candidateData.languages)
                    ? candidateData.languages
                    : []
                  ).map((lang: any, i: number) => {
                    const hue = Math.floor(Math.random() * 360);
                    const bgColor = `hsl(${hue}, 90%, 85%)`;
                    const textColor = `hsl(${hue}, 30%, 40%)`;

                    const languageName =
                      typeof lang === "string"
                        ? lang
                        : lang.language || "Unknown";

                    const proficiency =
                      typeof lang === "object" && lang.proficiency
                        ? ` (${lang.proficiency})`
                        : "";

                    return (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {languageName}
                        {proficiency}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

        {/* Summary */}
        {candidateData.summary && (
          <div className="mt-6 bg-orange-100 p-4 rounded-lg shadow-sm border-2 border-orange-200 border-dashed">
            <p className="text-sm text-orange-700 leading-relaxed">{candidateData.summary}</p>
          </div>
        )}
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

        {/* Technical Skills */}
        {candidateData.technicalSkills?.length > 0 && (
          <section>
            <h3 className="text-blue-500 font-semibold mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(candidateData.technicalSkills)
                ? candidateData.technicalSkills
                : String(candidateData.technicalSkills).split(",")
              ).map((skill: string, index: number) => {
                const hue = Math.floor(Math.random() * 360);
                const bgColor = `hsl(${hue}, 90%, 85%)`;
                const textColor = `hsl(${hue}, 30%, 40%)`;
                return (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {skill.trim()}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Previous Jobs */}
        {candidateData.previousJobs?.length > 0 && (
          <section>
            <h3 className="text-blue-500 font-semibold mb-2">Previous Jobs</h3>
            {candidateData.previousJobs.map((job: any, index: number) => (
              <div key={index} className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p>{job.company}</p>
                  {job.location && <p className="text-sm">{job.location}</p>}
                </div>
                <div className="text-sm text-gray-600">
                  {job.start_date || "N/A"} - {job.end_date || "Present"}
                </div>
              </div>
            ))}
          </section>
        )}

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

        {/* Hobbies */}
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
  );
};

export default PreviewCandidateDetails;
