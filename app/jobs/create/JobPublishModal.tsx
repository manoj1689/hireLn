import { Modal } from 'react-responsive-modal'; // Import the modal from react-responsive-modal
import 'react-responsive-modal/styles.css';
import { Button } from "@/components/ui/button";  // Your button component

type JobPublishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  jobData: any; // You can refine the type if necessary
};

const JobPublishModal: React.FC<JobPublishModalProps> = ({ isOpen, onClose, jobData }) => {
  if (!jobData) return null;

  return (
    <Modal open={isOpen} onClose={onClose} center styles={{ modal: { padding: '20px', borderRadius: '10px' } }}>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-center">Job Published Successfully</h3>

        {/* Job Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Job Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-lg">Job Details</h4>
            <p><strong>Title:</strong> {jobData.job.title}</p>
            <p><strong>Description:</strong> {jobData.job.description}</p>
            <p><strong>Department:</strong> {jobData.job.department}</p>
            <p><strong>Location:</strong> {jobData.job.location}</p>
            <p><strong>Employment Type:</strong> {jobData.job.employmentType}</p>
          </div>

          {/* Right Column - Salary and Published Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-lg">Salary & Status</h4>
            <p><strong>Salary:</strong> ${jobData.job.salaryMin} - ${jobData.job.salaryMax}</p>
            <p><strong>Published At:</strong> {new Date(jobData.job.publishedAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {jobData.job.status}</p>
            <p><strong>Closed At:</strong> {jobData.job.closedAt ? new Date(jobData.job.closedAt).toLocaleString() : 'Not Closed'}</p>
          </div>
        </div>

        {/* Job Requirements, Key Responsibilities, and Additional Information in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Job Requirements */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Job Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.job.requirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Right Column - Key Responsibilities */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Key Responsibilities</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.job.responsibilities.map((resp: string, index: number) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills, Experience, and Education Section in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Skills & Experience */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Skills & Experience</h4>
            <p><strong>Skills:</strong> {jobData.job.skills.join(', ')}</p>
            <p><strong>Experience:</strong> {jobData.job.experience}</p>
          </div>

          {/* Right Column - Education Level */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Education Level</h4>
            <p><strong>Education Level:</strong> {jobData.job.education}</p>
            <p><strong>Remote:</strong> {jobData.job.isRemote ? "Yes" : "No"}</p>
            <p><strong>Hybrid:</strong> {jobData.job.isHybrid ? "Yes" : "No"}</p>
          </div>
           {/* Certifications Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Certifications</h4>
          <ul className="list-disc list-inside space-y-1">
            {jobData.job.certifications.length ? (
              jobData.job.certifications.map((cert: string, index: number) => (
                <li key={index}>{cert}</li>
              ))
            ) : (
              <p>No certifications listed</p>
            )}
          </ul>
        </div>

        {/* Languages Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Languages</h4>
          <ul className="list-disc list-inside space-y-1">
            {jobData.job.languages.length ? (
              jobData.job.languages.map((lang: { name: string, proficiency: string }, index: number) => (
                <li key={index}>{`${lang.name} (${lang.proficiency})`}</li>
              ))
            ) : (
              <p>No languages listed</p>
            )}
          </ul>
        </div>

        </div>

      

        {/* Soft Skills Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Soft Skills</h4>
          <ul className="list-disc list-inside space-y-1">
            {jobData.job.softSkills.length ? (
              jobData.job.softSkills.map((skill: string, index: number) => (
                <li key={index}>{skill}</li>
              ))
            ) : (
              <p>No soft skills listed</p>
            )}
          </ul>
        </div>

        {/* Job Metadata Section */}
      

        {/* Publish Button */}
        <Button onClick={onClose} className="bg-blue-600 text-white w-full py-2">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default JobPublishModal;
