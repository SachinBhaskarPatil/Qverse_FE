import React from 'react';
import { useRouter } from 'next/router';


const ComicHomeButton = ({ text, Icon }) => { // Expecting the Icon as a prop
    const history = useRouter();

    const handleClick = () => {
        history.push('/other-content');
    };

    return (
        <div
            className="inline-flex p-1.5 px-1.5 justify-center items-center gap-1 border rounded-[0.5rem] border-[#888D6B] bg-gradient-to-r from-black/50 to-black sm:flex-col sm:justify-center cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-row gap-1 items-center">
                {Icon &&
                <Icon sx={{
                    fill: '#E2FA55',
                    fontSize: { xs: 18, sm: 15, md: 20, lg: 25 }
                }} />}
                <div className="font-offbit text-[#E2FA55] text-center text-xs font-extrabold leading-normal tracking-[0.0175rem] uppercase sm:text-sm md:text-base lg:text-lg mt-[0.2rem]">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default ComicHomeButton;
