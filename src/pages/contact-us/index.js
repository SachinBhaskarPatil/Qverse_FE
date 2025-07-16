import React from "react";
import dynamic from "next/dynamic";


const ContactUs = dynamic(
    ()=> import('components/ui/ContactUsPage'),
    {ssr:false}
);

const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/contactUs`;



const Contact = () =>{

    return(
        <>
            <main>
                <ContactUs/>
            </main>
        </>
    )

}

export default Contact;
