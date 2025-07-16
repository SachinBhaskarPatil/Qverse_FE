import React from "react";
import CenteredBox from "./CenteredBox";

const ScrollingLayout=({ children })=>{
    return (
        < CenteredBox>
         <div className="relative h-screen w-full bg-black">
          {/* Main container with hidden scrollbar */}
          <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {children}
          </div>
    
          {/* Add custom CSS to hide scrollbar for all browsers */}
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
        </CenteredBox>
      );
}
export default ScrollingLayout;