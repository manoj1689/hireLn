import React from 'react';

const VideoDisplay = ({ currentQuestionId }) => {
  // Define a map of question IDs to video URLs
  const videoMap = {
    1627: "/videos/1.mp4",
    1628: "/videos/2.mp4",
    1629: "/videos/3.mp4",
    1630: "/videos/4.mp4",
    1631: "/videos/5.mp4",
    // Add more mappings as needed
  };

  // Get the video URL based on the currentQuestionId
  const videoUrl = videoMap[currentQuestionId];

  // If a video URL is found, display the video
  if (videoUrl) {
    console.log("AI VIDEO is Present", currentQuestionId);
    return (
      <div className='flex justify-center items-center'>
        <video src={videoUrl} controls className="w-96 rounded-lg"></video>
      </div>
    );
  }

  // Return null if no video URL is found for the given question ID
  return null;
};

export default VideoDisplay;
