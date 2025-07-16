import React from 'react'; 
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'themes/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/components/ui/queryClient';
import dynamic from 'next/dynamic';

const InitializeGoogleAnalytics = dynamic(
    () => import('@/components/ui/InitializeGoogleAnalytics'),
    { ssr: false } 
  );
const MyApp = ({ Component, pageProps }) => {
    
    return (
        <QueryClientProvider client={queryClient}><ThemeProvider theme={theme}>
        <CssBaseline />
        <InitializeGoogleAnalytics/>
        <Component {...pageProps} /></ThemeProvider></QueryClientProvider>);
};

export default MyApp;

