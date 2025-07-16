'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@mui/material';
import ComicHomeButton from './ComicHomeButton';

export default function ShortVideoPlayer() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const router = useRouter();
  const observerRef = useRef(null);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [showPlayPauseAnimation, setShowPlayPauseAnimation] = useState(false);

  const fetchVideos = async () => {
    try {
      const response = await fetch('https://api.qverse.life/api/generator/shortvideos/');
      const data = await response.json();
      setVideos(data);

      // Get current slug from pathname
      const currentPath = window.location.pathname;
      const currentSlug = currentPath.split('/shorts/')[1];

      if (currentSlug) {
        const index = data.findIndex(video => video.slug === currentSlug);
        if (index !== -1) {
          setCurrentVideoIndex(index);
          // Scroll to the correct video after a small delay to ensure DOM is ready
          setTimeout(() => {
            const videoHeight = window.innerHeight;
            containerRef.current?.scrollTo({
              top: index * videoHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  useEffect(() => {
    // Pause all videos except current one
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video) {
        if (parseInt(index) === currentVideoIndex) {
          video.play().catch(err => console.log('Playback failed:', err));
          setIsPlaying(true);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentVideoIndex]);

  const handleTimeUpdate = (index) => {
    if (videoRefs.current[index]) {
      const video = videoRefs.current[index];
      const progress = video.currentTime / video.duration;
      setProgress(progress);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRefs.current[currentVideoIndex]) {
      const video = videoRefs.current[currentVideoIndex];
      const newTime = seekTime * video.duration;
      video.currentTime = newTime;
      setProgress(seekTime);
    }
  };

  // const handlePlayPause = () => {
  //   if (videoRefs.current[currentVideoIndex]) {
  //     const video = videoRefs.current[currentVideoIndex];
  //     if (isPlaying) {
  //       video.pause();
  //     } else {
  //       video.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  const handleVolumeChange = (newVolume) => {
    if (videoRefs.current[currentVideoIndex]) {
      videoRefs.current[currentVideoIndex].volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleScroll = debounce((e) => {
    const container = e.target;
    const scrollPosition = container.scrollTop;
    const containerHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / containerHeight);

    if (newIndex !== currentVideoIndex && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
      const video = videos[newIndex];
      if (video) {
        router.push(`/shorts/${video.slug}`, { shallow: true });
      }
    }
  }, 150, { leading: true, trailing: true });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
      return () => containerRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, [videos, currentVideoIndex]);

  useEffect(() => {
    if (!videos.length || !containerRef.current) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7
    };

    const handleScroll = (e) => {
      const currentScroll = containerRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const targetIndex = Math.round(currentScroll / videoHeight);

      if (targetIndex !== currentVideoIndex && targetIndex < videos.length) {
        setCurrentVideoIndex(targetIndex);
        // Update URL
        const video = videos[targetIndex];
        router.push(`/shorts/${video.slug}`, { shallow: true });

        // Reset video position
        if (videoRefs.current[targetIndex]) {
          videoRefs.current[targetIndex].currentTime = 0;
          videoRefs.current[targetIndex].play()
            .catch(err => console.log('Playback failed:', err));
        }
      }
    };

    // Create intersection observer
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'));
          setCurrentVideoIndex(index);

          // Pause all other videos
          Object.entries(videoRefs.current).forEach(([vidIndex, video]) => {
            if (parseInt(vidIndex) !== index && video) {
              video.pause();
              video.currentTime = 0;
            }
          });
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, options);

    // Observe all video containers
    const videoElements = document.querySelectorAll('.video-container');
    videoElements.forEach((element) => {
      observerRef.current.observe(element);
    });

    // Add scroll listener
    containerRef.current.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [videos, currentVideoIndex, router]);



  const handleInfoClick = (e) => {
    e.stopPropagation(); // Prevent video play/pause
    setExpandedInfo(!expandedInfo);
  };

  const handlePlayPause = () => {
    if (videoRefs.current[currentVideoIndex]) {
      const video = videoRefs.current[currentVideoIndex];
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);

      // Show animation
      setShowPlayPauseAnimation(true);
      setTimeout(() => {
        setShowPlayPauseAnimation(false);
      }, 500);
    }
  };




  return (
    <div className="flex justify-center bg-black min-h-screen">
      <main className="max-w-[640px] w-full h-screen relative">

        <button
          onClick={() => router.push('/other-content')}
          className="absolute top-4 right-4 z-50"
        >
          <ComicHomeButton text={"Home"} />
        </button>

        <div
          ref={containerRef}
          className="relative h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
          style={{
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'

          }}
        >
          {videos.map((video, index) => (
            <div
              key={video.slug}
              data-index={index}
              className="relative h-screen w-full snap-start video-container"
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              <video
                ref={el => { videoRefs.current[index] = el; }}
                src={video.url}
                className="absolute top-0 left-0 w-full h-full object-contain z-10"
                playsInline
                loop
                muted={volume === 0}
                onTimeUpdate={() => handleTimeUpdate(index)}
                onLoadedMetadata={(e) => {
                  if (index === currentVideoIndex) {
                    e.target.play().catch(err => console.log('Playback failed:', err));
                  }
                }}
                onClick={handlePlayPause}
              />
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
  bg-black/40 rounded-full p-4 transition-all duration-300 z-40
  ${showPlayPauseAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                style={{ pointerEvents: 'none' }}
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h- text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4 z-30 bg-gradient-to-t from-black/80 to-transparent">
                <div className={`flex items-center justify-between mt-4 transition-opacity duration-300 
    ${expandedInfo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <button onClick={handlePlayPause} className="text-white p-2 hover:bg-white/20 rounded-full">
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        {/* <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> */}
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        {/* <path d="M8 5v14l11-7z" /> */}
                      </svg>
                    )}
                  </button>

                  <button onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                    className="text-white p-2 hover:bg-white/20 rounded-full">
                    {volume === 0 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className={`relative w-full h-1`}>
                  <div className={`w-full h-1 bg-gray-600/30 rounded-full ${expandedInfo ? 'opacity-0' : 'opacity-100'}`}>
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-200"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={progress}
                    onChange={handleSeek}
                    className="absolute w-full h-1 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="mt-4 cursor-pointer" onClick={handleInfoClick}>
                  <h2 className={`text-xl font-bold text-white ${expandedInfo ? '' : 'truncate'}`}>{video.name}</h2>
                  <p className={`text-sm text-gray-200 ${expandedInfo ? '' : 'line-clamp-2'} mb-2`}>{video.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}