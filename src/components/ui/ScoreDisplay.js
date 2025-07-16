import React from 'react';
import styled from 'styled-components';

const ScoreContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 150px;
`;

const ScoreBar = styled.div`
  width: 20px;
  background-color: ${props => props.color};
  height: ${props => props.height}%;
  margin-right: 10px;
  position: relative;
  transition: height 0.5s ease-in-out;
`;

const ScoreLabel = styled.span`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%) rotate(-90deg);
  transform-origin: left top;
  white-space: nowrap;
  font-size: 12px;
  color: #ffffff;
`;

const predefinedColors = [
  '#FFA500', // Orange (Wisdom)
  '#9370DB', // Medium Purple (Spiritual growth)
  '#32CD32', // Lime Green (Inner Harmony)
];

const ScoreDisplay = ({ scores }) => {
  const maxScore = Math.max(...scores.map(score => score.value));

  return (
    <ScoreContainer>
      {scores.map((score, index) => (
        <ScoreBar
          key={score.name}
          color={predefinedColors[index]}
          height={(score.value / maxScore) * 100}
        >
          <ScoreLabel>{score.name}</ScoreLabel>
        </ScoreBar>
      ))}
    </ScoreContainer>
  );
};

export default ScoreDisplay;