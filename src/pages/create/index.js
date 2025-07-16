import React from 'react'; // Explicitly import React
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const CreateUniversePage = dynamic(
  () => import('components/ui/CreateUniversePage'),
  { ssr: false }
);
const baseUrl = 'https://zo.live';
const pageUrl = `${baseUrl}/create`;
const finalThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
const name = "Create Own Content";
const description = "Create your own unique content, whether it's trivia, quests, audiobooks, or reels. Our platform allows you to easily create and share your custom content with others. Start building personalized experiences today!"

const keywords = [
  'Content Creation',
  'User Generated Content',
  'Create Interactive Content',
  'DIY Audiobooks',
  'AI Content Creation',
  'AI Audiobook Creation',
  'AI Storytelling',
  'Build Your Own Content',
  'Personalized Content',
  'Create with AI'
].join(', ');


const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Create Your Own Content", // Title of the page
  "description": "Create and personalize your own trivia, quest, audiobook, or reel using AI-powered tools. Customize, generate, and share your content easily.",
  "url": pageUrl,                 // URL of the create page
  "mainEntityOfPage": pageUrl,    // URL of the content creation page
  "author": {
    "@type": "Organization",
    "name": "Zo.live",            // Organization or platform name
    "url": baseUrl                // URL to the platform's main website
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zo.live",            // Publisher of the content creation tool
    "url": baseUrl                // URL to the platform's main website
  },
  "image": finalThumbnail,        // Thumbnail image URL for the page or tool
  "keywords": keywords, // Keywords
  "inLanguage": "en",             // Language of the content (default English)
  "datePublished": new Date().toISOString(),
  "mainEntity": {
    "@type": "CreativeWork",
    "name": "AI-Powered Content Creation",
    "description": "Generate personalized content like trivia, quests, audiobooks, or reels using AI technology. Customize your content, get suggestions, and publish your work.",
    "contentUrl": pageUrl,        // URL of the content generation page
    "creator": {
      "@type": "Organization",
      "name": "Zo.live",          // Organization name
      "url": baseUrl              // URL to the organization
    },
    "genre": "AI-Generated Content",
  }
};


const Create = () => {
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
            content: `${name} | Zo.live`
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
            content: `${name} | Zo.live `
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
            content: `Cover image of the trivia quiz ${name}`
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
      <main>
        <CreateUniversePage />
      </main>
    </>
  );
};

export default Create;
