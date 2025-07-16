import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import QuestCard from './QuestCard';
import API_URL from '../../config';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip as ReactTooltip } from 'react-tooltip';


const QuestSectionContainer = styled.section`
  width: 100%;
  max-width: 100%;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #64C7BE;
  font-family: 'Melodrama', serif;
  fontWeight: '700';
  @media(max-width:480px){
  font-size: 1.2rem;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;

/* Hide scrollbar for Firefox */
  scrollbar-width: none;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE and Edge */
  -ms-overflow-style: none;

  @media(max-width: 500px) {
    gap: 0rem;
  }
`;

const QuestCardWrapper = styled.div`

  margin-right: 20px;
  
  @media (max-width: 768px) {
    width: calc(100% / 2); /* Adjust for smaller screens */
  }

  @media (max-width: 480px) {
    width: calc(75% / 1); /* Full width on very small screens */
  }
`;
const SeeAllLink = styled.a`
  color: #75FBEF;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1%;
  @media(max-width: 500px){
    margin-bottom: 5%;
    font-size: 0.7rem;
  }
`;

const CategoryHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative; // Add this
  @media(max-width: 500px){
    margin-bottom: 0;
  }
`;




const QuestSection = () => {
  const [quests, setQuests] = useState([]);
  const [comics, setComics] = useState([]);
  const [audioStories, setAudioStories] = useState([]);
  const [triviaQuizzes, setTriviaQuizzes] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);
        const [questsResponse, comicsResponse, audioResponse, triviaResponse, shortvideos] = await Promise.all([
          axios.get(`${API_URL}/gameplay/universes/`),
          axios.get(`${API_URL}/generator/comics/`),
          axios.get(`${API_URL}/generator/audiostories/`),
          axios.get(`${API_URL}/generator/trivia/`),
          axios.get(`${API_URL}/generator/shortvideos/`),
        ]);

        // Process all quests into a flat array
        const allQuests = questsResponse.data.universe.reduce((acc, uni) => {
          return [...acc, ...uni.quests.map(quest => ({ ...quest, cardType: 'quest' }))];
        }, []);

        // Process other content
        const comicsData = comicsResponse.data.map(comic => ({ 
          ...comic, 
          cardType: 'comic' 
        }));

        const audioStoriesData = audioResponse.data.map(audio => ({ 
          ...audio, 
          cardType: 'audio' 
        }));

        const triviaQuizzesData = triviaResponse.data.map(trivia => ({ 
          ...trivia, 
          cardType: 'trivia' 
        }));

        const videosData = shortvideos.data.map(video => ({ 
          ...video, 
          cardType: 'video' 
        }));

        // Set content in state
        setQuests(allQuests);
        setComics(comicsData);
        setAudioStories(audioStoriesData);
        setTriviaQuizzes(triviaQuizzesData);
        setVideos(videosData);

      } catch (error) {
        console.error('Error fetching content:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);


  const handleSeeAll = (category) => {
    try {
      let path;
      
      switch (category) {
        case 'quest':
          path = '/category/quests';
          break;
        case 'comic':
          path = '/category/comics';
          break;
        case 'audio':
          path = '/category/audio';
          break;
        case 'trivia':
          path = '/category/trivia';
          break;
        case 'video':
          path = '/category/shorts';
          break;
        default:
          return;
      }
  
      // Use router.push with query parameters instead of state
      router.push({
        pathname: path,
        // query: { 
        //   type: category,
        //   title: getCategoryTitle(category)
        // }
      });
    } catch (error) {
      console.error('Error handling see all:', error);
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'quest':
        return 'Quests';
      case 'comic':
        return 'Comics';
      case 'audio':
        return 'Audio Stories';
      case 'trivia':
        return 'Trivia Quizzes';
      case 'video':
        return 'Short Videos';
      default:
        return 'Content';
    }
  };




  
   if (loading) {
    return (
      <QuestSectionContainer>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      </QuestSectionContainer>
    );
   }

   if (error) {
     return (
       <QuestSectionContainer>
         <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
           Error: {error}
         </div>
       </QuestSectionContainer>
     );
   }

   return (
     <QuestSectionContainer>
       {/* Quests */}
       {quests.length > 0 && (
         <CategorySection>
           <CategoryHeader>
          <CategoryTitle>Quests <InfoIcon data-tooltip-id="my-tooltip-1" sx={{color: 'white', width: '1.3rem', height: '1.3rem'}}/>  </CategoryTitle>
          <SeeAllLink onClick={() => handleSeeAll('quest')}>
              see all
            </SeeAllLink>
        </CategoryHeader>
           <HorizontalScroll>
             {quests.map((quest, idx) => (
               <QuestCardWrapper key={`quest-${quest.id || idx}`}>
                 <QuestCard
                   title={quest.name}
                   image={quest.thumbnail}
                   description={quest.description}
                   players={quest.playing}
                   isPopular={true}
                   slug={quest.slug}
                   cardType="quest"
                 />
               </QuestCardWrapper>
             ))}
           </HorizontalScroll>
         </CategorySection>
       )}

       {/* Comics */}
       {comics.length > 0 && (
         <CategorySection>
           <CategoryHeader>
            <CategoryTitle>Comics <InfoIcon data-tooltip-id="my-tooltip-2" sx={{color: 'white', width: '1.3rem', height: '1.3rem'}}/>  </CategoryTitle>
            <SeeAllLink onClick={() => handleSeeAll('comic')}>
              see all
            </SeeAllLink>
          </CategoryHeader>
           <HorizontalScroll>
             {comics.map((comic, idx) => (
               <QuestCardWrapper key={`comic-${comic.id || idx}`}>
                 <QuestCard
                   title={comic.name}
                   image={comic.thumbnail}
                   description={comic.description}
                   players={comic.playing}
                   isPopular={true}
                   slug={comic.slug}
                   cardType="comic"
                 />
               </QuestCardWrapper>
             ))}
           </HorizontalScroll>
         </CategorySection>
       )}

       {/* Audio Stories */}
       {audioStories.length > 0 && (
         <CategorySection>
           <CategoryHeader>
            <CategoryTitle>Audio Stories <InfoIcon data-tooltip-id="my-tooltip-3" sx={{color: 'white', width: '1.3rem', height: '1.3rem'}} />  </CategoryTitle>
            <SeeAllLink onClick={() => handleSeeAll('audio')}>
              see all
            </SeeAllLink>
          </CategoryHeader>
           <HorizontalScroll>
             {audioStories.map((audioStory, idx) => (
               <QuestCardWrapper key={`audio-${audioStory.id || idx}`}>
                 <QuestCard
                   title={audioStory.name}
                   image={audioStory.thumbnail}
                   description={audioStory.description}
                   players={audioStory.playing}
                   isPopular={true}
                   slug={audioStory.slug}
                   cardType="audio"
                 />
               </QuestCardWrapper>
             ))}
           </HorizontalScroll>
         </CategorySection>
       )}

       {/* Trivia */}
       {triviaQuizzes.length > 0 && (
         <CategorySection>
           <CategoryHeader>
            <CategoryTitle>Trivia Quizes <InfoIcon data-tooltip-id="my-tooltip-4" sx={{color: 'white', width: '1.3rem', height: '1.3rem'}} />  </CategoryTitle>
            <SeeAllLink onClick={() => handleSeeAll('trivia')}>
              see all
            </SeeAllLink>
          </CategoryHeader>
           <HorizontalScroll>
             {triviaQuizzes.map((triviaQuiz, idx) => (
               <QuestCardWrapper key={`trivia-${triviaQuiz.id || idx}`}>
                 <QuestCard
                   title={triviaQuiz.name}
                   image={triviaQuiz.thumbnail}
                   description={triviaQuiz.description}
                   players={triviaQuiz.playing}
                   isPopular={true}
                   slug={triviaQuiz.slug}
                   cardType="trivia"
                 />
               </QuestCardWrapper>
             ))}
           </HorizontalScroll>
         </CategorySection>
       )}

       {/* Videos */}
       {videos.length > 0 && (
         <CategorySection>
           <CategoryHeader>
            <CategoryTitle>Video <InfoIcon data-tooltip-id="my-tooltip-5" sx={{color: 'white', width: '1.3rem', height: '1.3rem'}} />  </CategoryTitle>
            <SeeAllLink onClick={() => handleSeeAll('video')}>
              see all
            </SeeAllLink>
          </CategoryHeader>
           <HorizontalScroll>
             {videos.map((video, idx) => (
               <QuestCardWrapper key={`video-${video.id || idx}`}>
                 <QuestCard
                   title={video.name}
                   image={video.thumbnail}
                   description={video.description}
                   players={video.playing}
                   isPopular={true}
                   slug={video.slug}
                   cardType="video"
                 />
               </QuestCardWrapper>
             ))}
           </HorizontalScroll>
         </CategorySection>
       )}
       <div style={{
        height:'35px',
       }} ></div>
       <ReactTooltip
        id="my-tooltip-1"
         place='right'
        content="Interactive story-driven quests"
        
      />
       <ReactTooltip
        id="my-tooltip-2"
        content="Interactive comic stories with choices that matter"
      />
       <ReactTooltip
        id="my-tooltip-3"
        place='right'
        content="Immersive audio stories with ambient soundscapes"
    >
      
    </ReactTooltip>
       <ReactTooltip
        id="my-tooltip-4"
        place='right'
        content="Fun and engaging quiz games to test your knowledge"
      />
       <ReactTooltip
        id="my-tooltip-5"
        place='right'
        content="Short-form vertical videos are quick, mobile-friendly."
      />
     </QuestSectionContainer>
   );
};

export default QuestSection;