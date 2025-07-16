import React from 'react'; 
import dynamic from 'next/dynamic';
import axiosWrapper from '@/utils/helper/axiosWrapper';
import { NextSeo } from 'next-seo';
import Head from 'next/head';


const Gameplay = dynamic(
  () => import('components/ui/Gameplay'),
  { ssr: false } 
);

const gameplay = ({questData}) => {
  const {
    quest_name,
    description,
    slug,
    thumbnail,
  } = questData;
  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/gameplay/${slug}`;
  const defaultThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const finalThumbnail = thumbnail || defaultThumbnail;

  const keywords = [
    quest_name,
    'AI-Generated Quests',
    'Personalized Quests',
    'Custom AI Quests',
    'Interactive AI Stories',
    'AI-Powered Adventures',
    'Create Your Own Quest',
    'Dynamic Storytelling',
    'AI Quest Maker',
    'Immersive AI Quests',
    'Fantasy AI Quests',
    'Sci-fi AI Quests',
    'AI Storytelling Platform',
    'User-Driven Storylines',
    'AI-Generated Challenges',
    'Customizable Quest Stories'
  ].join(', ');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quest",
    "name": quest_name,                // Title of the quest
    "description": description,  // Brief description of the quest
    "thumbnailUrl": finalThumbnail, // URL to the thumbnail image for the quest
    "uploadDate": new Date().toISOString(),
    "contentUrl": pageUrl,       // URL to the quest page
    "author": {
      "@type": "Organization",
      "name": "Zo.live",  // Name of the organization or creator of the quest
      "url": baseUrl      // URL to the author's or creator's page
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zo.live", // Name of the publisher of the quest
      "url": baseUrl    // URL to the publisher's website
    },
    "mainEntityOfPage": pageUrl,  // URL of the quest page
    "keywords": keywords,        // Optional: Keywords related to the quest
    "genre": "Quest",            // Genre of the quest (can also be adjusted)
    "inLanguage": "en",          // Language of the quest (defaulting to English)
    "datePublished": new Date().toISOString(), // Date the quest was published
    "isPartOf": {
      "@type": "CreativeWorkSeries",
      "name": "Quest Series",    // If the quest is part of a series, provide the series name
      "url":pageUrl           // URL to the series or collection page
    }
  };
  
  
  return (
    <>
    <NextSeo
        defaultTitle="Zo | AI Enabled Content Creation"
        title={`${quest_name} | Zo.live`}
        description={description}
        canonical={pageUrl}
        url={pageUrl}
        openGraph={{
          url: pageUrl,
          title: `${quest_name} | Zo.live`,
          description: description,
          site_name: 'Zo.live',
          images: [
            {
              url: finalThumbnail,
              width: 800,
              height: 600,
              alt: quest_name,
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
            content: `${quest_name} | Zo.live`
          },
          {
            name: 'twitter:description',
            content: description
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
            content: `${quest_name} | Zo.live Trivia`
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
            content: `Cover image of the trivia quiz ${quest_name}`
          },
          {
            property: 'og:site_name',
            content: 'Zo.live'
          },
          {
            property: 'og:url',
            content: pageUrl // Assuming you're in a browser context and want the current page URL
          }
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
      <main><Gameplay /></main>
    </>
  );
};


export async function getServerSideProps(context) {
  const { questId } = context.params;
  let questData = null;
  let error=null;

  try {
    questData  = await axiosWrapper.get(`quest/${questId}/`);
  } catch (err) {
    error = err;
  }

  return {
    props: {
      questData
    },
  };
}

export default gameplay;
