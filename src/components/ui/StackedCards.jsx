import React from 'react';
import ImageCard from './Imagecard';

const StackedCards = ({ cards }) => {
  return (
    <div className="relative mt-4 sm:mt-3"> {/* Added positive margin for spacing from header */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute transition-all duration-300 ease-in-out hover:-translate-y-1 hover:rotate-2"
            style={{
              bottom: `${index * 5}%`,
              left: `${index * 5}%`,
              zIndex: cards.length - index,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <ImageCard 
              imageUrl={card} 
              altText={card.altText}
              className="w-full h-full object-cover rounded-md shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedCards;