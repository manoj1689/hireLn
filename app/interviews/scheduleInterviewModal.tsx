import React, { useState, useRef } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { scheduleInterview } from '@/lib/slices/interview/scheduleInterviewSlice'; // adjust path if needed
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
  { value: 'PHONE', label: 'Phone' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'IN_PERSON', label: 'In Person' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'BEHAVIORAL', label: 'Behavioral' },
  { value: 'PANEL', label: 'Panel' },
];

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  open,
  onClose,
  candidateId,
  applicationId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
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
    interviewers: [{ name: '', email: '' }] as Interviewer[],
  });

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


 const cleanedInterviewers = form.interviewers
  .filter((int) => int.name.trim() !== '' && int.email.trim() !== '')
  .map(({ name, email, role, avatar }) => ({
    name,
    email,
    role: role?.trim() || "",      // ✅ Always a string
    avatar: avatar?.trim() || "",  // ✅ Always a string
  }));


  const payload = {
    candidateId: form.candidateId,
    applicationId: form.applicationId,
    type: form.interviewType, // ✅ correct key
    scheduledDate: form.scheduledDate.toISOString().split('T')[0],
    scheduledTime: form.scheduledTime,
    duration: form.duration,
    timezone: form.timezone,
    meetingLink: form.meetingLink,
    location: form.location,
    notes: form.notes,
    sendCalendarInvite: form.sendCalendarInvite,
    sendEmailNotification: form.sendEmailNotification,
    interviewers: cleanedInterviewers, // ✅ only non-empty interviewers
  };

  try {
    console.log("Final payload:", payload);
    const result = await dispatch(scheduleInterview(payload)).unwrap();
    onClose();
    console.log("Interview scheduled:", result);
  } catch (err) {
    console.error("Schedule interview failed:", err);
  }
};



  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ modal: 'max-w-3xl rounded-xl overflow-y-auto max-h-[90vh]' }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Schedule Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Interview Type</label>
            <Select
              options={interviewOptions}
              defaultValue={interviewOptions[0]}
              onChange={handleInterviewTypeChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Timezone</label>
            <input
              type="text"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium">Date</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={format(form.scheduledDate, 'yyyy-MM-dd')}
                onClick={() => setShowCalendar((prev) => !prev)}
                className="w-full border p-2 pl-10 rounded cursor-pointer"
              />
              <FaCalendarAlt
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 cursor-pointer"
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
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              name="scheduledTime"
              value={form.scheduledTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Meeting Link</label>
            <input
              type="text"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mt-4 mb-2">Interviewers</h3>
            {form.interviewers.map((interviewer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={interviewer.name}
                  onChange={(e) => handleInterviewerChange(index, 'name', e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={interviewer.email}
                  onChange={(e) => handleInterviewerChange(index, 'email', e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={interviewer.role}
                  onChange={(e) => handleInterviewerChange(index, 'role', e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Avatar URL"
                  value={interviewer.avatar}
                  onChange={(e) => handleInterviewerChange(index, 'avatar', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
            <button onClick={addInterviewer} className="text-sm text-blue-600 hover:underline mt-1">
              + Add Interviewer
            </button>
          </div>

          <div className="flex items-center gap-4 md:col-span-2 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sendCalendarInvite"
                checked={form.sendCalendarInvite}
                onChange={handleChange}
              />
              Send Calendar Invite
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sendEmailNotification"
                checked={form.sendEmailNotification}
                onChange={handleChange}
              />
              Send Email Notification
            </label>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
            Schedule Interview
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InterviewScheduleModal;
