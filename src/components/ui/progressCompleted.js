import React, { useState, useEffect } from 'react';
import ShieldImg from '../../assets/ShieldImg.png'
import styled from 'styled-components';

const Progress = ({
  desktopWidth = 400,
  desktopHeight = 36,
  fillColor = '#2C5965',
  name,
  value = 50,
  score = 340,
  duration = 1000
}) => {
  const [fillWidth, setFillWidth] = useState(value);
  const [dimensions, setDimensions] = useState({ width: desktopWidth, height: desktopHeight });
  const [imageSize, setImageSize] = useState({ width: 90, height: 90 });

  useEffect(() => {
    setFillWidth(value);
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setImageSize({ width: 60, height: 60 });
        setDimensions({
          width: Math.round(desktopWidth * 0.7),
          height: Math.round(desktopHeight * 0.7)
        });

      } else {
        setDimensions({ width: desktopWidth, height: desktopHeight });
        setImageSize({ width: 90, height: 90 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [desktopWidth, desktopHeight]);

  const StyledH4 = styled.h4`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-family: 'Arial', sans-serif; // Adjust the font as needed
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  z-index: 10;
  margin: 0;
  padding: 0;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 14px;
    right: 5px;
  }
`;

  return (
    <div className="flex flex-col items-center z-[3]">
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <img
          src={ShieldImg}
          alt="Shield Image"
          style={{
            position: 'relative',
            width: `${imageSize.width}px`, // Adjust size as needed
            height: `${imageSize.height}px`, // Maintain aspect ratio
            zIndex: '10', // Ensure shield is above progress bar
            right: imageSize.width === 90 ? '49px' : '32px',
            bottom: imageSize.width === 90 ? '30px' : '20px'
          }}
        />
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.50)',
            background: `linear-gradient(to bottom, rgba(75, 81, 93, 0.40), rgba(75, 81, 93, 0.40))`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            borderRadius: '0.25rem'
          }}
        >
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.29) 0%, rgba(255, 255, 255, 0.00) 51%, rgba(255, 255, 255, 0.00) 70%, rgba(255, 255, 255, 0.00) 100%)`,
            }}
          />
          <div
            className="absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out"
            style={{
              width: `${fillWidth}%`,
              backgroundColor: fillColor,
              borderTopLeftRadius: '0.25rem',
              borderBottomLeftRadius: '0.25rem',
            }}
          >
            <StyledH4>{score}/100</StyledH4>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center font-satoshi text-black text-sm font-medium md:text-base lg:text-lg" style={{ color: '#CDCDCD', lineHeight: '0.875rem', letterSpacing: '0.02rem', marginTop: '1rem' }}>
        {name}
      </div>
    </div>
  );
};

export default Progress;