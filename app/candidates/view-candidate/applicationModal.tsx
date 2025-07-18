import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { FaCheck } from 'react-icons/fa';
import { postApplication } from '@/lib/slices/applicant/application-slice';
import { AppDispatch, RootState } from '@/lib/store'; // Ensure you import the AppDispatch type

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
}

interface CandidateData {
  id: string;
  name: string;
  experience: number;
  location: string;
  email: string;
  salaryExpectation: number;
  userId: string;
}

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  jobData: JobData;
  candidateData: CandidateData;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ open, onClose, jobData, candidateData }) => {
  const dispatch = useDispatch<AppDispatch>(); // Use the correct type for dispatch
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [responseData, setResponseData] = useState<any>(null); // State to store the response data
  const userId = useSelector((state: RootState) => state.auth);

  const handleSubmit = async () => {
    if (coverLetter && jobData && candidateData) {
      try {
        const applicationData = {
          jobId: jobData.id,
          candidateId: candidateData.id, // Corrected here
          coverLetter,
          userId: userId.user?.id || '', // Assuming `userId` exists in candidateData
          appliedAt: new Date().toISOString(),
        };
        setLoading(true);
        const result = await dispatch(postApplication(applicationData)); // Dispatch and get result
        setResponseData(result.payload); // Store the response data in state
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting application:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} center classNames={{ modal: 'max-w-md rounded-lg' }}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hire for Job</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Candidate Info */}
            <div className="text-center sm:text-left w-full sm:w-auto mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{candidateData.name || 'N/A'}</h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1">
                {candidateData.experience ? `${candidateData.experience} years experience` : 'Experience not specified'}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-sm text-gray-500 space-y-1 sm:space-y-0">
                <div className="flex items-center justify-center sm:justify-start">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>{candidateData.location || 'Location not specified'}</span>
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

            {/* Job Info */}
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
                      <span className="text-gray-700">{jobData.employmentType?.replace('_', ' ')}</span>
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
                          {jobData.isHybrid ? 'Hybrid' : jobData.isRemote ? 'Remote' : 'On-site'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            <div className="bg-[#f8f9fa] p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h2>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                rows={4}
                placeholder="Write your cover letter here"
              />
            </div>

            {/* Submit Button */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 mt-6"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            ) : (
              // Displaying the response data after successful submission
              <div className="text-green-600 mt-4">
                <FaCheck className="mr-2" />
                <span>Application Submitted Successfully</span>
                <div className="mt-4 text-sm text-gray-700">
                  <p><strong>Application ID:</strong> {responseData?.id}</p>
                  <p><strong>Status:</strong> {responseData?.status}</p>
                  <p><strong>Match Score:</strong> {responseData?.matchScore || 'N/A'}</p>
                  <p><strong>Notes:</strong> {responseData?.notes || 'No notes available'}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ApplicationModal;
