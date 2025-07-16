import React from 'react';
import { initializeGA,trackSessionStart, trackSessionEnd } from '@/utils/analytics';
import { useEffect } from 'react';
import ReactGA from 'react-ga';
const InitializeGoogleAnalytics=()=>{
    useEffect(() => {
        initializeGA();
        trackSessionStart();
    
        return () => {
          trackSessionEnd();
        };
      }, []);
      useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.hidden) {
            trackSessionEnd();
          } else {
            trackSessionStart();
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, []);   
    return(<></>)
}
export default InitializeGoogleAnalytics;