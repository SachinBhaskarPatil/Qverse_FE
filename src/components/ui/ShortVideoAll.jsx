import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link'
import API_URL from '@/config';

const ShortsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ShortCard = styled.div`
  position: relative;
  aspect-ratio: 9/16;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ffffff;
`;

function ShortVideos() {
  const [shorts, setShorts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchShorts = async () => {
    try {
      const response = await axios.get(`${API_URL}/generator/shortvideos/`);
      const newShorts = response.data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

      if (newShorts.length < itemsPerPage) {
        setHasMore(false);
      }

      setShorts(prevShorts => [...prevShorts, ...newShorts]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching shorts:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  return (
    <InfiniteScroll
      dataLength={shorts.length}
      next={fetchShorts}
      hasMore={hasMore}
      loader={<LoadingSpinner>Loading...</LoadingSpinner>}
      endMessage={
        <LoadingSpinner>No more videos to load.</LoadingSpinner>
      }
    >
      <ShortsGrid>
        {shorts.map((short, index) => (
          <Link href={`/shorts/${short.slug}`} key={`${short.slug}-${index}`}>
            <ShortCard>
              <Thumbnail src={short.thumbnail} alt={short.name} />
              <VideoInfo>
                <h3>{short.name}</h3>
                <p>{short.description}</p>
              </VideoInfo>
            </ShortCard>
          </Link>
        ))}
      </ShortsGrid>
    </InfiniteScroll>
  );
}

export default ShortVideos;