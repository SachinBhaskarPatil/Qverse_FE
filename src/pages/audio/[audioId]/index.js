import React from 'react';
import dynamic from 'next/dynamic';
import axiosWrapper from 'utils/helper/axiosWrapper';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

const AudioPlayer = dynamic(
  () => import('components/ui/AudioPage'),
  { ssr: false }
);

const AudioPage = ({ audioData }) => {
  const {
    name,
    description,
    slug,
    thumbnail,
  } = audioData.audioStory;

  const defaultThumbnail = "https://together-web-assets.s3.ap-south-1.amazonaws.com/zolivesvg.svg";
  const finalThumbnail = thumbnail || defaultThumbnail;

  // Base URL for canonical and OG URLs
  const baseUrl = 'https://zo.live';
  const pageUrl = `${baseUrl}/audio/${slug}`;

  // Keywords for SEO
  const keywords = [
    name,
    'Audiobook',
    'Best Audiobooks',
    'Free Audiobooks',
    'Digital Audiobooks',
    'Audiobook Library',
    'Fiction Audiobooks',
    'Non-fiction Audiobooks',
    'Audible Alternatives',
    'AI-generated Audiobooks',
    'Personalized Audiobook Experience',
    'Interactive Audiobooks',
    'AI Narrated Books',
    'On-demand Audiobooks',
    'Customizable Audiobook',
    'AI Voice Narration',
    'Audio Story',
    'Top Rated Audiobooks'
  ].join(', ');

  // Structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Audio",
    "name": name,
    "description": description,
    "thumbnailUrl": finalThumbnail,
    "uploadDate": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Zo.live",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zo.live",
    }
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
          type: 'music.playlist',
          images: [
            {
              url: finalThumbnail,
              width: 800,
              height: 600,
              alt: name,
              type: 'image/jpeg',
            }
          ],
          audio: audioData?.episodes?.map(episode => ({
            url: episode.audio_url,
            type: 'audio/mpeg'
          }))
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
            property: 'og:audio',
            content: audioData?.episodes?.[0]?.audio_url
          },
          {
            property: 'og:audio:type',
            content: 'audio/mpeg'
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
      <main >
        <AudioPlayer audioStory={audioData} />
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  const { audioId } = context.params;
  let audioData = null;

  try {
    const data = await axiosWrapper.get(`audiostories/${audioId}/`);
    audioData = {
      audioStory: data?.audio_story,
      episodes: data?.episodes,
    };

    // Return 404 if no data found
    if (!data?.audio_story) {
      return {
        notFound: true
      };
    }
  } catch (err) {
    console.error('Error fetching audio story:', err);
    return {
      notFound: true
    };
  }

  return {
    props: {
      audioData
    },
  };
}

export default AudioPage;