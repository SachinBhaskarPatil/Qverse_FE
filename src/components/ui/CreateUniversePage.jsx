import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ComicHomeButton from 'components/ui/ComicHomeButton';
import Dialog from '@mui/material/Dialog';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const mobile = '@media (max-width: 640px)';

const PageContainer = styled.div`
  width: 100%;
  max-width: 640px;
  min-height: 100vh;
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

const HomeButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #888D6B;
  border-radius: 20px;
  padding: 8px 16px;
  color: #9eff00;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 10;
  font-family: 'Satoshi', sans-serif;
`;

// Reuse your existing styled components from the modal
const Title = styled.h1`
  color: #4FD1C5;
  font-size: 32px;
  text-align: center;
  margin-top: 80px;
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
  position: relative; // Add this
`;

const StaticText = styled.span`
  font-family: 'OffBit Trial', sans-serif;
  color: #FF69B4;
  position: absolute; // Add this
  left: 50%; // Add this
  transform: translateX(-170%); // Add this to align with AnimatedText

  ${mobile}{
    transform: translateX(-150%);
  }


`;

const AnimatedText = styled.span`
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '20px'});
  transition: opacity 0.5s ease, transform 0.5s ease, color 0.5s ease;
  position: absolute;
  left: 45%;
  white-space: nowrap;
  color: ${props => props.color};
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
    // Ensure button stays within bounds
    max-width: 90vw;
    // Fix for iOS border radius
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

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #1A1A1A;
    border-radius: 12px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
  }
`;

const DialogTitle = styled.h2`
  color: white;
  font-family: 'Melodrama', serif;
  text-align: center;
  font-size: 0.6rem;
  margin-bottom: 20px;
`;

const ShareOption = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: #34748A;
  box-shadow: 0px 4px 0px #225B6F;
  border-radius: 8px;
  border: none;
  color: white;
  font-family: 'OffBit Trial', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2C5965;
  }
`;


const ShareButton = styled.button`
  position: absolute;
  width: 100px;
  background: #34748A;
  box-shadow: 0px 8px 0px #225B6F;
  border-radius: 12px;
  border: 1px solid #34748A;
  display: block;
  margin: 20px;
  
  color: white;
  font-size: 24px;
  font-family: 'OffBit Trial', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.24px;
  
  cursor: pointer;

  ${mobile} {
    width: 18%;
    font-size: 18px;

  }
`;

const StyledPhoneInput = styled.div`
  .PhoneInput {
    margin-bottom: 15px;
  }

  .PhoneInputInput {
    width: 100%;
    padding: 15px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-family: 'Satoshi', sans-serif;
    outline: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
      border-color: #4FD1C5;
    }
  }

  .PhoneInputCountry {
    margin-right: 10px;
    background: transparent;
    padding: 5px;
  }

  .PhoneInputCountrySelect {
    color: white;
    background: transparent;
    border: none;
    
    &:focus {
      outline: none;
    }

    option {
      background: #1A1A1A;
      color: white;
    }
  }

  .PhoneInputCountryIcon {
    box-shadow: none;
    background: none;
    opacity: 0.8;
  }
`;


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


const CreateUniversePage=()=> {

    const history = useRouter();
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phno, setPhno] = useState();
    const maxWords = 1000;
    const [currentSubtitle, setCurrentSubtitle] = useState(0);
    const [isMobile] = useState(window.innerWidth <= 500);
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
        email: false
    });

    // Check if all fields are valid
    const isFormValid = content.trim() &&
        name.trim() &&
        email.trim() &&
        isValidEmail(email);

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
    const getSubtitleColor = (subtitle) => {
        switch (subtitle) {
            case "Interactive Trivia":
                return "#BB2233";
            case "Your Comic Book":
                return "#FA8603";
            case "A Story Quest":
                return "#FAE37F";
            default:
                return "#FF69B4";
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setTouched(prev => ({ ...prev, email: true }));
    };

    const handleShare = async () => {
        const shareData = {
            title: "Become a Creator on Qverse",
            text: "Join Qverse and create your own interactive stories, comics, and trivia games!",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleSubmit = async () => {

        setTouched({
            content: true,
            name: true,
            email: true
        });

        if (!isFormValid) {
            setError('Please fill in all fields correctly');
            return;
        }
        // Validate inputs
        if (!content.trim() || !name.trim() || !email.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);


        try {
            const response = await axios.post('https://api.qverse.life/api/gameplay/suggest_universe/', {
                universe_description: content,
                name: name,
                email: email,
                mobile: phno
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // // Show success toast
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
            setPhno('');
            // Navigate to home with state
            history.push({
                pathname: '/',
                state: { showSuccessToast: true },
                toastId: 'submit-success'
            });

            // You might want to show a success message
            // toast.success('Successfully submitted!');

        } catch (err) {
            console.error('Error submitting form:', err);

            // Show error toast
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
    const handlePhoneChange = (value) => {
        setPhno(value);
        console.log('Phone number changed:', value); // This will print the phone number
      };

    return (
        <PageContainer>

            {/* <ShareButton onClick={() => setOpenShareDialog(true)}>SHARE</ShareButton>

            <StyledDialog
                open={openShareDialog}
                onClose={() => setOpenShareDialog(false)}
            >
                <DialogContent>
                    <DialogTitle>Share Your Achievement</DialogTitle>
                    <ShareOption onClick={() => handleShare('clipboard')}>
                        Copy to Clipboard
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('twitter')}>
                        Share on Twitter
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('facebook')}>
                        Share on Facebook
                    </ShareOption>
                </DialogContent>
            </StyledDialog> */}


            <div
                onClick={() => history.push('/other-content')}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    zIndex: 10,
                    maxWidth: 'calc(640px - 40px)', // Ensure it stays within container
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    left: '0',
                    right: '0',
                    width: 'fit-content',
                    transform: isMobile ? 'translateX(200%)' : 'translateX(300%)',
                }}
            >
                <ComicHomeButton text="Home" Icon={HomeRoundedIcon} />
            </div>

            <Title>Create Your Content</Title>
            <SubTitleContainer>
                <StaticText>Create</StaticText>
                <AnimatedText
                    show={showSubtitle}
                    color={getSubtitleColor(subtitles[currentSubtitle])}
                >
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
                <StyledPhoneInput>
                <PhoneInput
                    placeholder="Phone Number (optional)"
                    value={phno}
                    onChange={handlePhoneChange}
                    defaultCountry="IN"
                />
            </StyledPhoneInput>
            </FormSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                isValid={isFormValid}
            >
                {isLoading ? 'Submitting details...' : 'Join the waitlist'}
            </SubmitButton>
        </PageContainer>
    );


}

export default CreateUniversePage;