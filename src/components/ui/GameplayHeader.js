import React from 'react';
import styled from 'styled-components';
import RewardStack from './RewardStack';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const GameplayHeader = ({ scores, rewards }) => {
  return (
    <HeaderContainer>
      {/* <ScoreDisplay scores={scores} /> */}
      <RewardStack rewards={rewards} />
    </HeaderContainer>
  );
};

export default GameplayHeader;