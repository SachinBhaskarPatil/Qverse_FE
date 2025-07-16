import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import API_URL from '@/config';
import { trackGameStart, trackGameComplete, trackTimeSpent, trackQuestProgress } from 'utils/analytics';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import QuestionTracker from './QuestionTracker';
import CenteredBox from './Layouts/CenteredBox';
import Loader from './Loader';
import StartQuest from './StartQuest';
import axios from 'axios';

import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RewardAnimation from './Reward';
import AnimatedOptionButton from './AnimatedOptionButton';

const REWARD_SOUND_URL = "https://qverse-universe-test.s3.ap-south-1.amazonaws.com/common/sounds/d005be7c-8e7f-4236-a77d-979e524ee4dd.mp3";
const QUEST_COMPLETE_SOUND_URL = "https://qverse-universe-test.s3.ap-south-1.amazonaws.com/common/sounds/b7e5ed9b-a290-49bd-9bc3-51c1a2db306f.mp3";


const StyledCard = styled(Card)(() => ({
  height: '100vh',
  position: 'relative',
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const DarkOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, #000000 100%)',
  zIndex: 1,
});

const ContentOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  padding: '0.5rem 1.25rem 0.25rem 1.25rem',
  overflow: 'scroll',
  gap: '0.7rem',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },

  // Keyframes for fade-in animation
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },

  // Apply animation
  '&.fade-in': {
    animation: 'fadeIn 0.5s ease-in',
  },
});



const CharacterImageContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '22px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: 3,
  marginTop: '10%',

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    top: '8px',
    gap: '6px',
    left: 'auto',
    transform: 'none',
    marginTop: 0,
  }
}));


const CharacterImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '8px',
  border: '2px solid #75FBEF',
  objectFit: 'cover',
  background: 'linear-gradient(112deg, #000 0%, rgba(0, 0, 0, 0.50) 100%)',
  backdropFilter: 'blur(2px)',
  cursor: 'pointer',

  [theme.breakpoints.down('sm')]: {
    width: '60px', // Smaller size for mobile
    height: '60px',
  }
}));

const NavigationArrow = styled(IconButton)(({ theme }) => ({
  color: '#75FBEF',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '8px',
  height: 'max-content',
  alignSelf: 'center',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '4px',
    '& svg': {
      fontSize: '1.2rem',
    }
  }
}));

// Update the ShareDialog component for better mobile responsiveness
const ShareDialog = ({ open, onClose, character }) => {
  return (
    <CharacterDialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }
      }}
      PaperProps={{
        style: {
          margin: '16px',
          width: '90%',
          maxWidth: '320px', // Maximum width for desktop
        }
      }}
    >
      <DialogContentStyled>
        <Box sx={{ position: 'relative' }}>
          <img
            src={character?.image}
            alt={character?.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              marginBottom: '12px',
              objectFit: 'cover'
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: '-8px',
              top: '-8px',
              color: '#75FBEF',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '4px',
              '& svg': {
                fontSize: '1.2rem',
              },
              '@media (max-width: 600px)': {
                right: '-6px',
                top: '-6px',
                padding: '3px',
                '& svg': {
                  fontSize: '1rem',
                }
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <CharacterName sx={{
          fontSize: { xs: '16px', sm: '18px' },
          marginBottom: { xs: '8px', sm: '12px' }
        }}>
          {character?.name}
        </CharacterName>
        <CharacterDescription sx={{
          fontSize: { xs: '12px', sm: '14px' },
          lineHeight: { xs: '1.3', sm: '1.4' },
          padding: { xs: '0 4px', sm: '0' }
        }}>
          {character?.description}
        </CharacterDescription>
      </DialogContentStyled>
    </CharacterDialog>
  );
};

const CharacterDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#64C7BE',
    backdropFilter: 'blur(10px)',
    border: '2px solid #75FBEF',
    borderRadius: '12px',
    color: 'white',
    overflow: 'hidden',
    '@media (max-width: 600px)': {
      margin: '12px',
      borderRadius: '8px',
    }
  }
});

const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  padding: '24px',
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  }
}));

const CharacterName = styled(Typography)({
  color: '#75FBEF',
  fontFamily: 'Satoshi, sans-serif',
  fontSize: '24px',
  textAlign: 'center',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  width: '100%',
  '&::before, &::after': {
    content: '""',
    height: '2px',
    flexGrow: 1,
    background: '#75FBEF',
    opacity: 0.5
  }
});

const CharacterDescription = styled(Typography)({
  color: '#75FBEF',
  fontFamily: 'Satoshi, sans-serif',
  fontSize: '16px',
  lineHeight: '1.6',
  textAlign: 'left'
});
const Gameplay= () => {
  const history = useRouter();
  const { questId } = history.query;
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const rewardSoundRef = useRef(new Audio(REWARD_SOUND_URL));
  const questCompleteSoundRef = useRef(new Audio(QUEST_COMPLETE_SOUND_URL));
  const [questAudioLink, setQuestAudioLink] = useState(null);
  const [questionAudioLink, setQuestionAudioLink] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedCurrentQuestion, setHasPlayedCurrentQuestion] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const questionRef = useRef(null);
  const [scores, setScores] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { gameTitle } = location.state || { gameTitle: '' };
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [isGameActive, setIsGameActive] = useState(false);
  const [totalGameTime, setTotalGameTime] = useState(0);
  const [rewardCardsData, setrewardCardsData] = useState([]);
  const [questStarted, setQuestStarted] = useState(false);
  const [universeName, setUniverseName] = useState(null);
  const [universeThumbnail, setUniverseThumbnail] = useState(null);
  const [universeDescription, setUniverseDescription] = useState(null);
  // reward state
  const [showReward, setShowReward] = useState(false);
  const [collectedRewards, setCollectedRewards] = useState([]);
  const [currentReward, setCurrentReward] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

  // Add these helper functions
  const handlePrevCharacters = () => {
    setCurrentCharacterIndex(prev => Math.max(0, prev - 2));
  };

  const handleNextCharacters = () => {
    setCurrentCharacterIndex(prev =>
      Math.min(prev + 2, (currentQuestion?.characters?.length || 0) - 2)
    );
  };

  const handleStartQuest = () => {
    setQuestStarted(true);
    setShowContent(false);
  }
  const handleRewardEarned = (reward) => {
    setCurrentReward(reward);
    setShowReward(true);
    // setShowContent(true);
  };

  const handleAnimationComplete = () => {
    setCollectedRewards(prev => [...prev, currentReward]);
    setShowReward(false);
    setShowContent(false);
  };

  // Initialize game tracking with categories
  useEffect(() => {
    setGameStartTime(Date.now());
    setIsGameActive(true);

    // Track game start with initial category setup
    trackGameStart(questId, {
      gameTitle,
      categories: scores.map(score => ({
        category: score.name,
        initialScore: 0,
        color: score.color
      }))
    });

    return () => {
      if (isGameActive && gameStartTime) {
        const finalTime = (Date.now() - gameStartTime) / 1000;
        trackTimeSpent(finalTime, `gameplay-${questId}-incomplete`, {
          categoryScores: scores.map(score => ({
            category: score.name,
            finalScore: score.value
          }))
        });
      }
    };
  }, [questId, gameTitle]);


  // Handle visibility changes for accurate time tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsGameActive(false);
        if (gameStartTime) {
          const currentTime = (Date.now() - gameStartTime) / 1000;
          setTotalGameTime(prev => prev + currentTime);
          setGameStartTime(null);
        }
      } else {
        setIsGameActive(true);
        setGameStartTime(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameStartTime]);

  const IntializeScores = useMutation(() =>
    axios.get(`${API_URL}/gameplay/score_categories/${questId}/`).then(res => res.data),
    {
      onSuccess: (data) => {
        const colors = ['#FFA500', '#4CAF50', '#2196F3', '#FF6347', '#8A2BE2'];
        const updatedScores = data.map((item, index) => ({
          ...item,
          value: 0,
          color: colors[index]
        })).slice(0, colors.length);
        setScores(updatedScores);
      },
      onError: (error) => {
        console.error("Error starting quest:", error);
        setError(error.response?.data?.error || "Failed Get the Scoring Categories");
      }
    }
  );
  const startQuest = useMutation(() =>
    axios.post(`${API_URL}/gameplay/start_quest/${questId}/`).then(res => res.data),
    {
      onSuccess: (data) => {
        setCurrentQuestion(data);
        setQuestAudioLink(questAudioLink ?? data?.quest_audio);
        setUniverseName(data?.quest_name);
        setUniverseThumbnail(data?.quest_thumbnail);
        setUniverseDescription(data?.description);
        setQuestionAudioLink(data.audio_file_path);
      },
      onError: (error) => {
        console.error("Error starting quest:", error);
        setError(error.response?.data?.error || "Failed to start quest");
      }
    }
  );

  useEffect(() => {
    startQuest.mutate();
    IntializeScores.mutate();
  }, []);
  useEffect(() => {
    if (startQuest) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);

      // Cleanup timer when component unmounts or when startQuest changes
      return () => clearTimeout(timer);
    }
  }, [startQuest]);


  const updateScores = (scoreChanges) => {
    if (!scoreChanges || typeof scoreChanges !== 'object') {
      console.error('Invalid score changes received:', scoreChanges);
      return;
    }

    setScores(prevScores => {
      const newScores = [...prevScores];

      Object.entries(scoreChanges).forEach(([key, change]) => {
        if (change && typeof change === 'object' && 'name' in change) {
          const index = newScores.findIndex(score => score.name === change.name);

          if (index !== -1) {
            // Cap the score_change to 10 if it exceeds 10
            const scoreChange = Math.min(change.score_change || 0, 10);
            const updatedValue = (newScores[index].value || 0) + scoreChange;
            newScores[index] = {
              ...newScores[index],
              value: Math.min(updatedValue, 100),
            };
          }
        }
      });

      return newScores;
    });
  };

  const updateRewards = (rewardChanges) => {
    if (!rewardChanges || typeof rewardChanges !== 'object' || Object.keys(rewardChanges).length === 0) {
      return;
    }
    const { image_path, name, description } = rewardChanges;
    const reward = {
      imageUrl: image_path,
      title: name,
      description: description
    };
    if (image_path) {
      // Play reward sound
      rewardSoundRef.current.currentTime = 0;
      rewardSoundRef.current.play().catch(error => {
        console.error("Error playing reward sound:", error);
      });

      handleRewardEarned(reward);
      setrewardCardsData((prevData) => [
        ...prevData,
        image_path,
      ]);
    }
  };

  useEffect(() => {
    if (questAudioLink) {
      audioRef.current = new Audio(questAudioLink);
      audioRef.current.volume = 0.3;
      audioRef.current.addEventListener('ended', () => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      });

      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', () => { });
          audioRef.current.removeEventListener('play', () => { });
          audioRef.current.removeEventListener('pause', () => { });
        }
      };
    }
  }, [questAudioLink]);
  
  useEffect(() => {
    // Clean up previous audio if it exists
    if (questionRef.current) {
      questionRef.current.pause();
      questionRef.current.src = '';
      questionRef.current.load();
    }

    // Only set up new audio if there's a valid audio link
    if (questionAudioLink) {
      questionRef.current = new Audio(questionAudioLink);

      questionRef.current.addEventListener('ended', () => {
        setHasPlayedCurrentQuestion(true);
      });

      // Reset the played state for new questions
      setHasPlayedCurrentQuestion(false);

      // Play question audio once if audio is enabled
      if (isPlaying && !hasPlayedCurrentQuestion) {
        questionRef.current.play().catch(error => {
          console.error("Error playing question audio:", error);
        });
      }

      return () => {
        if (questionRef.current) {
          questionRef.current.pause();
          questionRef.current.src = '';
          questionRef.current.load();
          questionRef.current.removeEventListener('ended', () => { });
        }
      };
    } else {
      // If there's no audio link, reset the question ref
      questionRef.current = null;
      setHasPlayedCurrentQuestion(true); // Prevent attempts to play null audio
    }
  }, [questionAudioLink]);

  useEffect(() => {
    if (isPlaying && questionRef.current && !hasPlayedCurrentQuestion) {
      questionRef.current.play().catch(error => {
        console.error("Error playing question audio:", error);
      });
    } else if (!isPlaying && questionRef.current) {
      questionRef.current.pause();
    }
  }, [isPlaying]);

  const answerQuestion = useMutation(
    (optionId) => axios.post(`${API_URL}/gameplay/answer_question/${currentQuestion.id}/`, { option_id: optionId }),
    {
      onSuccess: (data) => {
        setCurrentQuestionNumber((prev) => prev + 1);
        if (questionRef.current) {
          questionRef.current.pause();
          questionRef.current.src = '';
          questionRef.current.load();
        }

        if (data.data.message === 'Quest completed') {
          // Handle game completion
          handleGameComplete();

        } else {
          const progressPercentage = (data.data.current_question_no / data.data.total_questions) * 100;
          // Track progress including category changes
          trackQuestProgress(questId, {
            progressPercentage,
            currentQuestionNo: data.data.current_question_no,
            totalQuestions: data.data.total_questions,
            categoryScores: scores.map(score => ({
              category: score.name,
              currentScore: score.value
            }))
          });

          updateScores(data.data.score);
          updateRewards(data.data.collectible);
          setCurrentQuestion(data.data);
          setHasPlayedCurrentQuestion(false);

          setTimeout(() => {
            setQuestionAudioLink(data.data.audio_file_path || null);
          }, 2500);
        }
      },
      onError: (error) => {
        console.error("Error submitting answer:", error);
        setError(error.response?.data?.error || "Failed to submit answer");
      }
    }
  );

  // Track game completion with category-wise scores
  const handleGameComplete = () => {
    questCompleteSoundRef.current.play().catch(error => {
      console.error("Error playing quest complete sound:", error);
    });

    const activeTime = gameStartTime ? (Date.now() - gameStartTime) / 1000 : 0;
    const totalTime = totalGameTime + activeTime;

    // Format category scores for analytics
    const categoryScores = scores.map(score => ({
      category: score.name,
      score: score.value,
      maxPossible: 100, // Assuming max score per category is 100
      color: score.color // Preserving category color if needed
    }));

    // Prepare detailed completion metrics
    const completionMetrics = {
      questId,
      timeSpent: totalTime,
      totalQuestions: currentQuestion?.total_questions,
      categoryScores,
      rewardsEarned: rewardCardsData.length,
      // Add any additional metrics you want to track
      timestamp: new Date().toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Track completion in analytics
    trackGameComplete(questId, gameTitle, completionMetrics);

    // Navigate to rewards page with all data
   
    history.push({
      pathname: '/rewards',
      query: {
        scores: JSON.stringify(scores),
        rewardsCards: JSON.stringify(collectedRewards.map(reward => ({
          imageUrl: reward.imageUrl,
          title: reward.title,
          description: reward.description,
        }))),
        gameTitle,
        completionTime: totalTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });
  };

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    setHasPlayedCurrentQuestion(!newPlayingState);
    if (newPlayingState) {
      // Play quest audio
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing quest audio:", error);
        });
      }
      // Play question audio only if it exists, hasn't been played, and has a valid audio link
      if (questionRef.current && !hasPlayedCurrentQuestion && questionAudioLink) {
        questionRef.current.play().catch(error => {
          console.error("Error playing question audio:", error);
        });
      }
    } else {
      // Pause both audio sources if they exist
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (questionRef.current) {
        questionRef.current.currentTime = 0;
      }
    }
  };

  if (error) {
    return (
      <Container maxWidth="sm" sx={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '640px',
        mx: 'auto'
      }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }
  return (
    <CenteredBox>
      {showContent &&
        <RewardAnimation
          reward={currentReward}
          isVisible={showReward}
          onComplete={handleAnimationComplete}
          collectedRewards={collectedRewards}
        />}
      {!questStarted && (<StartQuest universeAudio={questAudioLink} universeDescription={universeDescription} universeName={universeName} universeThumbnail={universeThumbnail} onStartQuest={handleStartQuest} />)}
      {!currentQuestion ? (
        <Loader text={"Quest..."} />
      ) : (questStarted &&
        <StyledCard>
          {currentQuestion.image_file_path && (
            <CardMedia
              component="img"
              image={currentQuestion.image_file_path}
              alt="Question"
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}  // Ensuring image height fits well
            />
          )}
          {showContent &&
            <ContentOverlay className="fade-in">

              <QuestionTracker totalQuestions={10} answeredQuestions={currentQuestionNumber} />


              <ShareDialog
                open={Boolean(selectedCharacter)}
                onClose={() => setSelectedCharacter(null)}
                character={selectedCharacter}
              />

              <div className="flex flex-row justify-start w-full gap-4 cursor-pointer sm:justify-between mt-1 sm:mt-0"
              >  {/* Reduced gap for smaller screen */}
                {/* <Box sx={{ top: 0, zIndex: 2, width: 'max-content', height: 'max-content' }}>
                  <ProgressBar scores={scores} />
                </Box> */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '0.2rem',
                  top: 0,
                  zIndex: 2,
                  width: 'max-content',
                  height: 'max-content'
                }}
                >
                  {currentQuestion?.characters?.length > 2 && currentCharacterIndex > 0 && (
                    <NavigationArrow onClick={handlePrevCharacters}>
                      <ChevronLeftIcon />
                    </NavigationArrow>
                  )}

                  {currentQuestion?.characters
                    ?.slice(currentCharacterIndex, currentCharacterIndex + 2)
                    .map((character, index) => (
                      <CharacterImage
                        key={currentCharacterIndex + index}
                        src={character.image}
                        alt={`Character ${currentCharacterIndex + index + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCharacter(character);
                        }}
                      />
                    ))}

                  {currentQuestion?.characters?.length > 2 &&
                    currentCharacterIndex < currentQuestion.characters.length - 2 && (
                      <NavigationArrow onClick={handleNextCharacters}>
                        <ChevronRightIcon />
                      </NavigationArrow>
                    )}
                </Box>

                <div
                  className="flex justify-center rounded-[16px] bg-black/50 shadow-sm max-h-max p-1 mr-0 sm:mr-[47.5%] ml-1.5rem"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <VolumeUpRoundedIcon
                    sx={{
                      fill: '#fff',
                      fontSize: {
                        xs: '1.2rem', // Mobile
                        sm: '1.2rem',   // Small screens
                        md: '1.3rem', // Medium screens
                        lg: '1.5rem'    // Large screens
                      }
                    }}
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                  />
                    : <VolumeOffRoundedIcon
                      sx={{
                        fill: '#fff',
                        fontSize: {
                          xs: '1.2rem', // Mobile
                          sm: '1.2rem',   // Small screens
                          md: '1.3rem', // Medium screens
                          lg: '1.5rem'    // Large screens
                        }
                      }} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
                </div>
              </div>


              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  className="text-center text-[#CDCDCD] font-medium font-satoshi text-[1.1rem] md:text-[1.7rem] leading-tight p-1 md:p-2"
                  style={{
                    background: 'linear-gradient(140deg, rgba(0, 0, 0, 0.80) 22.98%, rgba(0, 0, 0, 0.40) 77.02%)',
                    borderRadius: '8px'
                  }}
                >
                  {currentQuestion.question_text}
                </div>
              </div>

              <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column" sx={{ mb: 2 }}>
                {currentQuestion.options.map(option => (
                  <Grid item key={option.id}>
                    <AnimatedOptionButton
                      option={option}
                      onClick={() => answerQuestion.mutate(option.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </ContentOverlay>}
        </StyledCard>
      )}
    </CenteredBox>

  );
}

export default Gameplay;
