import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProgressBar from "@ramonak/react-progress-bar";
import API_URL from '../../config';
import axios from '../../utils/axiosConfig';

const Scoreboard = ({ questId }) => {
    const [scale, setScale] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    const { data: scoreData, isLoading, error } = useQuery(
        ['currentGameplayScore', questId],
        () => axios.get(`${API_URL}/gameplay/current_gameplay_score/`).then(res => res.data),
        { enabled: !!questId }
    );

    const getColor = (score) => {
        if (score <= 20) return '#EF4444'; // red-500
        if (score >= 85) return '#22C55E'; // green-500
        
        // Calculate color between red and green
        const red = Math.round(239 - (score - 20) * (239 - 34) / 65);
        const green = Math.round(68 + (score - 20) * (197 - 68) / 65);
        const blue = Math.round(68 + (score - 20) * (94 - 68) / 65);
        
        return `rgb(${red}, ${green}, ${blue})`;
    };

    useEffect(() => {
        if (scoreData) {
            const totalScore = scoreData.score_data.reduce((sum, item) => sum + item.score, 0);
            const newScale = 1 + (totalScore / (100 * scoreData.score_data.length) * 0.2); // Scale up to 20% larger

            setIsAnimating(true);
            setScale(newScale);

            const animationDuration = 300; // in milliseconds

            setTimeout(() => {
                setIsAnimating(false);
                setScale(1); // Reset scale to 1 after animation
            }, animationDuration);
        }
    }, [scoreData]);

    if (isLoading) return <div>Loading scores...</div>;
    if (error) return <div>Error loading scores</div>;
    if (!scoreData || scoreData.score_data.length === 0) return null;

    const questProgress = (scoreData.current_question_no / scoreData.total_questions) * 100;

    return (
        <div
            className={`bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ease-in-out ${isAnimating ? 'animate-pulse' : ''}`}
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center'
            }}
        >
            <h3 className="text-lg font-semibold mb-2">Scoreboard</h3>
            <div className="space-y-2 mb-4">
                {scoreData.score_data.map((item, index) => (
                    <div key={index} className="flex items-center w-full justify-between" style={{justifyContent:'space-between'}}>
                        <div className="flex items-center">
                            <img src={item.image} alt={item.category} className="w-6 h-6 mr-2" />
                            <span className="text-sm flex-shrink-0 mr-2">{item.category}:</span>
                        </div>
                        <div className='text-right'>
                            <ProgressBar
                                width='20vh'
                                bgColor={getColor(item.score)}
                                baseBgColor='#d9d9d9'
                                completed={item.score}
                                animateOnRender
                                isLabelVisible={false}
                                height="20px"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-1">Quest Progress</h4>
                <ProgressBar
                    completed={questProgress}
                    bgColor="#4F46E5"
                    baseBgColor="#E5E7EB"
                    height="10px"
                    isLabelVisible={false}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Question {scoreData.current_question_no} of {scoreData.total_questions}
                </p>
            </div>
        </div>
    );
};

export default Scoreboard;