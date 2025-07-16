import React from 'react';
import Box from '@mui/material/Box';

const CenteredBox = ({ children }) => {
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 0,
        maxWidth: '640px',
        mx: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
