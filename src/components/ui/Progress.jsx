import React, { useState, useEffect } from 'react';

const Progress = ({
  desktopHeight = 120,
  desktopWidth = 22,
  fillColor = '#FFA500',
  name,
  value = 50,
  duration = 1000,
  maxHeight = 150, // Add maxHeight prop
}) => {
  const [fillHeight, setFillHeight] = useState(0);
  const [dimensions, setDimensions] = useState({ height: desktopHeight, width: desktopWidth });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillHeight(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768; // Adjust this breakpoint as needed
      if (isMobile) {
        setDimensions({
          height: Math.round(Math.min(desktopHeight * 0.7, maxHeight)), // Respect maxHeight
          width: Math.round(desktopWidth * 0.7)
        });
      } else {
        setDimensions({ height: Math.min(desktopHeight, maxHeight), width: desktopWidth }); // Respect maxHeight
      }
    };

    handleResize(); // Call once to set initial size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [desktopHeight, desktopWidth, maxHeight]);

  return (
    <div className="flex flex-col items-center z-[3] max-w-[640px] w-full">
      <div className="relative" style={{ height: dimensions.height, width: dimensions.width, maxHeight: maxHeight }}>
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.50)',
            background: `#4B515D`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: 'perspective(500px) rotateX(10deg)',
            borderRadius: '0.25rem'
          }}
        >
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(90deg, rgba(255, 255, 255, 0.29) 0%, rgba(255, 255, 255, 0.00) 51%, rgba(255, 255, 255, 0.00) 70%, rgba(255, 255, 255, 0.00) 100%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
            style={{
              height: `${fillHeight}%`,
              backgroundColor: fillColor,
              borderTopLeftRadius: '0.25rem',
              borderTopRightRadius: '0.25rem',
            }}
          />
        </div>
      </div>
      <div className="relative mt-2 text-center">
  <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(91deg, rgba(0, 0, 0, 0.80) 2.96%, rgba(0, 0, 0, 0.50) 97.05%)',
      filter: 'blur(30px)',
      zIndex: -1, 
    }}
  ></div>
    <div className="font-satoshi text-[0.69rem] md:text-xs lg:text-xs text-white leading-[1rem] tracking-[0.01rem] max-w-[5rem] break-words relative z-1 m-0 p-0">
    {name}
  </div>
</div>

    </div>
  );
};

export default Progress;
