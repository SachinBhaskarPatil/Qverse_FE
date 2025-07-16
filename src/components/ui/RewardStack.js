import React from 'react';
import styled from 'styled-components';

const StackContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const RewardCard = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: rotate(${props => props.rotation}deg);
  z-index: ${props => props.zIndex};
`;

const RewardStack = ({ rewards }) => {
  return (
    <StackContainer>
      {rewards.slice(-3).map((reward, index) => (
        <RewardCard
          key={index}
          imageUrl={reward}
          rotation={index * 5}
          zIndex={index}
        />
      ))}
    </StackContainer>
  );
};

export default RewardStack;