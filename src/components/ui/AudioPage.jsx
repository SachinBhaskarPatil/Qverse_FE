import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import { useRouter } from 'next/router';
import ComicHomeButton from 'components/ui/ComicHomeButton';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import styled from 'styled-components';
import Loader from 'components/ui/Loader';
import { trackPlay, trackPause, trackEpisodeChange, trackAutoPlayNext, trackSeek, trackGoToHome, trackEpisodeCompletion, trackSessionDuration, trackPlaybackDuration } from 'utils/analytics';

const AudioPlayer = ({audioStory}) => {  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentEpisodeName, setCurrentEpisodeName] = useState('');
  const [audioData, setAudioData] = useState(audioStory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile] = useState(window.innerWidth <= 500);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const history = useRouter();
  const { audioId } = history.query;
  const [episodePlaybackTime, setEpisodePlaybackTime] = useState(0);
  const [playbackStartTime, setPlaybackStartTime] = useState(null);

  useEffect(() => {
    const initializeAudioData = async () => {
      if (!audioStory) {
        try {
          setLoading(true);
          // Use the audioId from the URL params
          const response = await fetch(`https://api.qverse.life/api/generator/audiostories/${audioId}/`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include this if you need to send cookies
          });
  
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          // The API returns { audio_story, episodes }
          setAudioData({
            audioStory: data.audio_story,
            episodes: data.episodes,
          });
        } catch (err) {
          console.error('Fetch error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Use the preloaded audioStory if provided
        setAudioData(audioStory);
        setLoading(false);
      }
    };
  
    if (audioId) {
      initializeAudioData();
    }
  }, [audioId, audioStory]);

  useEffect(() => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    return () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000); // Convert to seconds

      trackSessionDuration(audioId, currentEpisodeName, sessionDuration);
    };

  }, []);

  useEffect(() => {
    if (currentEpisodeIndex < audioData?.episodes?.length - 1) {
      setCurrentEpisodeName(audioData?.episodes[currentEpisodeIndex]?.name)
    }

  }, [currentEpisodeIndex]);


  useEffect(() => {
    let playbackTimer;

    if (isPlaying) {
      // Start tracking playback time when playing
      setPlaybackStartTime(Date.now());

      // Update playback time every second while playing
      playbackTimer = setInterval(() => {
        setEpisodePlaybackTime(prev => prev + 1);
      }, 1000);
    } else if (playbackStartTime) {
      // Clear interval when paused
      clearInterval(playbackTimer);

      // Track the duration played when pausing
      const durationPlayed = Math.round(episodePlaybackTime);
      trackPlaybackDuration(audioId, currentEpisodeName, durationPlayed);
    }

    return () => {
      if (playbackTimer) {
        clearInterval(playbackTimer);
      }
    };
  }, [isPlaying]);
  useEffect(() => {
    // Track duration of previous episode if any time was played
    if (episodePlaybackTime > 0) {
      trackPlaybackDuration(audioId, currentEpisodeName, Math.round(episodePlaybackTime));
    }

    // Reset tracking for new episode
    setEpisodePlaybackTime(0);
    setPlaybackStartTime(null);
  }, [currentEpisodeIndex]);
  // Track final duration when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (episodePlaybackTime > 0) {
        trackPlaybackDuration(audioId, currentEpisodeName, Math.round(episodePlaybackTime));
      }
    };
  }, []);


  const handleEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);


    // Check if there's a next episode
    if (currentEpisodeIndex < audioData?.episodes?.length - 1) {
      // Calculate next episode index
      const nextIndex = currentEpisodeIndex + 1;
      const container = containerRef.current;
      const episodeHeight = container.clientHeight;

      trackEpisodeCompletion(audioId.currentEpisodeName);
      if (nextIndex < audioData?.episodes?.length - 1) {
        trackAutoPlayNext(audioId, currentEpisodeName, audioData?.episodes[nextIndex]?.name);
      }
      else {
        trackAutoPlayNext(audioId, currentEpisodeName, "")
      }


      // Force scroll to next episode
      if (container) {
        // First update the episode index
        setCurrentEpisodeIndex(nextIndex);


        // Then scroll with a slight delay to ensure state is updated
        setTimeout(() => {
          container.scrollTo({
            top: episodeHeight * nextIndex,
            behavior: 'smooth'
          });


          // Auto-play next episode after scroll completes
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }, 1000);
        }, 100);
      }
    }
  };


  useEffect(() => {
    if (!audioData?.episodes) return;


    const currentEpisode = audioData.episodes[currentEpisodeIndex];
    if (!currentEpisode?.audio_file_path) return;


    audioRef.current = new Audio(currentEpisode.audio_file_path);
    const audio = audioRef.current;
    const container = containerRef.current;


    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setCurrentTime(0);
    };


    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };


    const handleScroll = () => {
      const st = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(st / height);


      if (index !== currentEpisodeIndex) {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        trackEpisodeChange(audioId, currentEpisodeName, audioData?.episodes[index]?.name)
        setCurrentEpisodeIndex(index);

      }
    };


    audio?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio?.addEventListener('timeupdate', handleTimeUpdate);
    audio?.addEventListener('ended', handleEnded);
    container?.addEventListener('scroll', handleScroll);


    return () => {
      container?.removeEventListener('scroll', handleScroll);
      audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
      audio?.removeEventListener('ended', handleEnded);
      audio?.pause();
    };
  }, [currentEpisodeIndex, audioData]);


  // Also update handleNextEpisode function
  const handleNextEpisode = () => {
    if (audioData && currentEpisodeIndex < audioData.episodes.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentEpisodeIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };
  const HomeButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #888D6B;
  border-radius: 20px;
  padding: 8px 16px;
  color: #9eff00;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

  const ImageContainer = styled.div`
  width: 90%;
  max-width: 390px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  flex: 0 0 auto;
  top: ${props => props.index === 0 ? '' : '4%'};

  @media (max-width: 640px) {
    width: 55%;
    margin: ${props => props.index !== 0 ? '' : '15px auto'};
    top: ${props => props.index === 0 ? '25%' : '26%'};
    transform: translateY(-60%);
  }
`;

  const handlePreviousEpisode = () => {
    if (currentEpisodeIndex > 0) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentEpisodeIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = (index) => {
    if (index !== currentEpisodeIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        if (episodePlaybackTime > 0) {
          trackPlaybackDuration(audioId, currentEpisodeName, Math.round(episodePlaybackTime));
        }
      }
      if (isPlaying) {
        trackPause(audioId, audioData?.episodes[index]?.name);
      }
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
      setEpisodePlaybackTime(0);
      setPlaybackStartTime(null);
      trackPlay(audioId, audioData.episodes[index]?.name);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      trackPause(audioId, audioData?.episodes[index]?.name);
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (e) => {
    const time = (e.target.value / 100) * duration;
    setCurrentTime(time);
    audioRef.current.currentTime = time;
    trackSeek(audioId, Math.round(time), currentEpisodeName);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSkip = (seconds) => {
    const newTime = currentTime + seconds;
    audioRef.current.currentTime = Math.min(Math.max(newTime, 0), duration);
  };

  const handleVolumeToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    history.push('/');
  };

  if (loading) {
    return (
      <Loader text={"Audio Stories..."} />
    );
  }

  if (error) {
    return (
      <div className="mx-auto relative flex items-center justify-center"
        style={{ width: '640px', height: '100vh', background: '#0A2E2E' }}>
        <div>
          <p>Error loading audio story</p>
          <p>{error}</p>
          <button onClick={() => history.push('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto relative bg-black"
      style={{
        width: '100%',
        maxWidth: '640px',
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        position: 'relative'
      }}
    >
      {/* Home Button */}
      <div
        onClick={() => {
          // Track navigation to home
          trackGoToHome(
            audioId,
            currentEpisodeName
          );
          history.push('/');
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          zIndex: 10,
          maxWidth: 'calc(640px - 40px)', // Ensure it stays within container
          marginLeft: 'auto',
          marginRight: 'auto',
          left: '0',
          right: '0',
          width: 'fit-content',
          transform: isMobile ? 'translateX(200%)' : 'translateX(250%)',
        }}
      >
        <ComicHomeButton text="Home" Icon={HomeRoundedIcon} />
      </div>
      {audioData?.episodes?.map((episode, index) => (
        <div
          key={episode.id}
          className="h-screen w-full bg-black"
          style={{
            position: 'relative',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // justifyContent: 'space-between', // Add this
            minHeight: '600px'
          }}
        >
          {/* Episode Navigation */}
          {index != 0 && (
            <div
              onClick={() => {
                // Scroll to previous episode
                const prevIndex = index - 1;
                const container = containerRef.current;
                const episodeHeight = container.clientHeight;
                container.scrollTo({
                  top: episodeHeight * prevIndex,
                  behavior: 'smooth'
                });

                // Optionally update current episode index
                if (prevIndex > 0) {
                  trackEpisodeChange(audioId, currentEpisodeName, audioData?.episodes[prevIndex]?.name);
                }
                else {
                  trackEpisodeChange(audioId, currentEpisodeName, "");
                }

                setCurrentEpisodeIndex(prevIndex);

                if (audioRef.current && isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}

              style={{
                width: '100%',
                textAlign: 'center',
                color: '#fff',
                padding: '20px 0',
                opacity: 0.7,
                marginBottom: [isMobile] ? '' : '10%',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 1
                }
              }}>
              <div
                style={{
                  color: '#B7B7B7',
                  fontSize: 12,
                  fontFamily: 'Satoshi',
                  fontWeight: '400',
                }}
              >Episode: {index}/{audioData.episodes.length}</div>
              <div
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Satoshi',
                  fontWeight: '500',
                }}
              >{audioData.episodes[index - 1].name}</div>
              <div style={{ marginLeft: '49%', marginTop: '8px' }}><IoIosArrowDown /></div>
              <div style={{ width: '100%', height: '1px', background: '#2C2C2C' }} />
            </div>
          )}
          {/* Episode Navigation */}
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            padding: index != 0 && [isMobile] ? '' : '20px 0',
            padding: index != 0 && [isMobile] ? '' : '20px 0',
            opacity: 0.7,
            marginTop: index == 0 ? '15%' : ''
          }}>
            <div
              style={{
                color: '#B7B7B7',
                fontSize: 15,
                fontFamily: 'Satoshi',
                fontWeight: '500',
              }}
            >Episode: {index + 1}/{audioData.episodes.length}</div>
            <div
              style={{
                color: 'white',
                fontSize:  20,
                fontFamily: 'Satoshi',
                fontWeight: '500',
              }}
            >{audioData.episodes[index].name}</div>
          </div>

          {/* Image Container */}
          <ImageContainer
            index={index}
            style={{
              maxHeight: 'calc(100vh - 400px)'
            }}
          >
            <img
              src={episode.image}
              alt={episode.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </ImageContainer>

          {/* Audio Controls */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 20px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
          }}>
            {/* Progress Bar */}
            <div style={{
              width: '90%',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={index === currentEpisodeIndex && isLoaded ? ((currentTime / duration) * 100 || 0) : 0}
                onChange={handleProgress}
                className="progress-slider"
                disabled={index !== currentEpisodeIndex}
              />

              {/* Time Display */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                margin: '10px 0 20px',
                opacity: 0.7
              }}>
                <span>{index === currentEpisodeIndex ? formatTime(currentTime) : '0:00'}</span>
                <span>-{index === currentEpisodeIndex ? formatTime(duration - currentTime) : '3:02'}</span>
              </div>

              {/* Play Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => togglePlayPause(index)}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: index === currentEpisodeIndex ? 1 : 0.7
                  }}
                >
                  {index === currentEpisodeIndex && isPlaying ?
                    <BsPauseFill size={27} color="#000" /> :
                    <BsFillPlayFill size={27} color="#000" />
                  }
                </button>
              </div>
            </div>

            {/* Next Episode Text */}
            {index < audioData.episodes.length - 1 && (
              <div
                onClick={() => {
                  // Scroll to next episode
                  const nextIndex = index + 1;
                  const container = containerRef.current;
                  const episodeHeight = container.clientHeight;
                  container.scrollTo({
                    top: episodeHeight * nextIndex,
                    behavior: 'smooth'
                  });

                  if (nextIndex < audioData?.episodes?.length - 1) {
                    trackEpisodeChange(audioId, currentEpisodeName, audioData?.episodes[nextIndex]?.name);
                  }
                  else {
                    trackEpisodeChange(audioData, currentEpisodeName, "");
                  }
                  setCurrentEpisodeIndex(nextIndex);

                  // If audio is playing, pause it
                  if (audioRef.current && isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }}
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  marginTop: '40px',
                  opacity: 0.7,
                  cursor: 'pointer', // Add cursor pointer to indicate clickable
                  transition: 'opacity 0.3s ease', // Smooth hover effect
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <div style={{ width: '100%', height: '1px', background: '#2C2C2C' }} />
                <div style={{ marginLeft: '49%' }}>
                  <IoIosArrowUp />
                </div>
                <div
                  style={{
                    color: '#B7B7B7',
                    fontSize: 12,
                    fontFamily: 'Satoshi',
                    fontWeight: '400',
                  }}
                >
                  Episode: {index + 2}/{audioData.episodes.length}
                </div>
                <div>{audioData.episodes[index + 1].name}</div>
              </div>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .progress-slider {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          cursor: pointer;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -4px;
        }

        .progress-slider::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(
            to right,
            white ${(currentTime / duration) * 100 || 0}%,
            rgba(255,255,255,0.3) ${(currentTime / duration) * 100 || 0}%
          );
        }
      `}</style>
    </div>
  );
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '8px'
};

const controlButtonStyle = {
  color: 'white',
  fontSize: '32px',
  cursor: 'pointer'
};

const playButtonStyle = {
  background: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'black'
};

export default AudioPlayer;