import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SparkleEffect = ({ isVisible }) => {
  const sparkleCount = 20; // Increased number of sparkles

  // Generate sparkle positions that cover the entire button
  const generateSparklePositions = () => {
    const positions = [];
    for (let i = 0; i < sparkleCount; i++) {
      positions.push({
        x: Math.random() * 100, // Random position across width
        y: Math.random() * 100, // Random position across height
        scale: 0.5 + Math.random() * 1, // Random size
        delay: Math.random() * 0.3, // Staggered start
        duration: 0.8 + Math.random() * 0.6, // Random duration
        spread: 120 // Increased spread distance
      });
    }
    return positions;
  };

  const sparklePositions = React.useMemo(generateSparklePositions, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sparklePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: `${50}%`,
                y: `${50}%`,
                scale: 0,
                opacity: 0
              }}
              animate={{
                x: [
                  '50%',
                  `${50 + (Math.random() - 0.5) * pos.spread}%`
                ],
                y: [
                  '50%',
                  `${50 + (Math.random() - 0.5) * pos.spread}%`
                ],
                scale: [0, pos.scale, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: pos.duration,
                delay: pos.delay,
                ease: "easeOut",
                times: [0, 0.5, 1]
              }}
            >
              <Sparkles 
                className="text-yellow-300" 
                size={12} 
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(255, 255, 0, 0.5))'
                }}
              />
            </motion.div>
          ))}

          {/* Add a glow effect */}
          <motion.div
            className="absolute inset-0 rounded-[0.75rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.2 }}
            style={{
              background: 'radial-gradient(circle, rgba(255,223,0,0.3) 0%, transparent 70%)',
              filter: 'blur(8px)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedOptionButton = ({ option, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      onClick();
    }, 1000); // Increased duration to 1 second
  };

  return (
    <motion.div
      className="relative"
      whileTap={{ scale: 0.95 }}
    >
      <div
        onClick={handleClick}
        className='button relative min-w-fit max-w-[640px] w-full px-4 py-2 bg-[#34748A] rounded-[0.75rem] cursor-pointer select-none active:translate-y-2 active:[box-shadow:0_0px_0_0_#225B6F,0_0px_0_0_#225B6F41] active:border-b-[0px] transition-all duration-150 [box-shadow:0_8px_0_0_#225B6F,0_15px_0_0_#225B6F41] border border-[#34748A] overflow-hidden mx-auto'
      >
        <SparkleEffect isVisible={isClicked} />
        <motion.span 
          className='relative z-10 flex flex-col justify-center items-center h-full text-[0.8rem] sm:text-[0.85rem] md:text-[0.9rem] lg:text-[1rem] tracking-[0.015rem] text-[var(--white,#FFF)] [text-shadow:0_2px_0_rgba(0,0,0,0.15)] font-[700] font-offbit'
          animate={isClicked ? {
            scale: [1, 1.05, 1],
            transition: { duration: 0.4 }
          } : {}}
        >
          {option?.option_text}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default AnimatedOptionButton;
