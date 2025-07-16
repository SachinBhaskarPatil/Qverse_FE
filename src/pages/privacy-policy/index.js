import React from "react";
import dynamic from "next/dynamic";


const PrivacyPolicy = dynamic(
    ()=> import('components/ui/PrivacyPolicyPage'),
    {ssr:false}
);

const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/privacy-policy`;



const Privacy = () =>{

    return(
        <>
            <main>
                <PrivacyPolicy/>
            </main>
        </>
    )

}

export default Privacy;
