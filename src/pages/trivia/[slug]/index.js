import React from 'react';
import dynamic from 'next/dynamic';
import axiosWrapper from '@/utils/helper/axiosWrapper';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const Travia = dynamic(
  () => import('components/ui/Travia'),
  { ssr: false }
);

const trivia = ({ triviaData }) => {
  const {
    name,
    description,
    slug,
    thumbnail,
  } = triviaData?.trivia;
  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/trivia/${slug}`;
  const defaultThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const finalThumbnail = thumbnail || defaultThumbnail;

  const keywords = [
    name,
    'AI Trivia',
    'AI-powered Quizzes',
    'Custom Trivia',
    'Trivia Generator',
    'Interactive AI Trivia',
    'AI Trivia Questions',
    'Trivia Challenges',
    'Personalized Quizzes',
    'AI Quiz Maker',
    'Trivia Creation Tool',
    'AI Trivia Game',
    'Trivia for Users',
    'Fun AI Trivia',
    'AI Question Generator',
    'AI Quiz Builder',
    'Smart Trivia',
    'Quiz Creation Platform',
    'Build Your Own Quiz',
    'AI-driven Trivia',
    'User-made Quizzes',
    'Personalized Trivia Experience',
    'AI Quiz Creator'
  ].join(', ');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Trivia",
    "name": name,                // Title of the trivia or quiz
    "description": description,  // Brief description of the trivia
    "thumbnailUrl": finalThumbnail, // URL to the thumbnail image for the trivia
    "uploadDate": new Date().toISOString(),
    "contentUrl": pageUrl,
    "author": {
      "@type": "Organization",
      "name": "Zo.live",  // Name of the organization or creator of the trivia
      "url": baseUrl     // Optional: URL to the author's or creator's page
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zo.live", // Name of the publisher of the trivia
      "url": baseUrl    // Optional: URL to the publisher's website
    },
    "mainEntityOfPage": pageUrl,  // URL of the trivia page
    "keywords": keywords          // Optional: Keywords related to the trivia
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
            content: `${name} | Zo.live Trivia`
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
        <Travia />
      </main>
    </>
  );
};


export async function getServerSideProps(context) {
  const { slug } = context.params;
  let triviaData = null;
  let error = null;

  try {
    triviaData = await axiosWrapper.get(`trivia/${slug}/`);
  } catch (err) {
    error = err;
  }

  return {
    props: {
      triviaData
    },
  };
}

export default trivia;
