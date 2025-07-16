// pages/_document.js
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Google Fonts */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link rel="icon" href="/favicon.ico"/>
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
                    <link rel="manifest" href="/site.webmanifest?v=2" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#5bbad5" />
                    <link rel="shortcut icon" href="/favicon.ico?v=2" />
                    {/* Move viewport meta tag to _app.js or individual pages */}
                    <link href="https://fonts.cdnfonts.com/css/offbit-trial" rel="stylesheet" />
                    <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
                    <link href="https://db.onlinewebfonts.com/c/07bc7a23fb2970eba5d16075c7bafe73?family=CCMightyMouth+W05+Regular" rel="stylesheet" />
                    <link href="https://api.fontshare.com/v2/css?f[]=melodrama@400&display=swap" rel="stylesheet" />
                    <link href="https://fonts.cdnfonts.com/css/bogart-trial" rel="stylesheet"/>
                
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
