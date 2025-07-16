import React from 'react';
import { Line } from 'rc-progress';

const QuestionTracker = ({ totalQuestions, answeredQuestions,showReward=true}) => {
  // Calculate percentage based on the number of answered questions
  const percent = Math.min(Math.max(Math.round((answeredQuestions / totalQuestions) * 100), 0), 100);

  return (
    <div className="relative flex items-center w-full mt-[0.5rem]">
      <div className="w-full relative" style={{ overflow: 'hidden', borderRadius: '8.5px' }}>
        {/* Darker and more pronounced black blur background for unfilled part */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px', // Slightly increase height for enhanced blur effect
            background: `linear-gradient(90deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 50%)`,
            zIndex: 1,
            clipPath: `inset(0 0 0 ${100 - percent}%)`, // Create the unfilled effect
            filter: 'blur(6px)', // Stronger blur for more depth
            transition: 'clip-path 0.6s ease', // Smooth transition for filling effect
          }}
        />
        <Line
          percent={percent}
          strokeWidth={2.8}
          trailWidth={12}
          strokeColor="#2ecc71"
          trailColor="rgba(0, 0, 0, 0.35)" // Darkened trail color for better contrast
          strokeLinecap="round" // Make the line rounded at both ends
          style={{ position: 'relative', zIndex: 2, transition: 'stroke-dashoffset 0.6s ease' }} // Smooth animation
        />
        
        {/* Overlay for filled part */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${percent}%`, // Match the width to the filled part
            height: '6px', // Adjust height to match unfilled blur part
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%)`,
            backdropFilter: 'blur(1px)', // Increase blur for the overlay for a slight glow effect
            transition: 'width 0.6s ease', // Smooth transition for filling overlay
            zIndex: 3, // Ensure it is above the green fill
          }}
        />
      </div>
      {/* Image aligned to the end of the progress bar */}
      {showReward && 
      <div className="ml-2">
      <img
        src="https://together-web-assets.s3.ap-south-1.amazonaws.com/reward_icon_qverse.svg"
        alt="Reward Icon"
        className="absolute right-[2vw] sm:right-[0vw] -top-[0.55rem] sm:-top-2.5 z-[500] h-5.5 sm:h-6 md:h-8 lg:h-8 xl:h-7"
      />
    </div>}
      
    </div>
  );
};

export default QuestionTracker;
