import React from 'react';
import { useEffect, useState, useRef } from 'react';
import CenteredBox from 'components/ui/Layouts/CenteredBox';
import ComicPage from 'components/ui/ComicPage';
import axiosWrapper from 'utils/helper/axiosWrapper';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Loader from 'components/ui/Loader';

const Comic = () => {
  const DarkOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.70) 100%)',
    zIndex: 1,
  });

  const router = useRouter();
  const { slug } = router.query;
  const [comicPages, setComicPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(null);
  const scrollContainerRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return; // Add this check for Next.js SSR
      
      setLoading(true);
      setError(null);

      try {
        const result = await axiosWrapper.get(`comics/${slug}/`);
        setComicPages(result?.pages);
        setTitle(result?.comic?.name);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Handle scroll to specific page
  const scrollToPage = (pageIndex) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const pageElement = container.children[pageIndex];
    
    if (pageElement) {
      container.scrollTo({
        top: pageElement.offsetTop,
        behavior: 'smooth'
      });
      setCurrentPageIndex(pageIndex);
    }
  };

  // Handle scroll events to update current page
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerHeight = container.clientHeight;
      const scrollPosition = container.scrollTop;
      const newPageIndex = Math.round(scrollPosition / containerHeight);
      
      if (newPageIndex !== currentPageIndex) {
        setCurrentPageIndex(newPageIndex);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentPageIndex]);

  return (
    <>
      {loading && (<Loader text={"Comic..."} />)}
      {!loading && (
        <CenteredBox>
          <div className="relative h-screen w-full bg-black">
            <div
              ref={scrollContainerRef}
              className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
              {comicPages?.map((page, index) => (
                <ComicPage
                  key={page.id}
                  image={page}
                  title={title}
                  currentPageIndex={currentPageIndex}
                  pageCount={comicPages?.length}
                  onPageChange={(direction) => {
                    const nextIndex = direction === 'next' 
                      ? currentPageIndex + 1 
                      : currentPageIndex - 1;
                    if (nextIndex >= 0 && nextIndex < comicPages.length) {
                      scrollToPage(nextIndex);
                    }
                  }}
                />
              ))}
            </div>

            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </CenteredBox>
      )}
    </>
  );
};

export default Comic;