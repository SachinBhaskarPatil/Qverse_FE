import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalContainer = styled.div`
  width: 100%;
  max-width: 640px;
  height: 100vh;
  background: #000;
  margin: 0 auto;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Title = styled.h1`
  color: #4FD1C5;
  font-size: 32px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
  font-family: 'Melodrama', serif;
  font-weight: 500;
`;

const SubTitleContainer = styled.h2`
  color: #FF69B4;
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
  font-family: 'OffBit Trial', sans-serif;
  font-weight: 400;
  min-height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const StaticText = styled.span`
  font-family: 'OffBit Trial', sans-serif;
  color: #FF69B4;
`;

const AnimatedText = styled.span`
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '20px'});
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const TextArea = styled.textarea`
  width: calc(100% - 40px);
  height: 200px;
  margin: 20px;
  padding: 15px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  resize: none;
  font-family: 'Satoshi', sans-serif;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4FD1C5;
  }
`;

const WordCount = styled.div`
  text-align: right;
  margin-right: 20px;
  font-size: 14px;
  font-family: 'Satoshi', sans-serif;
  color: ${props => props.isNearLimit ? '#ff4d4d' : 'white'};
  transition: color 0.3s ease;
`;

const FormSection = styled.div`
  margin: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
  font-family: 'Satoshi', sans-serif;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4FD1C5;
  }
`;

const SubmitButton = styled.button`
  width: calc(100% - 40px);
  margin: 20px;
  padding: 15px;
  background: linear-gradient(180deg, #219B9D 0%, #319795 100%);
  border: none;
  border-radius: 100px;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: ${props => props.isValid ? 'pointer' : 'not-allowed'};
  font-family: 'Satoshi', sans-serif;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  // Fix for iOS devices
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  // Responsive adjustments for mobile
  @media (max-width: 640px) {
    width: calc(100% - 20px);
    margin: 20px;
    padding: 12px;
    font-size: 16px;
    max-width: 90vw;
    -webkit-border-radius: 100px;
  }
  
  // Specific fix for iPhone SE and smaller devices
  @media (max-width: 375px) {
    width: calc(100% - 16px);
    margin: 20px;
    padding: 10px;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  text-align: center;
  margin: 10px 20px;
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 2%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  z-index: 10;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const OptionalLabel = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-left: 8px;
  font-family: 'Satoshi', sans-serif;
`;

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone) return true; // Empty is valid since it's optional
  const phoneRegex = /^\+?[\d\s-()]{10,}$/; // Basic phone validation
  return phoneRegex.test(phone);
};

function CreateUniverseModal({ open, onClose }) {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const maxWords = 1000;
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const subtitles = [
    "A Story Quest",
    "Your Comic Book",
    "Interactive Trivia"
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [touched, setTouched] = useState({
    content: false,
    name: false,
    email: false,
    phone: false
  });

  // Check if all fields are valid
  const isFormValid = content.trim() && 
                     name.trim() && 
                     email.trim() && 
                     isValidEmail(email) &&
                     (phone === '' || isValidPhone(phone));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowSubtitle(false);
      setTimeout(() => {
        setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
        setShowSubtitle(true);
      }, 500); // Wait for fade out before changing text
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxWords) {
      setContent(text);
    } else {
      setContent(text.slice(0, maxWords));
    }
    setTouched(prev => ({ ...prev, content: true }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setTouched(prev => ({ ...prev, name: true }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setTouched(prev => ({ ...prev, email: true }));
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setTouched(prev => ({ ...prev, phone: true }));
  };

  const handleSubmit = async () => {
    setTouched({
      content: true,
      name: true,
      email: true,
      phone: true
    });

    if (!isFormValid) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://api.qverse.life/api/gameplay/suggest_universe/', {
        universe_description: content,
        name: name,
        email: email,
        phone: phone // Include phone in payload
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success('Successfully submitted!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: '#1A1A1A',
          color: '#9eff00',
          borderRadius: '8px',
          border: '1px solid #888D6B'
        }
      });

      // Clear form
      setContent('');
      setName('');
      setEmail('');
      setPhone('');
      // Close modal
      onClose();

    } catch (err) {
      console.error('Error submitting form:', err);

      toast.error(err.response?.data?.message || 'An error occurred while submitting', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: '#1A1A1A',
          color: '#ff4d4d',
          borderRadius: '8px',
          border: '1px solid #ff4d4d'
        }
      });

      setError(err.response?.data?.message || 'An error occurred while submitting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-universe-modal"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon style={{ fontSize: 24 }} />
        </CloseButton>
        <Title>Become a Creator</Title>
        <SubTitleContainer>
          <StaticText>Create</StaticText>
          <AnimatedText show={showSubtitle}>
            {subtitles[currentSubtitle]}
          </AnimatedText>
        </SubTitleContainer>

        <TextArea
          value={content}
          onChange={handleContentChange}
          placeholder='Start typing your ideas here....'
          required
        />
        {touched.content && !content.trim() && (
          <ErrorMessage>Content is required</ErrorMessage>
        )}
        <WordCount isNearLimit={content.length > maxWords * 0.9}>
          {content.length}/{maxWords} characters
        </WordCount>

        <FormSection>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            required
          />
          {touched.name && !name.trim() && (
            <ErrorMessage>Name is required</ErrorMessage>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {touched.email && (!email.trim() || !isValidEmail(email)) && (
            <ErrorMessage>Please enter a valid email address</ErrorMessage>
          )}
          <Input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={handlePhoneChange}
          />
          {touched.phone && phone && !isValidPhone(phone) && (
            <ErrorMessage>Please enter a valid phone number</ErrorMessage>
          )}
        </FormSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          isValid={isFormValid}
        >
          {isLoading ? 'Submitting detials...' : 'Join the waitlist'}
        </SubmitButton>
        
        <ToastContainer />
      </ModalContainer>
    </Modal>
  );
}

export default CreateUniverseModal;