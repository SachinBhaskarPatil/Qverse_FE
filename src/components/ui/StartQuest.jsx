import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
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
import AnimatedOptionButton from './AnimatedOptionButton';
import StartQuestButton from 'components/ui/StartQuestButton';

const StartQuest = ({ universeAudio,universeDescription,universeName,universeThumbnail,onStartQuest}) => {
    const option = { 'option_text': "start" };
    const [isPlaying,setIsPlaying]=useState(false);
    const audioRef = useRef(null);
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
    const StyledCard = styled(Card)(() => ({
        height: '100vh',
        position: 'relative',
        overflow: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    }));
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
        padding: '0.5rem 1rem 0.25rem 1rem',
        overflow: 'scroll',
        gap: '0.7rem',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    });
    const DarkOverlay = styled(Box)({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.40) 100%)',
        zIndex: 1,
    });
    useEffect(() => {
        if (universeAudio) {
            audioRef.current = new Audio(universeAudio);
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
    }, [universeAudio]);
    return <StyledCard>
        <div className="font-black">
            <CardMedia
                component="img"
                image={universeThumbnail}
                alt="Question"
                sx={{ height: '100vh', width: '100%', objectFit: 'cover' }}
            />
            <DarkOverlay />
            <ContentOverlay>
                <div
                    className="absolute top-2 right-2 flex justify-center rounded-[20px] bg-white/50 shadow-sm max-h-max p-1 mr-0 "
                    onClick={handlePlayPause}
                >
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
                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
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
                            }} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />}
                </div>
                <div className="flex flex-col gap-[0.75rem] items-center justify-center">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#FFF] tracking-[0.03rem] leading-[3rem] text-center font-offbit">
                        WELCOME TO <span className="text-[#E2FA55]">{universeName}</span>
                    </div>

                    <div className="text-base md:text-lg lg:text-xl font-normal text-[#FFF] tracking-[0.03rem] leading-[1.625rem] text-center font-satoshi">
                        {universeDescription}                    </div>

                    <div className="w-[8rem] sm:w-[8rem] md:w-[12rem] mt-10"><StartQuestButton option={option} onClick={()=>onStartQuest()} /></div>
                </div>
            </ContentOverlay>
        </div>
    </StyledCard>;
}

export default StartQuest;
