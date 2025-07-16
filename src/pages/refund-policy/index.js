import React from "react";
import dynamic from "next/dynamic";


const RefundPolicy = dynamic(
    ()=> import('components/ui/RefundPolicyPage'),
    {ssr:false}
);

const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/refund-policy`;



const Refund = () =>{

    return(
        <>
            <main>
                <RefundPolicy/>
            </main>
        </>
    )

}

export default Refund;
