import { use, useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const [selectedUrge, setSelectedUrge] = useState('');
  const [selectedAlternative, setSelectedAlternative] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const [rating, setRating] = useState("");

  const [redirectHistory, setRedirectHistory] = useState(() => {
    const saved = localStorage.getItem('redirectHistory'); /* allows for local saving */
    return saved ? JSON.parse(saved) : [];
  });

  const [note, setNote] = useState("");

  const [sortOrder, setSortOrder] = useState('newest');

  const [reflectionTimer, setReflectionTimer] = useState(5);

  /* Make it so you can still open insta with automation */
  const [recentIntention, setRecentIntention] = useState(false);
  const [intention, setIntention] = useState('');
  const [timeLimit, setTimeLimit] = useState('10');
  const [targetApp, setTargetApp] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  /* detects if on mobile */
  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  /* Resets screen at top when going next page */
  useEffect(() => {
    window.scrollTo(0, 0);
    document.activeElement.blur(); // makes it so it doesn't keep focus on mobile
  }, [currentScreen]);

  /* If intention is set then doesn't open instagram */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const app = params.get('app');
    if (app) {
      setTargetApp(app);
      setCurrentScreen('setIntention');
      
      // Check if there's a recent intention
      const lastIntention = localStorage.getItem('lastIntentionTime');
      const lastApp = localStorage.getItem('lastIntentionApp');
      const fifteenMins = 15 * 60 * 1000;
      
      if (lastIntention && 
          lastApp === app && 
          Date.now() - parseInt(lastIntention) < fifteenMins) {
        setRecentIntention(true);
      }
    }
  }, []);

  /* Records what app was opened */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const app = params.get('app');
    if (app) {
      setTargetApp(app);
      setCurrentScreen('setIntention');
    }
  }, []);

  /* Creates timer for reflection screen, also can add more time based on urge type */
  useEffect(() => {
    if(currentScreen === 'why' && reflectionTimer > 0) {
      const interval = setInterval(() => {
        setReflectionTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if(currentScreen !== 'why'){
      setReflectionTimer(5); 
      // setReflectionTimer(3);
    }
  }, [currentScreen, reflectionTimer]);

  useEffect(() => {
    localStorage.setItem('redirectHistory', JSON.stringify(redirectHistory));
  }, [redirectHistory]);

  /* Deletes a redirect in history */
  function deleteRedirect(index) {
    const redirect = redirectHistory[index];
    const confirmDelete = window.confirm(
      `Delete this redirect?\n\nUrge: ${urgeLabels[redirect.urge]}\nAlternative: ${redirect.alternative}`
    );

    if(confirmDelete) {
      const newHistory = redirectHistory.filter((_, i) => i !== index);
      setRedirectHistory(newHistory)
    }
  }

  /* History sorting */
  function getSortedHistory() {
    const sorted = [...redirectHistory];

    switch(sortOrder) {
      case 'newest':
        return sorted.slice().reverse();
      case 'oldest':
        return sorted;
      case 'highest-rating':
        return sorted.slice().sort((a, b) => b.rating - a.rating);
      case 'lowest-rating':
        return sorted.slice().sort((a, b) => a.rating - b.rating);
      case 'urge-type':
        return sorted.slice().sort((a, b) => a.urge.localeCompare(b.urge));
        default:
          return sorted.slice().reverse();
    }
  }

  /* Displays Analytics (most common) of History */
  function getUrgeStats() {
    if(redirectHistory.length === 0) return null;

    const urgeCounts = {}; /* Counts num of urges occured */
    redirectHistory.forEach(redirect => {
      urgeCounts[redirect.urge] = (urgeCounts[redirect.urge] || 0) + 1;
    });

    const reasonCounts = {}; /* Counts num of reasons */
    redirectHistory.forEach(redirect => {
      if (redirect.reason) {
       reasonCounts[redirect.reason] = (reasonCounts[redirect.reason] || 0) + 1;
      }
    });

    /* Finds most common occurance of urge */
    const mostCommon = Object.entries(urgeCounts).sort((a, b) => b[1] - a[1]);

    const mostCommonReason = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1]);

    const urgeRatings = {}; /* Avg rating per urge //MAYBE RESTRUCTURE TOWARDS REASON */
    redirectHistory.forEach(redirect => {
      if(!urgeRatings[redirect.urge]) {
        urgeRatings[redirect.urge] = [];
      }
      urgeRatings[redirect.urge].push(redirect.rating);
    });

    const avgRatings = {}
    Object.entries(urgeRatings).forEach(([urge, ratings]) => {
      avgRatings[urge] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    });


    const reasonRatings = {};
    redirectHistory.forEach(redirect => {
      if (redirect.reason) {
        if (!reasonRatings[redirect.reason]) {
          reasonRatings[redirect.reason] = [];
        }
        reasonRatings[redirect.reason].push(redirect.rating);
      }
    });

    const avgReasonRatings = {};
    Object.entries(reasonRatings).forEach(([reason, ratings]) => {
      avgReasonRatings[reason] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    });

    return {
      mostCommon,
      urgeCounts,
      mostCommonReason,
      avgRatings,
      avgReasonRatings,
      total: redirectHistory.length
    };
  }

  function resetForm() {
    setSelectedUrge('');
    setSelectedReason('');
    setSelectedAlternative('');
    setNote('');
    setRating('');
  }

  /* Can add more later */
  const urgeTypes = ['gaming', 'scrolling', 'avoiding', 'shows', 'food'];

  // const alternatives = {
  //   gaming: [
  //     // Physical/Movement
  //     'Workout - lift weights or bodyweight',
  //     'Go for a walk outside',
  //     'Do 20 pushups right now',
  //     'Stretch for 10 minutes',
  //     'Go for a run',
      
  //     // Creative/Building
  //     'Code for 30 mins on a project',
  //     'Work on your side project',
  //     'Watch a coding tutorial and take notes',
  //     'Do a LeetCode challenge',
  //     'Write in your journal',
  //     'Practice an instrument',
  //     'Draw or sketch something',
      
  //     // Social/Connection
  //     'Call a friend',
  //     'Text someone you care about',
  //     'Hang out with a friend in person',
  //     'Go to a coffee shop and be around people',
      
  //     // Productive/Growth
  //     'Read a chapter of a book',
  //     'Clean/organize one area of your space',
  //     'Plan tomorrow with intention',
  //     'Learn something new for 20 mins',
  //     'Work on your resume or portfolio',
      
  //     // Mindfulness
  //     'Sit with the feeling for 5 minutes',
  //     'Meditate for 10 minutes',
  //     'Write down what you\'re avoiding',
  //     'Ask: What would building feel like instead?'
  //   ],
    
  //   scrolling: [
  //     // Physical/Movement
  //     'Workout',
  //     'Go for a walk WITHOUT your phone',
  //     'Do a quick exercise circuit',
  //     'Stretch and move your body',
  //     'Go outside and get sunlight',
      
  //     // Creative/Building
  //     'Code for 30 mins',
  //     'Journal your thoughts',
  //     'Practice an instrument',
  //     'Work on a creative project',
  //     'Write something - anything',
  //     'Plan your next project',
      
  //     // Social/Connection
  //     'Call a friend for real conversation',
  //     'Text someone meaningful',
  //     'Hang out with someone in person',
  //     'Go to a public space and people watch',
      
  //     // Productive/Growth
  //     'Read a chapter of something',
  //     'Clean your space',
  //     'Do a coding challenge',
  //     'Write down 3 things you\'re grateful for',
  //     'Organize your desk or room',
  //     'Learn a new skill for 15 mins',
      
  //     // Mindfulness
  //     'Put phone in another room for 30 mins',
  //     'Sit with the boredom - what\'s underneath?',
  //     'Ask: What real connection am I craving?',
  //     'Notice the urge without acting on it',
  //     'Breathe deeply for 2 minutes'
  //   ],
    
  //   shows: [
  //     // Physical/Movement
  //     'Workout',
  //     'Go for a walk',
  //     'Cook a real meal from scratch',
  //     'Go outside and photograph something',
  //     'Stretch or do yoga',
      
  //     // Creative/Building
  //     'Code for 30 mins',
  //     'Journal about your day',
  //     'Practice an instrument',
  //     'Draw or create something',
  //     'Write a short story or poem',
  //     'Work on a personal project',
      
  //     // Social/Connection
  //     'Call a friend for real conversation',
  //     'Hang out with someone in person',
  //     'Text someone you haven\'t talked to',
  //     'Go to a social event or meetup',
      
  //     // Productive/Growth
  //     'Read fiction or non-fiction',
  //     'Listen to an educational podcast',
  //     'Learn something new',
  //     'Clean or organize your space',
  //     'Plan something for the week',
      
  //     // Mindfulness
  //     'Ask: What am I numbing right now?',
  //     'Sit with the discomfort for 5 mins',
  //     'Journal: What creative thing wants to come out?',
  //     'Meditate on what you\'re feeling',
  //     'Notice what emotion you\'re avoiding'
  //   ],
    
  //   food: [
  //     // Physical/Movement
  //     'Go for a walk first',
  //     'Do 10 minutes of exercise',
  //     'Take a cold shower',
  //     'Stretch your body',
  //     'Go for a drive',
      
  //     // Delay Tactics
  //     'Drink a full glass of water and wait 10 mins',
  //     'Chew gum',
  //     'Brush your teeth',
  //     'Make tea or coffee instead',
  //     'Wait 15 minutes then reassess',
      
  //     // Social/Connection
  //     'Call a friend',
  //     'Text someone',
  //     'Go be around people',
      
  //     // Mindfulness/Awareness
  //     'Sit with the feeling for 5 mins',
  //     'Journal: What emotion am I avoiding?',
  //     'Ask: Am I actually hungry or avoiding something?',
  //     'Rate your hunger 1-10 honestly',
  //     'Notice the craving without acting',
  //     'Write down what triggered this',
      
  //     // Alternatives
  //     'Have a healthy snack if truly hungry',
  //     'Drink water with lemon',
  //     'Eat something with protein',
  //     'Prepare food mindfully if eating'
  //   ],
    
  //   avoiding: [
  //     // Start Small
  //     'Set a 5-min timer and just start',
  //     'Do the smallest possible first step',
  //     'Start with the hardest part for 3 mins',
  //     'Write down exactly what you\'re avoiding',
  //     'Break the task into tiny steps',
  //     'Commit to just 2 minutes of the thing',
      
  //     // Build Momentum
  //     'Make your bed (small win)',
  //     'Clean one small area',
  //     'Complete one tiny task first',
  //     'Do the easiest part to build momentum',
  //     'Set up your environment for success',
      
  //     // Mindfulness/Awareness
  //     'Sit with the discomfort for 4 mins',
  //     'Journal: Why am I avoiding this?',
  //     'Ask: What\'s the worst that happens if I start?',
  //     'Notice the fear without running from it',
  //     'Acknowledge the fear, then do it anyway',
      
  //     // Reframe
  //     'Remember: "I can handle it and move forward"',
  //     'Ask: What would my future self want me to do?',
  //     'Visualize how you\'ll feel AFTER doing it',
  //     'Remind yourself: Done is better than perfect',
  //     'Think: What\'s the cost of NOT doing this?',
      
  //     // Physical Reset
  //     'Take 5 deep breaths',
  //     'Do 10 pushups to change state',
  //     'Stand up and move around',
  //     'Splash cold water on your face',
  //     'Step outside for fresh air'
  //   ]
  // };

  const reasonAlternatives = {
    'Avoiding discomfort': [
    'Sit with the feeling for 5 mins',
    'Journal about what you\'re avoiding',
    'Take 10 deep breaths',
    'Name the emotion out loud',
    'Ask: what am I afraid will happen?',
    'Go for a walk and stay with the feeling',
    ],
    'Bored/understimulated': [
      'Code for 30 mins',
      'Workout',
      'Learn something new (video/article)',
      'Work on a side project',
      'Do a coding challenge',
      'Practice instrument',
    ],
    'Avoiding a specific task': [
      'Set 5-min timer and just start',
      'Do the hardest part for 3 mins',
      'Break task into smallest step',
      'Write down exactly what you\'re avoiding',
      'Tell someone you\'re starting now',
      'Just open the file/app',
    ],
    'Suppressing an emotion': [
      'Journal: what emotion is this?',
      'Sit with it for 3 mins',
      'Call someone and talk about it',
      'Go for a walk without distractions',
      'Cry if you need to',
      'Write an unsent letter',
    ],
    'Habit/automatic': [
      'Change your environment immediately',
      'Drink a glass of water',
      'Do 10 pushups',
      'Step outside for 2 mins',
      'Put phone in different room',
      'Interrupt the pattern with movement',
    ],
    'Craving connection': [
      'Text someone you care about',
      'Call a friend',
      'Go somewhere public',
      'Reach out to make plans',
      'Write to someone',
      'Join an online community discussion',
    ],
    'Stressed/overwhelmed': [
      'Take a walk outside',
      'Do breathing exercises',
      'Write down everything on your mind',
      'Take a shower',
      'Listen to calming music',
      'Do one small manageable task',
    ],
    'Other/not sure': [
      'Journal about what you\'re feeling',
      'Go for a walk',
      'Call a friend',
      'Do something physical',
      'Sit quietly for 5 mins',
      'Change your environment',
    ],
  };

  /* Maybe remove restructure towards urges instead */
  // const urgeQuestions = {
  //   gaming: "Am I avoiding something difficult? What would building feel like instead of playing?",
  //   scrolling: "What real connection am I craving? Who could I reach out to?",
  //   shows: "What am I numbing? What creative thing wants to come out of me?",
  //   food: "What emotion/task am I trying to suppress/avoid? Can I sit with it for 2 minutes?",
  //   avoiding: "What's the 2-minute version of starting this? What's one tiny step?"
  // };

  const urgeReasons = [
    "Avoiding discomfort",
    "Bored/understimulated", 
    "Avoiding a specific task",
    "Suppressing an emotion",
    "Habit/automatic",
    "Craving connection",
    "Stressed/overwhelmed",
    "Other/not sure",
  ];

  /* Either use numbers for next or set up system */
  // const screens = ['home', 'selectUrge', 'why', 'alternatives', 'rating', 'stats', 'history'];

  const urgeLabels = {
    gaming: "Wanting to video game",
    scrolling: "Wanting to doom scroll",
    shows: "Wanting to watch shows",
    avoiding: "Avoiding feeling/thoughts",
    food: "Wanting to distract with Food"
  };

  return (
    <main className="container">

{/* HOME */}
      {currentScreen === "home" && (
        <div className="home-screen">
          <h1 className="title__home">
            Replace the Urge
          </h1>
          <button
            className="big__button"
            onClick={() => setCurrentScreen('selectUrge')}
          >
            {/* Have a Urge? */}
            I have an Urge
          </button>

          <button 
           className="set-intention"
            onClick={() => setCurrentScreen('setIntention')}
          >
            Set Intentional Use
          </button>

        </div>
      )}
{/* INTENTIONAL USE */}
      {currentScreen === 'setIntention' && (
        <div className="intention-screen">
          {recentIntention ? (
            <>
              <h2>You recently set an intention</h2>
              
              <p className="recent-time">
                {Math.round((Date.now() - parseInt(localStorage.getItem('lastIntentionTime'))) / 60000)} minutes ago
              </p>

              <div className="saved-intention">
                <p className="intention-label">Your intention:</p>
                <p className="intention-text">"{localStorage.getItem('lastIntention')}"</p>
              </div>

              <p>Ready to continue?</p>
              <button
                className="continue__button"
                onClick={() => {
                  if (!targetApp) {
                    // if there is no app just does nothing
                    alert(`No targeted app`);
                    return;
                  }
                  
                  if (isMobile) {
                    const shortcutName = `Open ${targetApp} Intentional`;
                    window.location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}`;
                  } else {
                    alert(`Your intention is set. Now open ${targetApp} in your browser.`);
                  }
                }}
              >
                Continue to {targetApp || 'App'}
              </button>
              <button onClick={() => {
                setRecentIntention(false);
                if (isMobile) {
                    window.location.href = `shortcuts://run-shortcut?name=Intentional use off}`;
                }
              }}>
                Set New Intention
              </button>
              <button onClick={() => {
                setRecentIntention(false);
                localStorage.removeItem('lastIntentionTime');
                localStorage.removeItem('lastIntention');
                localStorage.removeItem('lastIntentionApp');
                setCurrentScreen('home')
                if (isMobile) {
                    window.location.href = `shortcuts://run-shortcut?name=Intentional use off}`;
                }
              }}>
                Stop Intention Timer
              </button>
            </>
          ) : (
            <>
              <h2>What's your intention?</h2>
              {!targetApp && (
                  <div className="app-selector">
                    <p>Which app?</p>
                    <select
                      value={targetApp}
                      onChange={(e) => setTargetApp(e.target.value)}
                      className="app-select"
                    >
                      <option value="">Select app...</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Tiktok">Tiktok</option>
                      <option value="Snapchat">Snapchat</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
              )}

              {/* Show selected app if already set */}
              {targetApp && (
                <p className="selected-app">Opening: <strong>{targetApp}</strong></p>
              )}
              
              <textarea
                placeholder={`I'm opening ${targetApp || 'this app'} to...`}
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
              />
              <p>Time limit:</p>
              <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
              </select>

                {isMobile ? (
                  // Mobile: Opens specific shortcut
                  <button
                    onClick={() => {
                      localStorage.setItem('lastIntentionTime', Date.now().toString());
                      localStorage.setItem('lastIntention', intention);
                      localStorage.setItem('lastIntentionApp', targetApp);
                      setRecentIntention(true);

                      const shortcutName = `Open ${targetApp} Intentional`;
                      window.location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}`;
                    }}
                    disabled={!intention.trim() || !targetApp}
                  >
                    Set Intention & Open {targetApp || 'App'}
                  </button>
                ) : (
                  // Desktop: Just saves intention, user opens app manually
                  <button
                    onClick={() => {
                      localStorage.setItem('lastIntentionTime', Date.now().toString());
                      localStorage.setItem('lastIntention', intention);
                      localStorage.setItem('lastIntentionApp', targetApp);
                      setRecentIntention(true);
                      alert(`Intention set for ${timeLimit} mins. Now open ${targetApp} in your browser.`);
                    }}
                    disabled={!intention.trim() || !targetApp}
                  >
                    Set Intention
                  </button>
                )}
            </>
          )}

          <button onClick={() => setCurrentScreen('home')}>
            Actually, nevermind
          </button>
        </div>
      )}

{/* SELECT URGE */}
      {currentScreen === 'selectUrge' && (
        <div className='urge-screen'>
          <p className="urge__title">
            What's the urge?
          </p>
          <div className="urge__buttons">
            {urgeTypes.map(urge => (
              <button
                key={urge}
                onClick={() => {
                  setSelectedUrge(urge);
                  setCurrentScreen('why')
                }}
              >
                {urge}
              </button>
            ))}
          </div>
          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('home')}>Back</button>
          </div>
        </div>
      )}

{/* WHY / REFLECTION */}
      {currentScreen === 'why' && (
        <div className='why-screen'>
          <p>Ask yourself: </p>
          <h1>What am I avoiding and why?</h1>
          {/* <p className="questions-prompt">{urgeQuestions[selectedUrge]}</p> */}

          {/* Doesn't let user continue until 15 sec is up */}
          <div className="timer-display">
            {/* Can add timer circle to display the amount left instead or with
                current countdown */}
            {reflectionTimer > 0 ? (
              <>
                <p className="timer-text">Take a moment to reflect...</p>
                <p className="timer-countdown">{reflectionTimer}s</p>
              </>
            ) : (
              <p className="timer-done">✓ You can continue </p>
              
            )}
          </div>
          <div className="bottom__buttons">
            <button 
              disabled={reflectionTimer > 0}
              className={reflectionTimer > 0 ? 'disabled' : ''}
              onClick={() => setCurrentScreen('selectUrge')}
            >Back</button>
            <button 
              disabled={reflectionTimer > 0}
              className={reflectionTimer > 0 ? 'disabled' : ''}
              onClick={() => setCurrentScreen('selectReason')}
            >Next</button>
          </div>
        </div>
      )}

{/* REASON SELECTOR */}
      {currentScreen === 'selectReason' && (
        <div className="reason-screen">
          <h2>What is the reason underneath?</h2>
          <p className="chosen-urge">{urgeLabels[selectedUrge]}</p>
          <p className="reason-subtitle">Select what fits best</p>

          <div className="reason__buttons">
            {urgeReasons.map(reason => (
              <button
                key={reason}
                onClick={() => {
                  setSelectedReason(reason);
                  setCurrentScreen('alternatives');
                }}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('why')}>Back</button>
          </div>
        </div>
      )}
      
{/* ALTERNATIVES */}
      {currentScreen === 'alternatives' && (
        <div className='alternatives-screen'>
          <h2>
            Let’s redirect that urge
            {/* Try one below instead */}
          </h2>
          <p className="alternative-reason">Reason: <strong>{selectedReason}</strong></p>
          <p className="alternative-try-text">Try one below:</p>
          <div>

  {/* Add shuffle button for alt activities, after adding more alternatives */}
            {reasonAlternatives[selectedReason].map(alt => (
              <button
                key={alt}
                className='alternatives__buttons'
                onClick={() => {
                  setSelectedAlternative(alt)
                  setCurrentScreen('rating')
                }}
              >
                {alt}
              </button>
            ))}
          </div>
          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('selectReason')}>Back</button>
          </div>
        </div>

      )}

{/* RATING: Maybe rework based on timing of task for review */}
      {currentScreen === 'rating' && (
        <div className="rating-screen">
          <h2 className="rating__title">How do you feel right now?</h2>

  {/* TODO, format the previous choice so its not so big*/}          
          <p className="selected-alt">
            <p>Urge: {urgeLabels[selectedUrge]}</p>
            <p>Chose: {selectedAlternative}</p>
          </p>
          {/* <div className="selected-alternative-box">
            <p className="selected-label">You chose:</p>
            <p className="selected-text">{selectedAlternative}</p>
          </div> */}

          <p className="rating__subtitle">Rate how you feel about this choice (1-10)</p>

          <select
            className="rating__select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Select...</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <p className="rating-tip">
            1-3: Not good | 4-6: Alright | 7-10: Great choice
          </p>

          {/* Optional personal note */}
          <div className="Note">
            <label htmlFor="note">Notes (optional):</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did choosing this make you feel? What are you noticing? Any thoughts..."
              rows="4"
            />
          </div>
          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('alternatives')}>Back</button>
            <button
              onClick={() => {
                if (rating) {
                  const newRedirect = {
                    urge: selectedUrge,
                    reason: selectedReason,
                    alternative: selectedAlternative,
                    note: note.trim(),
                    rating: parseInt(rating),
                    timestamp: new Date().toISOString(),
                  };

                  setRedirectHistory([...redirectHistory, newRedirect]);
                  resetForm();
                  setCurrentScreen('stats');
                }
              }}
              disabled={!rating}
            >
              Done
            </button>
          </div>
        </div>
      )}

{/* STATS */}
      {currentScreen === 'stats' && (
        <div className="stats-screen">
          <h2>Nice Work, Keep it Up!</h2>
          <div className="stats">
            <p className="stat__display">
              Urges redirected: <strong>{redirectHistory.length}</strong>
            </p>

            {/* displays most recent redirect and urge */}
            {redirectHistory.length > 0 && (
              <>
                <p>Most recent urge</p>
                <div className="recent-redirect">
                  <p>Urge: {urgeLabels[redirectHistory[redirectHistory.length - 1].urge]}</p>
                  <p>Because: {redirectHistory[redirectHistory.length - 1].reason}</p>
                  <p>Did: {redirectHistory[redirectHistory.length - 1].alternative}</p>
                  <p>Felt: {redirectHistory[redirectHistory.length - 1].rating}/10</p>

                  {redirectHistory[redirectHistory.length - 1].note && (
                    <div className="history-note">
                     <p className="note-label">Note: </p> 
                     <p className="note-text">{redirectHistory[redirectHistory.length - 1].note}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* displays analytic trends */}
            {redirectHistory.length > 0 && getUrgeStats() && (
              <div className="analytics">
                <h3>Your Patterns</h3>

                {/* Most common urges */}
                {/* <div className="analytics-grid">
                  <div className="analytics-card">
                    <p className="analytics-label">Most Common Urges</p>
                    {getUrgeStats().mostCommon.slice(0, 3).map(([urge, count]) => (
                      <div key={urge} className="urge-stat">
                        <span className="urge-name">{urgeLabels[urge]}</span>
                        <span className="urge-count">{count}x</span>
                      </div>
                    ))}
                  </div> */}
                  
                {/* Most Common Reason */}
                <div className="analytics-grid">

                  <div className="analytics-card">
                    <p className="analytics-label">Top Reasons</p>
                    {getUrgeStats().mostCommonReason.slice(0, 3).map(([reason, count]) => (
                      <div key={reason} className="urge-stat">
                        <span className="urge-name">{reason}</span>
                        <span className="urge-count">{count}x</span>
                      </div>
                    ))}
                  </div>
{/* Add most common alternative from urge */}
                  {/* average rating by urge */}
                  <div className="analytics-card">
                    <p className="analytics-label">Avg. Feeling After</p>
                    {Object.entries(getUrgeStats().avgRatings).map(([urge, avg]) => (
                      <div key={urge} className="urge-stat">
                        <span className="urge-name">{urgeLabels[urge]}</span>
                        <span className="urge-rating">{avg}/10</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

          </div>
          {redirectHistory.length > 0 && (
            <button className="view-history-button" onClick={() => setCurrentScreen('history')}>
              View All History ({redirectHistory.length})
            </button>
          )}
          {/* <div className="bottom__buttons"> */}
          <button className="history-home" onClick={() => setCurrentScreen('home')}>Home</button>
          {/* </div> */}
        </div>
      )}

{/* HISTORY */}
    { currentScreen === 'history' && (
      <div className="history-screen">
        <h2>Your History</h2>
        <h3>Total: {redirectHistory.length}</h3>

        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
            <option value="urge-type">Urge Type</option>
          </select>
        </div>

        {redirectHistory.length === 0 ? (
          <div className="empty-history">
            <p>No redirects yet!</p>
            <p>Start by redirecting your first urge.</p>
          </div>
        ) : (
          <>
        <div className="history-list">
          {getSortedHistory().map((redirect, index) => {
            const actualIndex = redirectHistory.findIndex(r => r === redirect);

            return(
              <div key={index} className="history-item">
                <div className="history-content">
                  <p><strong>{urgeLabels[redirect.urge]}</strong></p>
                  {redirect.reason && (
                    <p className="history-reason">Because: {redirect.reason}</p>
                  )}
                  <p>→ {redirect.alternative} </p>
                  <p>Felt: {redirect.rating}/10</p>

                  {redirect.note && (
                    <div className="history-note">
                     <p className="note-label">Note: </p> 
                     <p className="note-text">{redirect.note}</p>
                    </div>
                  )}

                  <p className="timestamp">
                    {new Date(redirect.timestamp).toLocaleDateString()}
                  </p>
                </div>

              {/* Delete button on history */}
                <button
                  className="delete__button"
                  onClick={() => deleteRedirect(actualIndex)}
                  title="Delete this redirect"
                >✕</button>
              </div>
            );
          })}
        </div>

          {(() => {
            const stats = getUrgeStats();
            if (!stats) return null;
            
            return (
              <div className="analytics-compact">
                <h3>Quick Stats</h3>
                <div className="stats-inline">
                  <div className="stat-item">
                    <span className="stat-label">Most triggered by:</span>
                    <span className="stat-value">
                      {stats.mostCommonReason[0][0]} ({stats.mostCommonReason[0][1]}x)
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg feeling after redirecting:</span>
                    <span className="stat-value">
                      {stats.avgRatings[stats.mostCommon[0][0]]}/10
                    </span>
                  </div>
      {/* ADD best alternative for given urge */}
                  <div className="stat-item">
                    <span className="stat-label">Best feeling redirect:</span>
                    <span className="stat-value">
                      {urgeLabels[Object.entries(stats.avgRatings)
                        .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))[0][0]]} 
                      ({Object.entries(stats.avgRatings)
                        .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))[0][1]}/10)
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
          </>
        )}
        <div className="bottom__buttons">
          <button onClick={() => setCurrentScreen('stats')}>Back</button>
          <button onClick={() => setCurrentScreen('home')}>Home</button>
        </div>
      </div>
    )}

      <footer className="footer">
        <p>There's always a deeper meaning.</p>
      </footer>
    </main>
  );
}