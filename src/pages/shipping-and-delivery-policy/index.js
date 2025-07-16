import React from "react";
import dynamic from "next/dynamic";


const ShippingPolicy = dynamic(
    ()=> import('components/ui/ShippingPolicyPage'),
    {ssr:false}
);

const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/shipping-delivery-policy`;



const Shipping = () =>{

    return(
        <>
            <main>
                <ShippingPolicy/>
            </main>
        </>
    )

}

export default Shipping;
