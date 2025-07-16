import React from 'react';
import { Dialog, DialogContent, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      backgroundColor: '#1E1E1E',
      borderRadius: '12px',
      padding: theme.spacing(2),
      maxWidth: '100%',
      width: '30%',
      [theme.breakpoints.down('sm')]: {
        margin: 0,
        width: '100%',
        maxWidth: 'none',
        height: '30%',
        maxHeight: '50%',
        position: 'fixed',
        bottom: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiDialog-container': {
        alignItems: 'flex-end',
      },
    },
  }));

const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
  textAlign: 'center',
});

const StyledTitle = styled(Typography)({
  color: '#9eff00',
  fontFamily: 'Melodrama, serif',
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '16px',
});

const StyledMessage = styled(Typography)({
  color: '#CDCDCD',
  fontFamily: 'Satoshi, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.5,
});

const SubmissionGratification = ({ open, onClose }) => (
  <StyledDialog open={open} onClose={onClose} maxWidth="xs">
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: '#FFF',
      }}
    >
      <CloseIcon />
    </IconButton>
    <StyledDialogContent>
      <StyledTitle>
        Submission Received! 🌍
      </StyledTitle>
      <StyledMessage>
        Thank you for submitting your world. We'll start processing it soon and keep you updated as the process unfolds.
      </StyledMessage>
    </StyledDialogContent>
  </StyledDialog>
);

export default SubmissionGratification;