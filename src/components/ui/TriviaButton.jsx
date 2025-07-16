import { useState, useRef } from "react";
import React from "react";

const TriviaButton = ({ question, onAnswerSelected, showResults }) => {
    const [clicked, setClicked] = useState(false);
    const [pressed, setPressed] = useState(false);

    const rightAudio = useRef(new Audio("https://together-web-assets.s3.ap-south-1.amazonaws.com/correct.mp3"));
    const wrongAudio = useRef(new Audio("https://together-web-assets.s3.ap-south-1.amazonaws.com/wrong-answer.mp3"));

    const handleClick = () => {
        const isCorrect = question?.is_correct;
        onAnswerSelected(isCorrect);

        // Play correct or wrong audio based on the answer
        if (isCorrect) {
            rightAudio?.current?.play().catch(error => {
                console.error("Error playing right answer sound:", error);
              });;
        } else {
            wrongAudio?.current?.play().catch(error => {
                console.error("Error playing wrong answer sound:", error);
              });
        }
    };

    const handleMouseEnter = () => {
        if (!showResults) setClicked(true);
    };

    const handleMouseLeave = () => {
        if (!showResults) setClicked(false);
    };

    const handleMouseDown = () => {
        if (!showResults) setPressed(true);
    };

    const handleMouseUp = () => {
        if (!showResults) setPressed(false);
    };

    const handleTouchStart = () => {
        if (!showResults) {
            setClicked(true);
            setPressed(true);
        }
    };

    const handleTouchEnd = () => {
        if (!showResults) {
            setClicked(false);
            setPressed(false);
        }
    };

    const getButtonStyles = () => {
        if (showResults) {
            if (question?.is_correct) {
                return 'answer-reveal-correct';
            } else {
                return 'answer-reveal-incorrect';
            }
        }
        return clicked 
            ? 'bg-[#3F8D9F] shadow-[0px_4px_0px_0px_#165B6A]' 
            : 'bg-[rgba(206,206,206,0.50)] backdrop-blur-[1px] border border-[#F6F6F6]';
    };

    return (
        <div
            className={`flex p-2 md:p-4 justify-center items-center gap-2 self-stretch
                rounded-md backdrop-blur-[0.5px]
                sm:p-5 sm:justify-center sm:items-center sm:gap-2 sm:self-stretch
                sm:rounded-md rounded-2xl
                ${getButtonStyles()}
                ${pressed && !showResults ? 'transform translate-y-1 shadow-[0px_2px_0px_0px_#165B6A]' : ''}
                transition-all duration-500 ease-in-out`}
            style={{ 
                borderRadius: '20px',
                pointerEvents: showResults ? 'none' : 'auto'
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="text-white text-center font-satoshi text-[1.2rem] font-medium leading-[1.625rem]
                md:text-[1.25rem] md:leading-[1.625rem]">
                {question?.text}
            </div>
            <style jsx>{`
                @keyframes revealCorrect {
                    0% {
                        background: rgba(206,206,206,0.50);
                        border-color: transparent;
                    }
                    100% {
                        background: rgba(30,141,95,0.50);
                        border: 1px solid #1E8D5F;
                    }
                }

                @keyframes revealIncorrect {
                    0% {
                        background: rgba(206,206,206,0.50);
                        border-color: transparent;
                    }
                    100% {
                        background: rgba(195,21,34,0.50);
                        border: 1px solid #C31522;
                    }
                }

                .answer-reveal-correct {
                    animation: revealCorrect 0.5s ease-in-out forwards;
                }

                .answer-reveal-incorrect {
                    animation: revealIncorrect 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};

export default TriviaButton;
