import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import CenteredBox from "components/ui/Layouts/CenteredBox";
import { styled } from '@mui/material/styles';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import TriviaButton from "components/ui/TriviaButton";
import QuestionTracker from 'components/ui/QuestionTracker';
import axiosWrapper from "utils/helper/axiosWrapper";
import Timer from "components/ui/Timer";
import Loader from "components/ui/Loader";
import TriviaScoreCard from "components/ui/TriviaScoreCard";
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import { trackStartTrivia,trackTriviaCompleted,trackQuestionView,trackAnswerSelected,trackTimerExpired,trackTriviaTimeSpent } from "utils/analytics";

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

const Travia = () => {
    const [time, setTime] = useState(0 * 60 + 40);
    const [isActive, setIsActive] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const history = useRouter();
    const { slug } = history.query;
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [allQuestion, setAllQuestions] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [showReward, setShowReward] = useState(false);
    const [score, setScore] = useState(0);
    const [traviaAudio, setTraviaAudio] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [trivianame, setTriviame] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [gameStartTime, setGameStartTime] = useState(Date.now());
    const traviaCompleteAudio=useRef(new Audio("https://qverse-universe-test.s3.ap-south-1.amazonaws.com/common/sounds/b7e5ed9b-a290-49bd-9bc3-51c1a2db306f.mp3"));
    const handleAnswerSelected = (isTrue) => {
        setShowResults(true);
        const timeTaken = (Date.now() - questionStartTime) / 1000;
        trackAnswerSelected(trivianame,slug,questionNumber,isTrue,timeTaken);
        if (questionNumber < allQuestion.length) {
            isTrue && setScore(prev => prev + 1);
            setTimeout(() => {
                setQuestionNumber(prev => prev + 1);
                setShowResults(false);
                resetTimer();
            }, 2000); 
        } else {
            setTime(0);
            
            setTimeout(() => {
                const finalTime = (Date.now() - gameStartTime) / 1000;
                trackTriviaCompleted(trivianame,slug,score,finalTime);
                setShowReward(true);
                traviaCompleteAudio.current.play();

            }, 2000);

        }
    };

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
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.50) 100%)',
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 2,
        padding: '0.5rem 1.25rem 0.25rem 1.25rem',
        overflow: 'scroll',
        gap: '2.2rem',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    });
    const handlePlayPause = () => {
        const newPlayingState = !isPlaying;
        setIsPlaying(newPlayingState);
        if (newPlayingState) {
            // Play quest audio
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.error("Error playing quest audio:", error);
                });
            }
            // Play question audio only if it exists, hasn't been played, and has a valid audio lin

        } else {
            // Pause both audio sources if they exist
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    };
    const handleTimerComplete = () => {
        setIsActive(false);
        setShowResults(true);
        const timeSpent = (Date.now() - questionStartTime) / 1000; 
        trackTimerExpired(trivianame, slug, questionNumber, timeSpent);
        if (questionNumber < allQuestion.length) {
            setTimeout(() => {
                setQuestionNumber(prev => prev + 1);
                setShowResults(false);
                resetTimer();
            }, 2000);
        } else {
            setTime(0);
            const finalTime = (Date.now() - gameStartTime) / 1000;
            setTimeout(() => {
                setShowReward(true);
                trackTriviaCompleted(trivianame,slug,score,finalTime);
                traviaCompleteAudio.current.play();

            }, 2000);

        }
    };

    const resetTimer = () => {
        setTime(40);
        setIsActive(true);
        setShowResults(false);
    };


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  // Initialize game tracking with categories
  useEffect(() => {
    setGameStartTime(Date.now());
    trackStartTrivia(trivianame,slug);
    
    return () => {
        // Calculate total time spent up to the current question
        const finalTime = (Date.now() - gameStartTime) / 1000;
        
        // Only track if we have the necessary data
        if (gameStartTime && trivianame && slug) {
            trackTriviaTimeSpent(trivianame, slug, questionNumber, finalTime);
        }
    }}, [slug, trivianame]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await axiosWrapper.get(`trivia/${slug}/`);
                setTriviame(result?.trivia?.name);
                setAllQuestions(result?.questions);
                setCurrentQuestion(result?.questions[0]);
                setQuestionNumber(1);
                setTraviaAudio(result?.trivia?.audio_url)
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (traviaAudio) {
            audioRef.current = new Audio(traviaAudio);
            audioRef.current.volume = 0.5;
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
    }, [traviaAudio]);

    useEffect(() => {
        if (allQuestion?.length > 0) {
            setCurrentQuestion(allQuestion[questionNumber - 1]);
            setQuestionStartTime(Date.now());
            trackQuestionView(trivianame,slug,questionNumber-1);
        }
    }, [questionNumber]);

    useEffect(()=>{

    },[])

    return (
        <CenteredBox>
            {loading && (<Loader text={"Trivia..."} />)}
            {!loading && showReward && <TriviaScoreCard score={score} totalQuestionLength={allQuestion?.length} name={trivianame} />}
            {!loading && !showReward && (<><DarkOverlay />
                <StyledCard>
                    {currentQuestion?.image && (
                        <CardMedia
                            component="img"
                            image={currentQuestion?.image}
                            alt="Question"
                            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    )}
                    <ContentOverlay>
                        <div className="flex flex-col justify-between h-full w-full">
                            {/* Top section with back button */}
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-2">
                                    <ArrowCircleLeftRoundedIcon sx={{
                                        fill: '#fff',
                                        cursor: 'pointer',
                                        fontSize: {
                                            xs: '1.4rem',
                                            sm: '1.2rem',
                                            md: '1.3rem',
                                            lg: '2rem'
                                        }
                                    }}
                                        onClick={() => history.push('/other-content')}
                                    />
                                    <div className="text-white text-center font-[Satoshi] text-[1rem] font-normal leading-[110%] tracking-[0.0125rem] md:text-[1.25rem] sm:text-[1rem] mt-1">
                                        Trivia
                                    </div>
                                </div>
                                <div className="flex justify-center rounded-[20px] bg-white/50 shadow-sm max-h-max p-1 mr-0" onClick={handlePlayPause}>
                                    {isPlaying ? <VolumeUpRoundedIcon
                                        sx={{
                                            fill: '#fff',
                                            fontSize: {
                                                xs: '1.3rem', // Mobile
                                                sm: '1.3rem',   // Small screens
                                                md: '1.5rem', // Medium screens
                                                lg: '1.7rem'    // Large screens
                                            }
                                        }}
                                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 "
                                    />
                                        : <VolumeOffRoundedIcon
                                            sx={{
                                                fill: '#fff',
                                                fontSize: {
                                                    xs: '1.3rem', // Mobile
                                                    sm: '1.3rem',   // Small screens
                                                    md: '1.5rem', // Medium screens
                                                    lg: '1.7rem'    // Large screens
                                                }
                                            }} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}</div>
                            </div>
                            {/* Middle section with question tracker and question text */}
                            <div className="flex flex-col gap-4 mt-2">
                                <div className="w-full flex flex-col justify-start items-start">
                                    <QuestionTracker totalQuestions={10} answeredQuestions={questionNumber} showReward={false} />
                                    <div className="w-full text-white text-center font-[Satoshi] text-[1rem] font-normal leading-[110%] tracking-[0.0125rem] md:text-[1rem] sm:text-[1rem] mt-1 flex flex-row justify-between">
                                        <div>
                                            Question {questionNumber}/{allQuestion?.length}
                                        </div>
                                        <Timer time={time} isActive={isActive} onComplete={handleTimerComplete} />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col">
                                    <div className="w-full flex flex-col">
                                        <div
                                            className="text-white font-bold leading-8 text-[1.3rem] md:text-[2rem] md:leading-[2rem] font-satoshi inline-flex p-2 max-w-fit break-words"
                                            style={{
                                                background: 'linear-gradient(140deg, rgba(0, 0, 0, 0.80) 22.98%, rgba(0, 0, 0, 0.40) 77.02%)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                            }}
                                        >
                                            {currentQuestion?.question_text}
                                        </div>
                                    </div>

                                </div>


                            </div>

                            {/* Bottom section with fixed 2x2 grid */}
                            <div className="mt-auto">
                                <div className="w-full grid grid-cols-2 gap-3 md:gap-4 mb-4">
                                    {currentQuestion?.options?.map((question, index) => (
                                        <div key={index}>
                                            <TriviaButton
                                                question={question}
                                                onAnswerSelected={handleAnswerSelected}
                                                showResults={showResults}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ContentOverlay>
                </StyledCard></>)}

        </CenteredBox>
    );
}

export default Travia;
