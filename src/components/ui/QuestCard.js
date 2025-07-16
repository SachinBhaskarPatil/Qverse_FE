import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import API_URL from '../../config';
import { useRouter } from 'next/router';
import ShareDialog from './ShareButton';
import Tooltip from '@mui/material/Tooltip';
import { styled as muiStyled } from '@mui/material/styles';

const Card = styled.div`
  background-color: transparent;
  border-radius: 16px;
  width: 300px; // Adjusted width
  box-sizing: border-box;
  margin-right: 1.5rem; // Add margin between cards
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 400px; // Adjusted height
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease;
  margin-left: 1rem;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:last-child {
    margin-right: 0rem; // Remove margin from last card
  }
  @media(max-width: 500px){
    width: 250px;
    height: 350px;
  }
`;
// Add tooltip descriptions
const getTooltipContent = (cardType) => {
  switch (cardType) {
    case 'comic':
      return 'Interactive comic stories with choices that matter';
    case 'audio':
      return 'Immersive audio stories with ambient soundscapes';
    case 'trivia':
      return 'Fun and engaging quiz games to test your knowledge';
    case 'video':
      return 'Short-form vertical video content';
    default:
      return 'Interactive story-driven quests';
  }
};
// Custom styled tooltip (optional, for better styling)
const CustomTooltip = muiStyled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  '& .MuiTooltip-tooltip': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    fontSize: '12px',
    padding: '8px 12px',
    borderRadius: '6px',
    maxWidth: '200px',
    fontFamily: 'Satoshi, sans-serif'
  }
});

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  background: #081f1f;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;

  &::after {
    content: '';
    border-style: solid;
    border-width: 10px 0 10px 16px;
    border-color: transparent transparent transparent #000;
    margin-left: 4px;
  }

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Content = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-family: 'Melodrama', serif;
  font-size: 1.25rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media(max-width: 500px){
    font-size: 1rem;
  }

`;

const Description = styled.p`
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  @media(max-width: 500px){
    font-size: 0.78rem;
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid ${props => {
    switch (props.cardType) {
      case 'quest': return '#75FBEF';
      case 'comic': return '#FF69B4';
      case 'audio': return '#9eff00';
      case 'trivia': return '#64C7BE';
      case 'video': return '#FFB800';
      default: return '#75FBEF';
    }
  }};
  color: ${props => {
    switch (props.cardType) {
      case 'quest': return '#75FBEF';
      case 'comic': return '#FF69B4';
      case 'audio': return '#9eff00';
      case 'trivia': return '#64C7BE';
      case 'video': return '#FFB800';
      default: return '#75FBEF';
    }
  }};
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
`;

const NumberTag = styled.div`
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  background: #FF4B4B;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
`;

const QuestCard = ({
  title,
  image,
  description,
  players,
  isPopular,
  slug,
  cardType // Add this prop
}) => {

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);


  const router = useRouter();

  const handleCardClick = () => {
    const paths = {
      comic: '/comic',
      audio: '/audio',
      trivia: '/trivia',
      quest: '/gameplay',
      video: '/shorts'
    };

    router.push({
      pathname: `${paths[cardType]}/${slug}`,
      state: {
        title: title
      }
    });
  };

  const handleShare = async (type) => {
    const shareText = `I just played an AI-generated game of ${title} on Zo.live. Check it out!`;

    switch (type) {
      case 'clipboard':
        try {
          await navigator.clipboard.writeText(shareText);
          // toast.success('Copied to clipboard!', {
          //   position: "top-center",
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "dark",
          // });
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;

      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`);
        break;

      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
        break;
    }
    setIsShareDialogOpen(false);
  };


  return (
    <>
      <Card onClick={handleCardClick}>
      <ImageContainer>
        <Image src={image} alt={title} />
        <PlayButton />
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
      <ShareDialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShare}
      />
    </Card>
    </>
  );
};

export default QuestCard;