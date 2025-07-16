import React, { useState } from 'react';

const AudioToggle = ({ onToggle = () => {}, initialState = false }) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleClick = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-col">
      {/* Title text */}
      <div className={`
        text-base sm:text-lg md:text-xl 
        font-medium
        font-satoshi
        whitespace-nowrap
        text-white
        transition-colors duration-200`}>
        Audio {isOn ? 'on' : 'off'}
      </div>
      
      {/* Toggle button */}
      <button
        onClick={handleClick}
        className={`
          w-8 sm:w-10 md:w-12
          h-4 sm:h-5 md:h-6
          rounded-full 
          p-0.5 
          transition-all duration-200 ease-in-out 
          focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500
          ${isOn ? 'bg-blue-500' : 'bg-gray-400'}
        `}
        aria-pressed={isOn}
        aria-label="Toggle audio"
      >
        <div
          className={`
            bg-white 
            w-3 sm:w-4 md:w-5
            h-3 sm:h-4 md:h-5
            rounded-full 
            shadow-sm 
            transform transition-transform duration-200 ease-in-out
            ${isOn ? 'translate-x-4 sm:translate-x-5 md:translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default AudioToggle;
