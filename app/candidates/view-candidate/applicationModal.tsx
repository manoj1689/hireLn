import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { postApplication } from '@/lib/slices/applicant/application-slice';
import { AppDispatch, RootState } from '@/lib/store';
import { Calendar, Clock, Video, MapPinned } from 'lucide-react';
import { CandidateResponse } from '@/interface/candidate';

interface JobData {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: string;
  status: string;
  isRemote: boolean;
  isHybrid: boolean;
  education?: string;
  experience?: number;
}


interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  jobData: JobData;
  candidateData: CandidateResponse;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  open,
  onClose,
  jobData,
  candidateData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const userId = useSelector((state: RootState) => state.auth);

  const handleSubmit = async () => {
    if (coverLetter && jobData && candidateData) {
      try {
        const applicationData = {
          jobId: jobData.id,
          candidateId: candidateData.id,
          coverLetter,
          userId: userId.user?.id || '',
          appliedAt: new Date().toISOString(),
        };
        setLoading(true);
        await dispatch(postApplication(applicationData));
        setSubmitted(true);

        setTimeout(() => {
          setCoverLetter('');
          setSubmitted(false);
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Error submitting application:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} center classNames={{ modal: 'max-w-3xl rounded-2xl' }}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-center mb-4">Invite Candidate</h2>

        {loading ? (
          <p className="text-center">Submitting...</p>
        ) : (
          <>
            {/* Candidate Header */}
            <div className="flex items-center justify-between bg-sky-100 rounded-t-xl px-6 pt-6 pb-4 gap-4">
              <div className="flex items-center gap-4 w-1/5">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-stone-600 ">
                  {candidateData.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>

              </div>
              <div className='w-4/5'>
                <h1 className="text-lg font-bold text-gray-900">{candidateData.name}</h1>
                <p className="text-md font-medium text-gray-500">{candidateData.email}</p>
                <p className="text-md font-medium text-gray-500">{candidateData.address}</p>
              </div>
            </div>

            {/* Education */}
            {candidateData.education?.length > 0 && (
              <section>
                <h3 className="text-blue-500 font-semibold my-2">Education</h3>
                {candidateData.education.map((edu: any, i: number) => (
                  <div key={i} className="mb-2">
                    <strong>{edu.degree}</strong>, {edu.institution} {edu.location && `(${edu.location})`}
                    {edu.grade && <div className="text-xs text-gray-500">Grade: {edu.grade}</div>}
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            <div className="mt-2 flex flex-wrap gap-2">
              {(Array.isArray(candidateData.technicalSkills)
                ? candidateData.technicalSkills
                : String(candidateData.technicalSkills).split(',')
              ).map((skill: string, idx: number) => {
                const hue = 180 + (idx * 40) % 360;
                return (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `hsl(${hue}, 80%, 85%)`,
                      color: `hsl(${hue}, 60%, 35%)`,
                      border: `1px solid hsl(${hue}, 60%, 70%)`,
                    }}
                  >
                    {skill.trim()}
                  </span>
                );
              })}
            </div>

            {/* Job Info */}
            <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Job Details</h2>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg shadow-sm'>
              <div className="flex flex-col">
                <h3 className="text-neutral-700 font-bold text-2xl">{jobData.title}</h3>
                <p className="text-sm text-sky-400 italic">{jobData.education}</p>
                <p className="text-lg text-gray-500">{jobData.department}</p>
              </div>

              <div className="mt-2 space-y-1 text-sm text-end">
                {jobData.status && (
                  <div>
                    <span className="font-medium bg-rose-400 px-2 py-1 rounded-full text-white text-sm">
                      {jobData.status}
                    </span>
                  </div>
                )}
                {jobData.salaryMin && jobData.salaryMax && (
                  <p>
                    <span className="font-semibold text-sky-500 text-lg">
                      ₹{jobData.salaryMin}–₹{jobData.salaryMax}
                    </span>
                    {jobData.salaryPeriod && ` / ${jobData.salaryPeriod}`}
                  </p>
                )}
              </div>
            </div>


            {/* Info Cards Without .map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {/* Type */}
              <div className="bg-red-100 rounded-xl py-4">

                <div className="px-4 flex flex-col   items-center text-center">
                  <Video className="w-10 h-10 text-red-400 mb-2" />
                  <div>
                    <p className="text-xs text-stone-400">Work Mode</p>
                    <p className="text-sm font-semibold text-stone-500 capitalize">
                      {jobData.isRemote
                        ? 'Remote'
                        : jobData.isHybrid
                          ? 'Hybrid'
                          : 'On-site'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Info */}
              <div className="bg-green-100 rounded-xl py-4">

                <div className="px-4 flex flex-col   items-center text-center">

                  <Calendar className="w-10 h-10 text-green-400 mb-2" />
                  <div >
                    <p className="text-xs text-stone-400">Status</p>
                    <p className="text-sm font-semibold text-stone-500 capitalize">
                      {jobData.status || 'N/A'}
                    </p>

                  </div>


                </div>
              </div>

              {/* Time */}
              <div className="bg-blue-100 rounded-xl py-4">

                <div className="px-4 flex flex-col  items-center text-center">

                  <Clock className="w-10 h-10 text-blue-400 mb-2" />
                  <div >
                    <p className="text-xs text-stone-400">Duration</p>
                    <p className="text-sm font-semibold text-stone-500 capitalize">
                      {jobData.employmentType === 'FULL_TIME'
                        ? 'Full Time'
                        : 'Part Time'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Location */}
              <div className='bg-orange-100 rounded-xl py-4'>

                <div className="px-4 flex flex-col   items-center text-center">
                  <MapPinned className="w-10 h-10 text-orange-400 mb-2" />
                  <div>
                    <p className="text-xs text-stone-400">City</p>
                    <p className="text-sm font-semibold text-stone-500">
                      {jobData.location || 'N/A'}
                    </p>
                  </div>
                  <div>

                  </div>

                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className='space-y-4 mt-4'>
              <h2 className="text-lg font-medium text-neutral-700 ">Cover Letter</h2>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="mt-1 p-2 w-full border-2 border-dashed border-sky-200 bg-stone-100 rounded-md outline-none"
                rows={4}
                placeholder="Write your cover letter here"
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center '>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2  border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-gradient mt-6"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

          </>
        )}
      </div>
    </Modal>
  );
};

export default ApplicationModal;
