// src/utils/analytics.js
import ReactGA from "react-ga4";
import { v4 as uuidv4 } from 'uuid';

const SESSION_STORAGE_KEYS = {
    SESSION_START: 'session_start_time',
    SESSION_ID: 'session_id',
    VISIT_COUNT: 'visit_count'
};


const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);
const timestamp = Date.now();
const visitCount = parseInt(localStorage.getItem(SESSION_STORAGE_KEYS.VISIT_COUNT) || '0');

// Initialize GA with your measurement ID
export const initializeGA = () => {
    ReactGA.initialize("G-P9GYQLK0HC", {
        gtagOptions: {
            send_page_view: true,
            session_duration: true,
            // Enable session tracking
            session_engaged: true,
            // Track engaged time
            engagement_time_msec: true
        }
    });
};


// Track session start with enhanced session management
export const trackSessionStart = () => {
    const sessionId = uuidv4(); // Generate UUID
    const startTime = Date.now();
    // Store session data
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId);
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_START, startTime.toString());

    // Track visit count
    const visitCount = parseInt(localStorage.getItem(SESSION_STORAGE_KEYS.VISIT_COUNT) || '0');
    localStorage.setItem(SESSION_STORAGE_KEYS.VISIT_COUNT, (visitCount + 1).toString());

    // Send session start event to GA4
    ReactGA.event({
        category: "Session",
        action: "Start",
        label: `Visit #${visitCount + 1}`,
        sessionId: sessionId,
        non_interaction: true,
        session_engaged: true
    });

    // Set session-scoped custom dimensions
    ReactGA.gtag('set', {
        'session_id': sessionId,
        'visit_number': visitCount + 1
    });
};

// Track session end with duration
export const trackSessionEnd = () => {
    const startTime = parseInt(sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_START) || '0');
    if (sessionId && startTime) {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds

        ReactGA.event({
            category: "Session",
            action: "End",
            label: `Duration: ${Math.round(duration)}s`,
            value: Math.round(duration),
            sessionId: sessionId,
            non_interaction: true
        });

        // Clear session storage
        sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
        sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_START);
    }
};

// Track game start
export const trackGameStart = (questId, gameTitle) => {
    const visitCount = parseInt(localStorage.getItem(SESSION_STORAGE_KEYS.VISIT_COUNT) || '0');

    ReactGA.event({
        category: "Game",
        action: "Start",
        label: gameTitle,
        value: 1,
        questId: questId,
        sessionId: sessionId,
        visitNumber: visitCount
    });
};


export const trackGameComplete = (questId, gameTitle, completionData) => {
    const {
        timeSpent,
        categoryScores,
        totalQuestions,
        rewardsEarned,
        timestamp,
        timeZone,
        questVersion
    } = completionData;

    // Track overall completion
    ReactGA.event({
        category: "Game",
        action: "Complete",
        label: gameTitle,
        timestamp,
        timeZone,
        questId,
        timeSpent,
        totalQuestions,
        rewardsEarned,
        questVersion
    });

    // Track each category score separately
    categoryScores.forEach(({ category, score, maxPossible }) => {
        ReactGA.event({
            category: "Game Score",
            action: "Category Score",
            label: category,
            value: score, // The actual score
            questId,
            maxPossible,
            scorePercentage: (score / maxPossible) * 100,
            gameTitle
        });
    });
};


// Track time spent
export const trackTimeSpent = (timeInSeconds, pageId) => {
    ReactGA.event({
        category: "Engagement",
        action: "Time Spent",
        label: pageId,
        value: Math.round(timeInSeconds),
        sessionId: sessionId,
        metric_id: "time_spent",
        metric_value: timeInSeconds
    });
};


export const trackQuestProgress = (questId, progressData) => {
    const {
        progressPercentage,
        currentQuestionNo,
        totalQuestions,
        categoryScores
    } = progressData;

    // Track overall progress
    ReactGA.event({
        category: "Quest",
        action: "Progress",
        label: questId,
        value: Math.round(progressPercentage),
        currentQuestion: currentQuestionNo,
        totalQuestions
    });

    // Track category progress
    categoryScores.forEach(({ category, currentScore }) => {
        ReactGA.event({
            category: "Category Progress",
            action: "Update",
            label: category,
            value: currentScore,
            questId,
            questionNumber: currentQuestionNo
        });
    });
};

// Add this new function to track category-specific events
export const trackCategoryEvent = (category, action, value, additionalParams = {}) => {
    ReactGA.event({
        category: "Category Interaction",
        action,
        label: category,
        value,
        ...additionalParams
    });
};
// Track user interactions
export const trackUserInteraction = (action, label, value = null) => {

    ReactGA.event({
        category: "User Interaction",
        action,
        label,
        ...(value && { value }),
        sessionId: sessionId
    });
};

// Set user properties
export const setUserProperties = (properties) => {
    ReactGA.gtag('set', 'user_properties', {
        ...properties,
        session_id: sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID),
        visit_count: localStorage.getItem(SESSION_STORAGE_KEYS.VISIT_COUNT)
    });
};

// Track trivia start
export const trackStartTrivia = (triviaName, triviaId) => {
    ReactGA.event({
        category: "Trivia",
        action: "Start",
        label: triviaName,
        triviaId,
        sessionId,
        visitNumber: visitCount,
        timestamp
    });
};

// Tracks when a user completes a trivia game, capturing score, time taken, and completion status.
export const trackTriviaCompleted = (triviaName,triviaId, score, timeTaken) => {
    ReactGA.event({
        category: "Trivia",
        action: "Completed",
        label: triviaName,
        triviaId,
        score,
        timeTaken,
        sessionId,
        timestamp
    });
};

// Tracks when a user views a trivia question, capturing question details and engagement time.
export const trackQuestionView = (triviaName,triviaId,questionNumber) => {
    ReactGA.event({
        category: "Trivia",
        action: "Question View",
        label: triviaName,
        triviaId,
        questionNumber,
        sessionId,
        timestamp 
    });
};

// Tracks when a user selects an answer
export const trackAnswerSelected = (triviaName,triviaId,questionNumber,isCorrect,timeTaken) => { 

    ReactGA.event({
        category: "Trivia",
        action: "Answer Selected",
        label: triviaName,
        triviaId,
        questionNumber,
        timeTaken,
        isCorrect,
        sessionId,
    });
};

// Tracks when the timer expires on a question, capturing the question ID and time spent before expiration.
export const trackTimerExpired = (triviaName,triviaId,questionNumber,timeSpent) => {
    ReactGA.event({
        category: "Trivia",
        action: "Timer Expired",
        label: triviaName,
        triviaId,
        questionNumber,
        timeSpent,
        sessionId,
        timestamp
    });
};


// Tracks the time spent by a user during a trivia session, capturing the current question and total time spent.
export const trackTriviaTimeSpent = (triviaName, triviaId, questionNumber, timeSpent) => {
    ReactGA.event({
        category: "Trivia",
        action: "Time Spent",
        label: triviaName,
        triviaId,
        currentQuestionNumber: questionNumber,  // Tracks the current question number
        timeSpent,  // Total time spent in the trivia session
        sessionId,
        visitNumber: visitCount,
        timestamp
    });
};




// audio events


// Tracks when the user starts playing an episode
export const trackPlay = (audioStoryId,episodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Play",
        audioStoryId,
        label: episodeTitle,
        sessionId,
        timestamp
    });
};

// Tracks when the user pauses an episode
export const trackPause = (audioStoryId,episodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Pause",
        audioStoryId,
        label: episodeTitle,
        sessionId,
        timestamp
    });
};


// Tracks when the user manually changes the episode
export const trackEpisodeChange = (audioStoryId,previousEpisodeTitle, nextEpisodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Change Episode",
        audioStoryId,
        label: `${previousEpisodeTitle} -> ${nextEpisodeTitle}`,
        sessionId,
        timestamp
    });
};

// Tracks when the next episode starts playing automatically after the previous one ends
export const trackAutoPlayNext = (audioStoryId,previousEpisodeTitle,nextEpisodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Auto-Play Next",
        audioStoryId,
        label: `${previousEpisodeTitle} -> ${nextEpisodeTitle}`,
        sessionId,
        timestamp
    }); 
};  

// Tracks when the user manually changes the playback position
export const trackSeek = (audioStoryId,newTimePosition, episodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Seek",
        audioStoryId,
        label: episodeTitle,
        value: newTimePosition,
        sessionId,
        timestamp
    });
};


// Tracks when the user clicks the "Home" button
export const trackGoToHome = (audioStoryId,episodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Navigate",
        audioStoryId,
        label: episodeTitle,
        sessionId,
        timestamp
    });
};

// Tracks when the user completes listening to an episode
export const trackEpisodeCompletion = (audioStoryId,episodeTitle) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Complete",
        audioStoryId,
        label: episodeTitle,
        sessionId,
        timestamp
    });
};

// Tracks the duration of the session when the user stops playback or navigates away
export const trackSessionDuration = (audioStoryId,episodeTitle, listeningDuration) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Session Duration",
        audioStoryId,
        label: episodeTitle,
        value: listeningDuration,
        sessionId,
        timestamp
    });
};

// Tracks the total duration played by the user for a specific episode
export const trackPlaybackDuration = (audioStoryId,episodeTitle, episodeId, durationPlayed) => {
    ReactGA.event({
        category: "AudioPlayer",
        action: "Playback Duration",
        audioStoryId,
        label: episodeTitle,
        value: durationPlayed, 
        sessionId,
        timestamp
    });
};


// short videos events


// 1. Track Reel Start
// Captures when a user starts watching a reel, helps track engagement with video content
export const trackReelStart = (name, slug) => {
    const sessionId = sessionStorage.getItem("SESSION_ID");
    const timestamp = Date.now();
    ReactGA.event({
        category: "Reel",
        action: "Start",
        label: slug,
        video_name: name,
        sessionId,
        timestamp
    });
};

// 2. Track Reel End
// Tracks when a user finishes watching a reel to calculate time spent on it
export const trackReelEnd = (name, slug,reelDuration,currentReelTime) => {
    const sessionId = sessionStorage.getItem("SESSION_ID");
    const timestamp = Date.now();
    ReactGA.event({
        category: "Reel",
        action: "End",
        label: slug,
        video_name: name,
        sessionId,
        timestamp
    });
};

// 3. Track Time Spent on Each Reel
// Measures how long a user watches a specific reel
export const trackTimeSpentOnReel = (name, slug, timeSpent) => {

    ReactGA.event({
        category: "Reel",
        action: "Time Spent",
        label: slug,
        video_name: name,
        video_slug: slug,
        value: timeSpent, // Time spent in seconds
        sessionId,
        timestamp
    });
};

// 4. Track Total Time Spent Watching All Reels
// Measures the total time spent watching all reels on the page
export const trackTotalTimeSpentWatchingAllReels = (totalTimeSpent) => {

    ReactGA.event({
        category: "Reel",
        action: "Total Time",
        label: "All Reels",
        value: totalTimeSpent, // Total time in seconds
        sessionId,
        timestamp
    });
};

// 5. Track Autoplay Status
// Records whether autoplay is triggered and how often
export const trackAutoplayStatus = (name, slug, autoplayStatus) => {

    ReactGA.event({
        category: "Reel",
        action: "Autoplay Status",
        label: slug,
        video_name: name,
        video_slug: slug,
        value: autoplayStatus, // 1 for autoplay started, 0 for autoplay disabled
        sessionId,
        timestamp
    });
};


// 7. Track Home Button Click
// Tracks when the user clicks the home button to navigate away from the video page
export const trackHomeButtonClick = () => {

    ReactGA.event({
        category: "Reel",
        action: "Home Button Clicked",
        label: "Home Button",
        value: 1, // 1 indicates that the home button was clicked
        sessionId,
        timestamp
    });
};

// 10. Track Number of Reels Viewed
// Tracks how many reels the user views during a session
export const trackNumberOfReelsViewed = (totalReelsViewed) => {

    ReactGA.event({
        category: "Reel",
        action: "Reels Viewed",
        label: "Reels",
        value: totalReelsViewed, // Total number of reels viewed
        sessionId,
        timestamp
    });
};


// comic pages


// 1. trackPageView
export const trackPageView = (slug, page_number) => {
    const timestamp = Date.now();
    ReactGA.event({
        category: "Comic",
        action: "Page View",
        label: slug,
        page_number,
        timestamp
    });
};

// 2. trackScrollNext
export const trackScrollNext = (slug, page_number, next_page, interaction_type) => {
    ReactGA.event({
        category: "Comic",
        action: "Scroll Next",
        label: slug,
        page_number,
        next_page,
        interaction_type
    });
};

// 3. trackScrollPrevious
export const trackScrollPrevious = (slug, page_number, previous_page, interaction_type) => {
    ReactGA.event({
        category: "Comic",
        action: "Scroll Previous",
        label: slug,
        page_number,
        previous_page,
        interaction_type
    });
};


// 6. trackPageDuration
export const trackPageDuration = (slug, page_number, duration) => {
    ReactGA.event({
        category: "Comic",
        action: "Page Duration",
        label: slug,
        page_number,
        duration // Time in seconds
    });
};

// 7. trackNavigationToHome
export const trackNavigationToHome = (slug, page_number, interaction_type) => {
    ReactGA.event({
        category: "Comic",
        action: "Navigation to Home",
        label: slug,
        page_number,
        interaction_type
    });
};


// 9. trackFirstPageView
export const trackFirstPageView = (slug, page_number, entry_point) => {
    ReactGA.event({
        category: "Comic",
        action: "First Page View",
        label: slug,
        page_number,
        entry_point // Boolean
    });
};


// Function to record the last visited page and duration
export const trackUserExit = (slug, page_number, duration) => {
    ReactGA.event({
        category: "Comic",
        action: "User Exit",
        label: slug,
        page_number,
        duration // Time spent on the last page in seconds
    });
};
