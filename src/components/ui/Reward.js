import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SparkleEffect = () => {
    return (
        <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: ["0%", "-50%"]
                    }}
                    transition={{
                        duration: 2,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2
                    }}
                >
                    <Sparkles className="text-yellow-300" size={24} />
                </motion.div>
            ))}
        </motion.div>
    );
};



const RewardCard = ({ imageUrl, title, description }) => {
    return (
      <div className="flex flex-col items-center">
        {/* Main image card */}
        <motion.div 
          className="w-64 h-64 rounded-2xl shadow-2xl overflow-hidden transform-gpu mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 30px rgba(255, 223, 0, 0.5)',
            border: '2px solid rgba(79, 199, 187, 0.5)',
          }}
        />
        
        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-[300px]"
        >
          <div 
            className="relative rounded-xl overflow-hidden bg-[rgba(13,28,40,0.9)]"
            style={{
              border: '2px solid rgba(79, 199, 187, 0.5)',
              boxShadow: '0 0 20px rgba(79, 199, 187, 0.2)',
            }}
          >
            {/* Title */}
            <motion.div 
              className="text-center py-2 px-4 border-b border-[rgba(79,199,187,0.3)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-[#4FC7BB] font-melodrama text-xl">
                {title}
              </h3>
            </motion.div>
            
            {/* Description */}
            <motion.div 
              className="p-4 text-[#4FC7BB] font-satoshi text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {description}
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };
  

  const RewardStack = ({ rewards, onStackReady }) => {
    const stackRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedReward, setSelectedReward] = useState(null);
  
    useEffect(() => {
      if (stackRef.current) {
        const rect = stackRef.current.getBoundingClientRect();
        onStackReady({
          x: rect.right - (rect.width / 2),
          y: rect.top + (rect.height / 2)
        });
      }
    }, [onStackReady]);
  
    const processReward = (reward) => {
      if (typeof reward === 'string') {
        return {
          imageUrl: reward,
          title: 'Reward',
          description: 'A reward from your journey.'
        };
      }
      return {
        imageUrl: reward.imageUrl || reward.image || '',
        title: reward.title || 'Reward',
        description: reward.description || 'A reward from your journey.'
      };
    };
  
    const recentRewards = rewards.slice(-3).reverse();
  
    return (
      <div className="fixed top-10 md:top-4 right-4 z-50">
        <motion.div 
          className="relative"
          ref={stackRef}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => {
            setIsHovered(false);
            setHoveredIndex(null);
            setSelectedReward(null);
          }}
        >
          <motion.div className="relative w-24 h-24">
            {recentRewards.map((reward, index) => {
              const processedReward = processReward(reward);
              const isCardHovered = hoveredIndex === index;
              
              return (
                <motion.div
                  key={index}
                  className="absolute top-0 right-0"
                  initial={{ scale: 0.8, rotate: 0 }}
                  animate={{
                    scale: 1,
                    rotate: isHovered ? (index - 1) * 15 : (index - 1) * 5,
                    x: isHovered ? index * -20 : index * -4,
                    y: isHovered ? index * 8 : index * 4,
                  }}
                  transition={{ duration: 0.3 }}
                  onHoverStart={() => {
                    setHoveredIndex(index);
                    setSelectedReward(processedReward);
                  }}
                  onHoverEnd={() => {
                    setHoveredIndex(null);
                    setSelectedReward(null);
                  }}
                  style={{ 
                    zIndex: isCardHovered ? 1000 : recentRewards.length - index,
                    position: 'absolute'
                  }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                    style={{
                      backgroundImage: `url(${processedReward.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '2px solid rgba(79, 199, 187, 0.5)',
                      boxShadow: isCardHovered 
                        ? '0 0 15px rgba(79, 199, 187, 0.3)'
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
  
          {/* Hover description */}
          <AnimatePresence>
            {selectedReward && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-28 right-0 w-64 bg-[rgba(13,28,40,0.9)] rounded-lg p-3"
                style={{
                  border: '1px solid rgba(79, 199, 187, 0.5)',
                  boxShadow: '0 0 10px rgba(79, 199, 187, 0.2)',
                  zIndex: 1001 
                }}
              >
                <h4 className="text-[#4FC7BB] font-melodrama text-lg mb-2">
                  {selectedReward.title}
                </h4>
                <p className="text-[#4FC7BB] font-satoshi text-sm">
                  {selectedReward.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  
  const RewardAnimation = ({ reward, imageUrl, title, description, onComplete, isVisible, collectedRewards = [] }) => {
    const [showSparkles, setShowSparkles] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('initial');
    const [stackPosition, setStackPosition] = useState({ x: 0, y: 0 });
  
    const getRewardData = () => {
      if (reward && typeof reward === 'object') {
        return {
          imageUrl: reward.imageUrl || reward.image || imageUrl,
          title: reward.title || title || 'Reward',
          description: reward.description || description || 'A reward from your journey.'
        };
      }
      return {
        imageUrl: imageUrl || reward,
        title: title || 'Reward',
        description: description || 'A reward from your journey.'
      };
    };
  
    const rewardData = getRewardData();
    useEffect(() => {
      if (isVisible) {
        setShowSparkles(true);
        setAnimationPhase('reveal');
        
        const timer3 = setTimeout(() => {
            setShowSparkles(false);
            onComplete();
          }, 2000);

        const timer1 = setTimeout(() => {
          setAnimationPhase('float');
        }, 1000);
        
        const timer2 = setTimeout(() => {
          setAnimationPhase('moveToStack');
        }, 1700);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      } else {
        setAnimationPhase('initial');
      }
    }, [isVisible, onComplete]);
  
    const getAnimationVariants = () => ({
      initial: {
        scale: 0,
        opacity: 0,
        y: 50
      },
      reveal: {
        scale: 1,
        opacity: 1,
        y: 0
      },
      float: {
        scale: 1,
        opacity: 1,
        y: -20
      },
      moveToStack: {
        scale: 0.3,
        opacity: 0,
        x: stackPosition.x - (window.innerWidth / 2),
        y: stackPosition.y - (window.innerHeight / 2)
      }
    });
  
    return (
      <>
        <RewardStack 
          rewards={collectedRewards} 
          onStackReady={setStackPosition}
        />
        
        <AnimatePresence>
          {isVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
  
              {showSparkles && <SparkleEffect />}
  
              <motion.div
                className="relative z-10"
                variants={getAnimationVariants()}
                initial="initial"
                animate={animationPhase}
                exit="initial"
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <RewardCard 
                  imageUrl={rewardData.imageUrl || reward.image || imageUrl}
                  title={rewardData.title || title || 'Reward'}
                  description={rewardData.description || description || 'A reward from your journey.'}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  };
  
  export default RewardAnimation;