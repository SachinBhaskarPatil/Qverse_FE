import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import styled from 'styled-components';

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

const ShareDialog = ({ open, onClose, onShare }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <DialogContent>
        <DialogTitle>Share This Game</DialogTitle>
        <ShareOption onClick={() => onShare('clipboard')}>
          Copy to Clipboard
        </ShareOption>
        <ShareOption onClick={() => onShare('twitter')}>
          Share on Twitter
        </ShareOption>
        <ShareOption onClick={() => onShare('facebook')}>
          Share on Facebook
        </ShareOption>
      </DialogContent>
    </StyledDialog>
  );
};

export default ShareDialog;