import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';
import API_URL from '../../config';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const HeroContainer = styled.div`
  height: 50vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #000;
  @media (max-width: 640px) {
   margin-top: 0%; 
  }
`;

const SlideContainer = styled.div`
  height: 50vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-align: center;
  position: relative;
  cursor: pointer;
`;

const HeroText = styled.div`
  color: #E6D5B8;
  z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px 20px 10px;
  text-align: left;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
  color: #ffffff;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    gap: 4px;
  }
`;

const ContentLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
  padding: 4px 8px;
  background: rgba(230, 213, 184, 0.2);
  border-radius: 4px;
  font-family: 'Satoshi', sans-serif;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 3px 6px;
    margin-top: 4px;
  }
`;

const DescriptionWrapper = styled.div`
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  max-width: 90%;
  color: rgba(230, 213, 184, 0.9);
  margin-bottom: 20px;
  transition: opacity 0.3s ease-in-out;
  
  /* Add these properties for text truncation */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 16px;
  }
`;
const ImageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.8);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.4) 30%,
      rgba(0, 0, 0, 0.8)
    );
    pointer-events: none;
  }
`;
const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: 16px;
    z-index: 2;
    
    li button:before {
      color: #E6D5B8;
      opacity: 0.5;
      font-size: 8px;
    }
    
    li.slick-active button:before {
      color: #E6D5B8;
      opacity: 1;
    }
  }

  // Remove default arrow styles
  .slick-prev, .slick-next {
    display: none !important;

  }
`;

const CustomArrow = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`;

const NextArrow = styled(CustomArrow)`
  right: 20px;
  @media (max-width: 500px) {
    right: 3px;
  }
`;

const PrevArrow = styled(CustomArrow)`
  left: 20px;
  @media (max-width: 500px) {
    left: 3px;
  }
`;



const HeroSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const CustomNextArrow = ({ onClick }) => (
    <NextArrow onClick={onClick}>
      <ArrowForwardIosIcon sx={{ fontSize: isMobile ? 20 : 30 }} />
    </NextArrow>
  );
  
  const CustomPrevArrow = ({ onClick }) => (
    <PrevArrow onClick={onClick}>
      <ArrowBackIosNewIcon sx={{ fontSize: isMobile ? 20 : 30 }} />
    </PrevArrow>
  );
  
useEffect(() => {
  // Only runs on the client side
  if (typeof window !== 'undefined') {
    setIsMobile(window.innerWidth <= 500);
  }
}, []);



  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    lazyLoad: 'ondemand',
    pauseOnHover: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    beforeChange: (current, next) => {
      // Optional: Add any logic before slide change
    },
    afterChange: (current) => {
      // Optional: Add any logic after slide change
    }
  };

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);
        // Fetch all content types
        const [audioResponse, comicsResponse, triviaResponse] = await Promise.all([
          fetch(`${API_URL}/generator/audiostories/`),
          fetch(`${API_URL}/generator/comics/`),
          fetch(`${API_URL}/generator/trivia/`)
        ]);

        if (!audioResponse.ok || !comicsResponse.ok || !triviaResponse.ok)
          throw new Error('Failed to fetch content');

        const audioData = await audioResponse.json();
        const comicsData = await comicsResponse.json();
        const triviaData = await triviaResponse.json();

        // Combine and mark the content type
        const combinedContent = [
          ...audioData.map(item => ({ ...item, contentType: 'audio' })),
          ...comicsData.map(item => ({ ...item, contentType: 'comic' })),
          ...triviaData.map(item => ({ ...item, contentType: 'trivia' }))
        ];

        // Shuffle the combined array
        const shuffledContent = combinedContent.sort(() => Math.random() - 0.5);

        setStories(shuffledContent);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  const handleSlideClick = (contentType, slug) => {
    const paths = {
      audio: '/audio',
      comic: '/comic',
      trivia: '/trivia'
    };
    history.push(`${paths[contentType]}/${slug}`);
  };

  // Helper function to get content type label
  const getContentTypeLabel = (type) => {
    const labels = {
      audio: 'Audio Story',
      comic: 'Comic',
      trivia: 'Trivia '
    };
    return labels[type];
  };

  return (
    <HeroContainer>
      <StyledSlider {...settings}>
        {stories.map((story) => (
          <SlideContainer
            key={story.id}
            onClick={() => handleSlideClick(story.contentType, story.slug)}
          >
            <ImageBackground
              style={{
                backgroundImage: `url(${story.thumbnail})`
              }}
            />
            <HeroText>
              <Title className='font-melodrama'>
                <span>{story.name}</span>
                <ContentLabel>
                  {getContentTypeLabel(story.contentType)}
                </ContentLabel>
              </Title>
              <DescriptionWrapper>
                <Description>{story.description}</Description>
              </DescriptionWrapper>
            </HeroText>
          </SlideContainer>
        ))}
      </StyledSlider>
    </HeroContainer>
  );
};

export default HeroSection;