import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import QuestCard from '@/components/ui/QuestCard'; // Adjust the path as needed
import axios from 'axios';
import API_URL from '@/config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #75FBEF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #64C7BE;
  margin: 0;
  font-family: 'Melodrama', serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const LoadingText = styled.div`
  text-align: center;
`;

const ErrorText = styled.div`
  text-align: center;
`;

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query; // Extract category from URL
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'quests':
        return 'Quests';
      case 'comics':
        return 'Comics';
      case 'audio':
        return 'Audio Stories';
      case 'trivia':
        return 'Trivia Quizzes';
      case 'shorts':
        return 'Short Videos';
      default:
        return 'Content';
    }
  };

  useEffect(() => {
    if (!category) return;

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        let response;

        switch (category) {
          case 'quests':
            response = await axios.get(`${API_URL}/gameplay/universes/`);
            setItems(
              response.data.universe.flatMap((uni) =>
                uni.quests.map((quest) => ({
                  ...quest,
                  cardType: 'quest',
                }))
              )
            );
            break;

          case 'comics':
            response = await axios.get(`${API_URL}/generator/comics/`);
            setItems(
              response.data.map((comic) => ({
                ...comic,
                cardType: 'comic',
              }))
            );
            break;

          case 'audio':
            response = await axios.get(`${API_URL}/generator/audiostories/`);
            setItems(
              response.data.map((audio) => ({
                ...audio,
                cardType: 'audio',
              }))
            );
            break;

          case 'trivia':
            response = await axios.get(`${API_URL}/generator/trivia/`);
            setItems(
              response.data.map((trivia) => ({
                ...trivia,
                cardType: 'trivia',
              }))
            );
            break;

          case 'shorts':
            response = await axios.get(`${API_URL}/generator/shortvideos/`);
            setItems(
              response.data.map((video) => ({
                ...video,
                cardType: 'video',
              }))
            );
            break;

          default:
            throw new Error('Invalid category');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  if (error) {
    return <ErrorText>Error loading content: {error}</ErrorText>;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowBackIcon />
        </BackButton>
        <Title>{getCategoryTitle(category)}</Title>
      </Header>
      <Grid>
        {items.map((item, idx) => (
          <QuestCard
            key={`${category}-${item.id || idx}`}
            title={item.name}
            image={item.thumbnail}
            description={item.description}
            players={item.playing}
            isPopular={true}
            slug={item.slug}
            cardType={item.cardType}
          />
        ))}
      </Grid>
    </PageContainer>
  );
};

export default CategoryPage;