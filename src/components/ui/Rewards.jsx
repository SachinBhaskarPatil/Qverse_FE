import React, { useState } from 'react';
import styled from 'styled-components';
import ProgressBar from './Progesbars';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CenteredBox from './Layouts/CenteredBox';

const mobile = '@media (max-width: 768px)';


const PageContainer = styled.div`
  background-color: #000000;
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  ${mobile} {
    padding: 10px;
  }
`;

const Title = styled.h1`
font-family: 'Melodrama', serif;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  ${mobile} {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

const ScoreTitle = styled.h2`
text-align: center;
margin-bottom: 21px;
  font-size: 1.5rem;
  ${mobile} {
    font-size: 1.2rem;
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
  justify-items: center;
  ${mobile} {
    margin-bottom: 20px;
    justify-items: center;
  }

  .progress-container {
    transform: rotate(0deg) !important;
    width: 100% !important;
    height: 40px !important;
    border-radius: 20px !important;
    position: relative;
    z-index: 1; /* Ensure progress bar is below shield */
  }
  ${mobile} {
    height: 30px !important;
  }

  .progress-fill {
    transform: rotate(0deg) !important;
    border-radius: 20px !important;
    z-index: 1; /* Ensure fill is below shield */
  }
`;



const RewardsSection = styled.div`
  margin-bottom: 30px;
`;

const RewardsTitle = styled.h2`
  font-size: 2rem;
  font-family: 'Melodrama', serif;
  text-align: center;
  margin-bottom: 20px;

  ${mobile} {
    font-size: 1.5rem;
    margin-bottom: 15px;
    margin-top: 30%;
  }
  
`;

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
  overflow-y: auto;
  padding: 0 27% 20px;
  max-height: calc(100vh - 550px);
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  ${mobile} {
    padding: 0 5% 20px;
    gap: 5px;
    max-height: calc(100vh - 250px);
  }
`;

// const RewardItem = styled.div`
//   background-color: #0e1e20;
//   border-radius: 10px;
//   overflow: hidden;
//   width: 100%;
//   aspect-ratio: 1;

//   ${props => props.highlighted && `
//     border: 2px solid #ffd700;
//     box-shadow: 0 0 10px #ffd700;
//   `}
// `;

const RewardImage = styled.img`
  width: 100%;
  height: auto; // Maintain aspect ratio
  
  ${mobile} {
    object-fit: cover; // Ensure image covers the area without distortion
  }
`;


const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #1A1A1A;
    border-radius: 12px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
  }
`;

const DialogTitle = styled.h2`
  color: white;
  font-family: 'Melodrama', serif;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const ShareOption = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: #34748A;
  box-shadow: 0px 4px 0px #225B6F;
  border-radius: 8px;
  border: none;
  color: white;
  font-family: 'OffBit Trial', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2C5965;
  }
`;


const ShareButton = styled.button`
  width: 200px;
  padding: 12px 30px;
  background: #34748A;
  box-shadow: 0px 8px 0px #225B6F;
  border-radius: 12px;
  border: 1px solid #34748A;
  display: block;
  margin: 20px auto 0;
  
  color: white;
  font-size: 24px;
  font-family: 'OffBit Trial', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.24px;
  
  cursor: pointer;

  ${mobile} {
    width: 25%;
    font-size: 18px;
    padding: 10px 10px;

  }
`;

const RewardItem = styled.div`
  background-color: #0e1e20;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  position: relative; // Add this to contain the overlay

  ${props => props.highlighted && `
    border: 2px solid #ffd700;
    box-shadow: 0 0 10px #ffd700;
  `}
`;

const RewardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none; // Add this to prevent overlay from interfering with interactions
  
  ${RewardItem}:hover & {
    opacity: 1;
  }
`;

const RewardTitle = styled.h3`
  color: #75FBEF;
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
  padding: 0 5px;
  
  ${mobile} {
    font-size: 12px;
  }
`;

const RewardDescription = styled.p`
  color: #FFFFFF;
  font-family: 'Satoshi', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  padding: 0 5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  ${mobile} {
    font-size: 10px;
    -webkit-line-clamp: 2;
  }
`;


const QuestCompletePage = () => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const router = useRouter();
  const { query } = router;  
    const scores = query.scores ? JSON.parse(query.scores) : [];
    const rewardsCards = query.rewardsCards ? JSON.parse(query.rewardsCards) : [];
    const reward = query.reward ? JSON.parse(query.reward) : [];
    const gameTitle = query.gameTitle || '';
    
  const totalScore = scores.reduce((sum, score) => sum + (score?.value || 0), 0);
  const maxScore = 300; // Maximum possible score
  const scoreRatio = (totalScore / maxScore) * 100;

  const handleShare = async (type) => {
    const shareText = `I just played an AI generated game of ${gameTitle} on Zo.live and scored ${scoreRatio}. Checkout https://Zo.live for amazing AI generated games!`;

    switch (type) {
      case 'clipboard':
        try {
          await navigator.clipboard.writeText(shareText);
          toast.success('Copied to clipboard!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
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
    setOpenShareDialog(false);
  };


  return (
    <CenteredBox>
    <PageContainer>
      <ToastContainer />
      <Title>Quest Complete!</Title>
      <ScoreTitle className='font-offbit'>Your Score</ScoreTitle>

      <ProgressWrapper>
        <ProgressBar scores={scores} />
      </ProgressWrapper>

      <RewardsSection>
        <RewardsTitle>REWARDS</RewardsTitle>
        {(!rewardsCards || rewardsCards.length === 0) ? (
          <div style={{
            textAlign: 'center',
            color: '#CDCDCD',
            fontSize: '1.2rem',
            fontFamily: 'Satoshi, sans-serif',
            marginTop: '2rem'
          }}>
            You haven't earned any rewards yet!
          </div>
        ) : (
          <RewardsGrid>
            {/* Filter unique rewards based on imageUrl */}
            {Array.from(new Map(rewardsCards.map(card => [card.imageUrl, card])).values()).map((reward, index) => (
              <RewardItem key={index}>
                <RewardImage src={reward.imageUrl} alt={reward.title} />
                <RewardOverlay className="reward-overlay">
                  <RewardTitle>
                    {reward.title}
                  </RewardTitle>
                  <RewardDescription>
                    {reward.description}
                  </RewardDescription>
                </RewardOverlay>
              </RewardItem>
            ))}
          </RewardsGrid>
        )}
      </RewardsSection>

      <ShareButton onClick={() => setOpenShareDialog(true)}>SHARE</ShareButton>

      <StyledDialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
      >
        <DialogContent>
          <DialogTitle>Share Your Achievement</DialogTitle>
          <ShareOption onClick={() => handleShare('clipboard')}>
            Copy to Clipboard
          </ShareOption>
          <ShareOption onClick={() => handleShare('twitter')}>
            Share on Twitter
          </ShareOption>
          <ShareOption onClick={() => handleShare('facebook')}>
            Share on Facebook
          </ShareOption>
        </DialogContent>
      </StyledDialog>
    </PageContainer >
    </CenteredBox>
  );
};

export default QuestCompletePage;
