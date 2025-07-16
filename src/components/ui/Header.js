import React, { useState } from 'react';
import styled from 'styled-components';
import CreateUniverseModal from './CreateUniverseModal';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

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
  background-color: rgba(0, 0, 0, 0.5);
  color: #9eff00;
  border: 1px solid #9eff00;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RewardsButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border: none;
`;

const GiftIcon = styled.span`
  margin-right: 0.5rem;
`;

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        {/* <RewardsButton> */}
          {/* <GiftIcon>🎁</GiftIcon> */}
          {/* REWARDS */}
        {/* </RewardsButton> */}
      </HeaderContainer>
      <CreateUniverseModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Header;