import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
  } from '@mui/material';
import { DNA } from 'react-loader-spinner';

const Loader=({text})=>{
    const LoadingOverlay = styled(Box)({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(0, 25, 50, 0.9) 0%, rgba(0, 15, 30, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
      });
    return(<LoadingOverlay>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box sx={{ mb: 2 }}>
            <DNA
              visible={true}
              height="120"  // Reduced height to fit within 640px
              width="120"   // Reduced width to fit within 640px
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </Box>
          <div className="font-offbit text-center font-medium tracking-wide text-[1rem] text-white">
            Loading {text}
          </div>
        </Box>
      </LoadingOverlay>)
}

export default Loader;