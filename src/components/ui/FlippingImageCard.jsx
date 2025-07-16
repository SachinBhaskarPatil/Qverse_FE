import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './Imagecard';

// Custom hook to determine if the screen is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

const FlippingImageCard = ({ imageUrl, altText, onTransitionComplete, stackPosition }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial');
  const [showBlur, setShowBlur] = useState(true);
  const isMobile = useIsMobile(); // Check if the screen is mobile
  const hasCompletedTransition = useRef(false); // Ref to track if transition has already completed

  useEffect(() => {
    if (imageUrl) {
      startAnimation();
    }
  }, [imageUrl]);

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationPhase('showing');
    setShowBlur(true);
    hasCompletedTransition.current = false; // Reset the ref

    setTimeout(() => {
      setShowBlur(false);
    }, 3000);

    setTimeout(() => {
      setAnimationPhase('transitioning');
    }, 3000);

    setTimeout(() => {
      if (!hasCompletedTransition.current) {
        onTransitionComplete(imageUrl); // Call only if not already called
        hasCompletedTransition.current = true; // Mark transition as completed
        setIsAnimating(false);
      }
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {showBlur && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <motion.div
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-108 xl:h-108"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: animationPhase === 'movingToStack' ? stackPosition.x : animationPhase === 'transitioning' ? (isMobile ? 'calc(75vw - 50%)' : 'calc(57vw - 50%)') : 0,
              y: animationPhase === 'movingToStack' ? stackPosition.y : animationPhase === 'transitioning' ? (isMobile ? 'calc(-35vh + 50%)' : 'calc(-37vh + 50%)') : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 120,
              duration: animationPhase === 'movingToStack' ? 1 : 0.5,
            }}
          >
            <ImageCard imageUrl={imageUrl} altText={altText} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlippingImageCard;
