import React from 'react';

const ComicTitle = ({ 
    title, 
    isShadowShow = true,
    fontSize = {
        base: "text-lg",    // default for mobile
        sm: "sm:text-xl",   // small screens
        md: "md:text-2xl",  // medium screens
        lg: "lg:text-3xl"   // large screens
    }
}) => {
    return (
        <div className="flex justify-start w-full p-2"> {/* Align to the left */}
            <div className="relative inline-block w-full">
                {/* Conditionally render the shadow box */}
                {isShadowShow && (
                    <div className="absolute 
                        top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 
                        w-full h-full 
                        bg-red-700 
                        border-2 sm:border-3 md:border-4
                        border-black">
                    </div>
                )}

                {/* Main white box with black border */}
                <div className="relative 
                    bg-white 
                    border-1 sm:border-2 md:border-2
                    border-black 
                    px-0.5 sm:px-1 md:px-1.5
                    py-2 sm:py-3 md:py-4 
                    flex items-center justify-start"> {/* Align content to the left */}
                    <div
                        className={`w-full font-mightyMouth font-bold text-left  {/* Change text alignment to left */}
                            ${fontSize.base}
                            ${fontSize.sm}
                            ${fontSize.md}
                            ${fontSize.lg}
                        `}
                        style={{ color: '#333', maxWidth: '100%' ,whiteSpace: 'pre-line'}}
                    >
                        {title}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicTitle;
