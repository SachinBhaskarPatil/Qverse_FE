import React from 'react'; 
import dynamic from 'next/dynamic';
import axiosWrapper from '@/utils/helper/axiosWrapper';
import { NextSeo } from 'next-seo';
import Head from 'next/head';


const ShortVideoPlayer = dynamic(
  () => import('components/ui/ShortVideosPage'),
  { ssr: false } 
);

const shorts = ({shortData}) => {
  const {
    name,
    description,
    slug,
    thumbnail,
  } = shortData;
  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/shorts/${slug}`;
  const defaultThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const finalThumbnail = thumbnail || defaultThumbnail;

  const keywords = [
    name,
    'AI-generated Video',
    'User-generated Content',
    'Personalized Video Content',
    'AI Video Creation',
    'AI Video Editing',
    'Custom Video Clips',
    'Video Creation Tools',
    'AI-powered Video',
    'Short-form AI Videos',
    'Instant Video Generation',
    'Video AI Technology',
    'AI Video Platform',
    'Video Content Creation',
    'Trending User-generated Video',
    'Personalized Reels',
    'Video Customization',
    'Create Videos with AI',
    'On-demand Video',
    'Interactive Video Creation',
    'Viral AI Video'
].join(', ');

// Structured data for rich snippets (Short Video)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Video",
  "name": name,
  "description": description,
  "thumbnailUrl": finalThumbnail,
  "uploadDate": new Date().toISOString(),
  "contentUrl": pageUrl,
  "author": {
    "@type": "Organization",
    "name": "Zo.live",
    "url": baseUrl
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zo.live",
    "url": baseUrl
  },
  "mainEntityOfPage": pageUrl,
  "keywords": keywords, 
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
            content: 'video'
          },
          {
            property: 'og:url',
            content: pageUrl // Assuming you're in a browser context and want the current page URL
          },
          {
            property: 'og:video',
            content: pageUrl // The URL of the video itself
          },
          {
            property: 'og:image',
            content: finalThumbnail // Thumbnail image for the video
          },
          {
            property: 'og:image:alt',
            content: `Thumbnail for the video ${name}`
          },
          {
            property: 'og:site_name',
            content: 'Zo.live'
          },
          {
            property: 'og:video:width',
            content: '1200' // Optional: The width of the video
          },
          {
            property: 'og:video:height',
            content: '675' // Optional: The height of the video
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
      <main><ShortVideoPlayer/></main>
    </>
  );
};

export default shorts;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  let shortData = null;
  let error=null;

  try {
    shortData  = await axiosWrapper.get(`shortvideos/${slug}/`);
  } catch (err) {
    error = err;
  }

  return {
    props: {
      shortData
    },
  };
}
