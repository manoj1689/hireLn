import React from 'react';

const applicationSteps = [
  { title: 'Application Received', date: 'May 22, 2023' },
  { title: 'Resume Screened', date: 'May 24, 2023' },
  { title: 'Initial Screening', date: 'May 24, 2023' },
  { title: 'Technical Interview', date: 'May 26, 2023' },
  { title: 'Team Interview', date: 'Not scheduled' },
  { title: 'Final Decision', date: 'Pending' },
];

const ApplicationStepper = () => {
  const activeIndex = applicationSteps.findIndex(step => step.date === 'Not scheduled' || step.date === 'Pending');

  return (
    <div className="w-full p-4 space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between relative">
        {applicationSteps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center text-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center text-white font-semibold z-10 ${index < activeIndex ? 'bg-teal-600' : index === activeIndex ? 'bg-yellow-500' : 'bg-gray-300'}`}>
              {index + 1}
            </div>
            <p className="text-xs mt-2">{step.title}</p>
          </div>
        ))}
        {/* Connecting Lines */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 z-0">
          <div className="h-full bg-teal-600" style={{ width: `${(activeIndex / (applicationSteps.length - 1)) * 100}%` }}></div>
        </div>
      </div>

  
    </div>
  );
};

export default ApplicationStepper;
