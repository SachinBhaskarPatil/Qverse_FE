import React from 'react';
import ComicHomeButton from './ComicHomeButton';  // Import the button correctly
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
const TriviaScoreCard = ({ score, totalQuestionLength, name }) => {
    const rewardImage = "https://together-web-assets.s3.ap-south-1.amazonaws.com/reward_trivia.svg";

    return (
        <div className="bg-black text-white flex flex-col items-center min-h-screen">
            <div class="flex flex-col gap-1">
                <div className="text-sm md:text-base lg:text-xl font-normal  text-center text-[#B7B7B7] tracking-wide leading-[1.1] font-satoshi">
                    Trivia complete
                </div>
                <div className="text-center text-lg md:text-xl lg:text-2xl font-medium mb-8 text-[#FFF] tracking-wide leading-[1.375] capitalize font-satoshi">
                    {name}
                </div>
            </div>

            <div className="text-2xl md:text-3xl lg:text-5xl font-extrabold mb-8 text-[#64C7BE] tracking-[0.04rem] leading-[2.2rem] uppercase font-offbit mt-4">
                CONGRATULATIONS!
            </div>

            <img src={rewardImage} alt="image" className="w-48 h-36 sm:w-56 sm:h-44 md:w-64 md:h-52 lg:w-72 lg:h-60 xl:w-80 xl:h-50 " />
            <div className="flex gap-8 mb-8 mt-6 items-center">
    <div className="flex flex-col items-center">
        <div className="text-base md:text-lg lg:text-xl font-light mb-2 text-[#FFF] tracking-[0.01rem] leading-[1.1] capitalize text-center font-satoshi">
            Correct
        </div>

        <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#64C7BE] tracking-[0.02rem] leading-[2.2rem] uppercase font-satoshi">
            {score}
        </div>
    </div>

    <div className="bg-[#2C2C2C] w-[0.0625rem] h-[4.875rem]"></div> {/* Removed the rotate-90 */}
    
    <div className="flex flex-col items-center">
        <div className="text-base md:text-lg lg:text-xl font-light mb-2 text-[#FFF] tracking-[0.01rem] leading-[1.1] capitalize text-center font-satoshi">
            Incorrect
        </div>

        <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#64C7BE] tracking-[0.02rem] leading-[2.2rem] uppercase font-satoshi">
            {totalQuestionLength - score}
        </div>
    </div>
</div>


            <div className="mt-4">
            <ComicHomeButton text={"Back to home"} Icon={ArrowBackRoundedIcon} />
            </div>
        </div>
    );
};

export default TriviaScoreCard;
