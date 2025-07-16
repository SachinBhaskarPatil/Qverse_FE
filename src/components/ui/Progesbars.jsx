import React from 'react';
import Progress from './Progress';

const ProgressBar = ({ scores }) => {
  return (
    <div className="flex gap-[0.1rem] max-w-[8.5rem]"> {/* Gap for mobile and desktop */}
      {scores?.map((score, index) => (
        <Progress 
          key={index} 
          value={score.value} 
          name={score.name} 
          fillColor={score.color} 
        />
      ))}
    </div>
  );
};

export default ProgressBar;
