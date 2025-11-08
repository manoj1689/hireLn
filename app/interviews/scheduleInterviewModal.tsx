import React, { useState, useRef } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiUserCheck,
  FiMapPin,
  FiLink,
  FiBell,
  FiMail,
  FiUser,
  FiUsers,
  FiPlus,
  FiLoader,
} from 'react-icons/fi';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { scheduleInterview } from '@/lib/slices/interview/scheduleInterviewSlice';


interface Interviewer {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface InterviewScheduleModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  candidateId: string;
}

const interviewOptions = [
  { value: 'PHONE', label: '📞 Phone' },
  { value: 'VIDEO', label: '🎥 Video' },
  { value: 'IN_PERSON', label: '🏢 In Person' },
  { value: 'TECHNICAL', label: '🧠 Technical' },
  { value: 'BEHAVIORAL', label: '🗣️ Behavioral' },
  { value: 'PANEL', label: '👥 Panel' },
];

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  open,
  onClose,
  candidateId,
  applicationId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false); 
  const [form, setForm] = useState({
    candidateId,
    applicationId,
    interviewType: interviewOptions[0].value,
    scheduledDate: new Date(),
    scheduledTime: '09:00',
    duration: 60,
    timezone: 'Asia/Kolkata',
    meetingLink: '',
    location: '',
    notes: '',
    sendCalendarInvite: true,
    sendEmailNotification: true,
    interviewers: [{ name: '', email: '', role: '', avatar: '' }],
    isGuest:false
  });
  
  // ✅ Sync props → form state
  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      candidateId,
      applicationId,
    }));
  }, [candidateId, applicationId]);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setForm((prev) => ({ ...prev, scheduledDate: date }));
    setShowCalendar(false);
  };

  const handleInterviewerChange = (index: number, field: keyof Interviewer, value: string) => {
    const updated = [...form.interviewers];
    updated[index][field] = value;
    setForm({ ...form, interviewers: updated });
  };

  const addInterviewer = () => {
    setForm((prev) => ({
      ...prev,
      interviewers: [...prev.interviewers, { name: '', email: '', role: '', avatar: '' }],
    }));
  };

  const handleInterviewTypeChange = (option: any) => {
    setForm((prev) => ({ ...prev, interviewType: option.value }));
  };

  const handleSubmit = async () => {
    setLoading(true); // ✅ Start loader

    const cleanedInterviewers = form.interviewers
      .filter((int) => int.name.trim() && int.email.trim())
      .map(({ name, email, role, avatar }) => ({
        name,
        email,
        role: role?.trim() || '',
        avatar: avatar?.trim() || '',
      }));

    const payload = {
      candidateId: form.candidateId,
      applicationId: form.applicationId,
      type: form.interviewType,
      scheduledDate: form.scheduledDate.toISOString().split('T')[0],
      scheduledTime: form.scheduledTime,
      duration: form.duration,
      timezone: form.timezone,
      meetingLink: form.meetingLink,
      location: form.location,
      notes: form.notes,
      sendCalendarInvite: form.sendCalendarInvite,
      sendEmailNotification: form.sendEmailNotification,
      interviewers: cleanedInterviewers,
    };

    try {
      await dispatch(scheduleInterview(payload)).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to schedule:', err);
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: 'max-w-4xl rounded-xl overflow-y-auto ' }}
    >
      <div className="p-6">
        <div className="flex justify-center ">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiCalendar /> Schedule Interview
          </h2>
        </div>

         <div className='w-full mb-4'>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiUserCheck /> Interview Type
            </label>
            <Select
              options={interviewOptions}
              defaultValue={interviewOptions[0]}
              onChange={handleInterviewTypeChange}
            />
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiCalendar /> Date
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={format(form.scheduledDate, 'yyyy-MM-dd')}
                onClick={() => setShowCalendar((prev) => !prev)}
                className="w-full border p-2 pl-10 rounded cursor-pointer"
              />
              <FiCalendar
                className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowCalendar((prev) => !prev)}
              />
            </div>
            {showCalendar && (
              <div ref={calendarRef} className="absolute z-10 mt-2 shadow-lg">
                <Calendar onChange={handleDateChange} value={form.scheduledDate} />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiClock /> Timezone
            </label>
            <input
              type="text"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-teal-500"
            />
          </div>

         

          <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiClock /> Time
            </label>
            <input
              type="time"
              name="scheduledTime"
              value={form.scheduledTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="flex  items-center gap-2 mb-1 font-medium">
              <FiClock /> Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiLink /> Meeting Link
            </label>
            <input
              type="text"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiMapPin /> Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div> */}

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 mb-1 font-medium">
              <FiBell /> Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2 rounded outline-sky-200"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mt-4 mb-2 flex items-center gap-2">
              <FiUsers /> Interviewers
            </h3>
            {form.interviewers.map((interviewer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={interviewer.name}
                  onChange={(e) => handleInterviewerChange(index, 'name', e.target.value)}
                  className="w-full border p-2 rounded outline-sky-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={interviewer.email}
                  onChange={(e) => handleInterviewerChange(index, 'email', e.target.value)}
                  className="w-full border p-2 rounded outline-sky-200"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={interviewer.role}
                  onChange={(e) => handleInterviewerChange(index, 'role', e.target.value)}
                  className="w-full border p-2 rounded outline-sky-200"
                />
                <input
                  type="text"
                  placeholder="Avatar URL"
                  value={interviewer.avatar}
                  onChange={(e) => handleInterviewerChange(index, 'avatar', e.target.value)}
                  className="w-full border p-2 rounded outline-sky-200"
                />
              </div>
            ))}
            <button
              onClick={addInterviewer}
              className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-1"
            >
              <FiPlus /> Add Interviewer
            </button>
          </div>

          <div className="flex items-center gap-4 md:col-span-2 mt-4">
            <label className="flex items-center gap-2">
              <FiCalendar />
              <input
                type="checkbox"
                name="sendCalendarInvite"
                checked={form.sendCalendarInvite}
                onChange={handleChange}
              />
              Calendar Invite
            </label>
            <label className="flex items-center gap-2">
              <FiMail />
              <input
                type="checkbox"
                name="sendEmailNotification"
                checked={form.sendEmailNotification}
                onChange={handleChange}
              />
              Email Notification
            </label>
          </div>
        </div>

    
       <div className="flex mt-6 justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded text-white transition ${
              loading
                ? 'bg-stone-500 cursor-not-allowed'
                : 'bg-primary-gradient hover:scale-105'
            } flex items-center gap-2`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Interview'
            )}
          </button>
        </div>
      </div>
    </Modal>

  );
};

export default InterviewScheduleModal;
