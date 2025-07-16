import React from "react";
import {  useState,useEffect, memo } from "react";
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';

const Timer = memo(({ time, isActive, onComplete }) => {
    const [currentTime, setCurrentTime] = useState(time);

    useEffect(() => {
        let interval = null;

        if (isActive && currentTime > 0) {
            interval = setInterval(() => {
                setCurrentTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (currentTime === 0) {
            onComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, currentTime, onComplete]);

    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="flex flex-row gap-1">
            <WatchLaterRoundedIcon sx={{
                fill: '#fff',
                fontSize: {
                    xs: '1.4rem',
                    sm: '1.1rem',
                    md: '1.2rem',
                    lg: '1.4rem'
                }
            }} />
            <div className="self-center">{formatTime(currentTime)}</div>
        </div>
    );
});
export default Timer;