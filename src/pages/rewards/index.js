import React from 'react';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const QuestCompletePage = dynamic(
  () => import('components/ui/Rewards'),
  { ssr: false }
);

const rewards = () => {
  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/rewards`;
  const finalThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const name = "Rewards";
  const description = "Submit your trivia or quest and claim exciting rewards! Track your score, unlock achievements, and redeem exclusive prizes. Celebrate your success now!"

  const keywords = [
    'Reward Page',
    'Trivia Rewards',
    'Earn Points',
    'Achievements',
    'Game Rewards',
    'Points Redemption',
    'User Generated Content',
    'Create Interactive Content',
    'AI Content Creation',
    'Personalized Content',
    'Create with AI'
  ].join(', ');


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Reward", // Title indicating the reward page
    "description": description, // Description of the page
    "thumbnailUrl": finalThumbnail, // Thumbnail image showcasing the reward or success
    "uploadDate": new Date().toISOString(),
    "contentUrl": pageUrl,       // URL to the reward page
    "author": {
      "@type": "Organization",
      "name": "Zo.live",  // Name of the organization creating or hosting the reward system
      "url": baseUrl      // URL to the organization's homepage
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zo.live", // Name of the publisher
      "url": baseUrl    // URL to the publisher's website
    },
    "mainEntityOfPage": pageUrl,  // URL of the reward page
    "keywords": keywords,         // Keywords relevant to rewards, scores, and quest completion
    "genre": "Reward",            // Genre or category of the page
    "inLanguage": "en",           // Language of the page (default is English)
    "datePublished": new Date().toISOString(),
    "about": {
      "@type": "Thing",
      "name": name,               // The quest or trivia name that led to this reward page
      "url": pageUrl             // URL of the associated quest/trivia page
    },
  };


  return (
    <>
    <NextSeo
        defaultTitle="Zo | AI Enabled Content Creation"
        title={`${name} | Zo.live`}
        description={description}
        canonical={pageUrl}
        url={pageUrl}
        openGraph={{
          url: pageUrl,
          title: `${name} | Zo.live`,
          description: description,
          site_name: 'Zo.live',
          images: [
            {
              url: finalThumbnail,
              width: 800,
              height: 600,
              alt: name,
              type: 'image/jpeg',
            }
          ],
        }}
        twitter={{
          handle: '@Zo_live',
          site: '@Zo_live',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[ 
          {
            name: 'keywords',
            content: keywords
          },
          {
            name: 'twitter:title',
            content: `${name} | Zo.live `
          },
          {
            name: 'twitter:image',
            content: finalThumbnail
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:title',
            content:`${name} | Zo.live `
          },
          {
            property: 'og:description',
            content: description
          },
          {
            property: 'og:image',
            content: finalThumbnail
          },
          {
            property: 'og:image:alt',
            content: `A preview of rewards earned.`
          },
          {
            property: 'og:site_name',
            content: 'Zo.live'
          },
          {
            property: 'og:url',
            content: pageUrl // Assuming you're in a browser context and want the current page URL
          },
        ]}
        
        
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
          <main>
      <QuestCompletePage />
      </main>
    </>
  );
};

export default rewards;
