import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import HeroSection from './HeroSection';
import QuestSection from './QuestList';
import styled from 'styled-components';
import CreateUniverseModal from './CreateUniverseModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeaderIcon="https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
const AppContainer = styled.div`
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
`;
const LogoContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 1%;
  z-index: 1000;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transform: translateY(${props => (props.$visible ? '0' : '-20px')});
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${props => (props.$visible ? 'auto' : 'none')};

  @media (max-width: 640px) {
    top: 35px;
    left: 20px;
  }
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 640px) {
    height: 40px;
  }
`;

const Logo = ({ show, leftPosition, onClick }) => {
  return (
    <LogoContainer 
      onClick={onClick}
      $visible={show}
      $position={leftPosition}
    >
      <LogoImage
        src="https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg"
        alt="Qverse Logo"
      />
    </LogoContainer>
  );
};


const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreateButton = styled(Button)`
background-color: #9eff00;
color: #000;
border-radius: 12px;
border: 1px solid #9eff00;
width: calc(100% - 40px); // Adjust width with padding from edges
max-width: 190px; // Ensure button doesn't get too wide
padding: 0.5rem 1rem;

position: fixed; // Fix the button to the viewport
bottom: 20px; // Position it at the bottom of the viewport
left: 50%; // Center horizontally
transform: translateX(-50%); // Adjust centering

z-index: 1000;  // Ensure button doesn't get too wide

  @media (max-width: 480px) {
  max-width: 150px; 
  font-size: 0.8rem;
  padding: 0.5rem 0.32rem;
  }
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  box-sizing: border-box;
`;

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: #1A1A1A;
    color: #9eff00;
    border: 1px solid #888D6B;
    border-radius: 8px;
    font-family: 'Satoshi', sans-serif;
  }

  .Toastify__progress-bar {
    background: #9eff00;
  }

  .Toastify__close-button {
    color: #888D6B;
  }

  .Toastify__toast-body {
    font-family: 'Satoshi', sans-serif;
    font-size: 14px;
  }
`;


const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [logoLeftPosition, setLogoLeftPosition] = useState(20);
  const history = useRouter();
  const { query } = history;


  // Calculate logo position on mount and window resize
  useEffect(() => {
    const calculateLogoPosition = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 640) {
        const leftOffset = (windowWidth - 640) / 2 + 20;
        setLogoLeftPosition(leftOffset);
      } else {
        setLogoLeftPosition(20);
      }
    };

    calculateLogoPosition();
    window.addEventListener('resize', calculateLogoPosition);

    return () => window.removeEventListener('resize', calculateLogoPosition);
  }, []);

  // Handle scroll to show/hide logo
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show logo only when at the top (with a small threshold)
      if (currentScrollY <= 10) {
        setShowLogo(true);
      } else {
        setShowLogo(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update the toast effect
  useEffect(() => {
    if (query.data) {
      const state = JSON.parse(query.data);
      const { showSuccessToast, toastId } = state;

      if (showSuccessToast && !toast.isActive(toastId)) {
        toast.success('Successfully submitted!', {
          toastId: toastId,
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: '#1A1A1A',
            color: '#9eff00',
            borderRadius: '8px',
            border: '1px solid #888D6B'
          }
        });
      }
    }
  }, [query]);

  const handleCreateClick = () => {
    history.push('/create');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleLogoClick = () => {
    history.push('/');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <AppContainer>
        <Logo
          onClick={handleLogoClick}
          show={showLogo}
          leftPosition={logoLeftPosition}
        >
          <LogoImage
            src={HeaderIcon}
            alt="Qverse Logo"
          />
        </Logo>
        <ContentWrapper>
          <Header />
          <HeroSection />
          <QuestSection />
          <CreateButton onClick={handleCreateClick}>
            + Create Your Content
          </CreateButton>
        </ContentWrapper>
      </AppContainer>
      <CreateUniverseModal open={isModalOpen} onClose={handleCloseModal} />
      <StyledToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default HomePage;