import React from "react";
import dynamic from "next/dynamic";


const Growth = dynamic(
    ()=> import('components/ui/HomePage'),
    {ssr:false}
);

const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/other-content`;



const SelfGrowth = () =>{

    return(
        <>
            <main>
                <Growth/>
            </main>
        </>
    )

}

export default SelfGrowth;
