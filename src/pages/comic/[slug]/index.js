import React from 'react';
import dynamic from 'next/dynamic';
import axiosWrapper from '@/utils/helper/axiosWrapper';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

const Comic = dynamic(() => import('components/ui/Comic'), { ssr: false });

const ComicPage = ({ comicDetails, comicPages, title }) => {
  const {
    name,
    description,
    slug,
    thumbnail,
  } = comicDetails;

  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/comic/${slug}`;
  const defaultThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const finalThumbnail = thumbnail || defaultThumbnail;

  const keywords = [
    name,
    'AI Generated Comics',
    'Comic Books',
    'Graphic Novels',
    'Web Comics',
    'AI Narrated Comics',
    'Superhero Comics',
    'Fantasy Comics',
    'Sci-fi Comics',
    'Horror Comics',
    'Romance Comics',
    'Comic Artists',
    'Indie Comics',
    'Self-published Comics',
    'Comics for Kids',
    'Young Adult Comics',
    'Best Comics of [Year]',
    'Top Rated Comics',
    'Free Comic Downloads',
    'Buy Comics Online',
    'Rare Comics',
    'Comic Reviews',
    'Create Your Own Comic',
    'How to Draw Comics'
  ].join(', ');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Comic",
    "name": name,
    "description": description,
    "thumbnailUrl": finalThumbnail,
    "url": pageUrl,
    "datePublished": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Zo.live",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zo.live",
      "url": baseUrl
    },
    "mainEntityOfPage": pageUrl,  // URL of the trivia page
    "keywords": keywords  
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
          type: 'Comic',
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
            content: 'comic'
          },
          {
            property: 'og:image',
            content: finalThumbnail
          },
          {
            property: 'og:image:alt',
            content: `Cover image of the comic ${name}`
          },
          {
            property: 'og:site_name',
            content: 'Zo.live'
          },
          {
            property: 'og:url',
            content: pageUrl
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
      <Comic comicPages={comicPages} title={title} />
    </>
  );
};

// Use getServerSideProps for server-side data fetching
export async function getServerSideProps(context) {
  const { slug } = context.params;
  let comicPages = null;
  let title = null;
  let error = null;
  let comicDetails = null;

  try {
    const result = await axiosWrapper.get(`comics/${slug}/`);
    comicPages = result?.pages || null;
    comicDetails = result?.comic || null;
    title = result?.comic?.name || null;
  } catch (err) {
    error = 'Failed to fetch data';
  }

  return {
    props: {
      comicDetails,
      comicPages,
      title,
    },
  };
}

export default ComicPage;
