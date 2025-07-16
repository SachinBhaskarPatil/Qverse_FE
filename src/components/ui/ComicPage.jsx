import React from 'react';
import { useEffect, useCallback } from 'react';
import ComicTitle from "./ComicTitle";
import ComicHomeButton from 'components/ui/ComicHomeButton';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ComicPage = ({ 
  image, 
  title, 
  currentPageIndex,
  pageCount, 
  onPageChange 
}) => {
  const currentPage = image?.page_number || 1;

  const handleNextPage = useCallback(() => {
    onPageChange('next');
  }, [onPageChange]);

  const handlePreviousPage = useCallback(() => {
    onPageChange('previous');
  }, [onPageChange]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowUp') {
        handlePreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextPage, handlePreviousPage]);

  return (
    <div className="relative h-full w-full snap-start snap-always">
      {currentPage > 1 && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
          <div
            className="text-[0.75rem] sm:text-[0.8rem] md:text-[0.8rem] lg:text-[0.8rem] font-mightyMouth font-bold mb-[-0.2rem]"
            style={{ color: '#B7B7B7' }}
          >
            page {currentPage - 1}
          </div>
          <button
            onClick={handlePreviousPage}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Previous page"
          >
            <ExpandLessIcon sx={{
              fill: '#CDCDCD',
              fontSize: { xs: 18, sm: 15, md: 20, lg: 25 }
            }} />
          </button>
        </div>
      )}

      <div className="relative h-full w-full">
        <img
          src={image?.image}
          alt={`Comic page ${currentPage}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-black/20 to-black/70 z-0"></div>
      </div>

      {currentPage === 1 && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 mt-2 min-w-[150px] sm:min-w-[180px] md:min-w-[100px]">
          <div className="relative px-0.5 sm:px-1 md:px-1.5 py-2 sm:py-3 md:py-4 flex items-center justify-center">
            <div
              className="w-full font-mightyMouth font-medium text-center text-[#FFF] text-lg md:text-xl lg:text-2xl leading-normal"
              style={{ whiteSpace: 'normal', maxWidth: '100%' }}
            >
              {title}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-2 sm:top-2 md:top-2 right-4 z-10">
        <ComicHomeButton text="Home" Icon={HomeRoundedIcon} />
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 mt-2 w-full">
        <ComicTitle
          fontSize={{ base: "text-lg" }}
          title={image?.narration_text}
          isShadowShow={false}
        />
      </div>

      <div className="absolute bottom-5 right-2 mb-2 z-10">
        <div
          className="text-[0.75rem] sm:text-[0.8rem] md:text-[0.8rem] lg:text-[0.8rem] font-mightyMouth font-bold mt-[-0.2rem]"
          style={{ color: '#B7B7B7' }}
        >
          page {currentPage}/{pageCount}
        </div>
      </div>

      {currentPage < pageCount && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
          <button
            onClick={handleNextPage}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Next page"
          >
            <ExpandMoreIcon sx={{
              fill: '#CDCDCD',
              fontSize: { xs: 18, sm: 15, md: 20, lg: 25 }
            }} />
          </button>
          <div
            className="text-[0.75rem] sm:text-[0.8rem] md:text-[0.8rem] lg:text-[0.8rem] font-mightyMouth font-bold mt-[-0.2rem]"
            style={{ color: '#B7B7B7' }}
          >
            page {currentPage + 1}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicPage;