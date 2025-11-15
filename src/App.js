import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const [selectedUrge, setSelectedUrge] = useState('');
  const [selectedAlternative, setSelectedAlternative] = useState('');

  const [rating, setRating] = useState("");

  const [redirectHistory, setRedirectHistory] = useState(() => {
    const saved = localStorage.getItem('redirectHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [note, setNote] = useState("");

  const [sortOrder, setSortOrder] = useState('newest');

  const [reflectionTimer, setReflectionTimer] = useState(15);

  /* Resets screen at top when going next page */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  /* Creates timer for reflection screen, also can add more time based on urge type */
  useEffect(() => {
    if(currentScreen === 'why' && reflectionTimer > 0) {
      const interval = setInterval(() => {
        setReflectionTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if(currentScreen !== 'why'){
      setReflectionTimer(15); 
      // setReflectionTimer(5);
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

    const urgeCounts = {}; /* Counts amonut of urges occured */
    redirectHistory.forEach(redirect => {
      urgeCounts[redirect.urge] = (urgeCounts[redirect.urge] || 0) + 1;
    });

    /* Finds most common occurance of urge */
    const mostCommon = Object.entries(urgeCounts).sort((a, b) => b[1] - a[1]);

    const urgeRatings = {};
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

    return {
      mostCommon,
      urgeCounts,
      avgRatings,
      total: redirectHistory.length
    };
  }

  function resetForm() {
    setSelectedUrge('');
    setSelectedAlternative('');
    setNote('');
    setRating('');
  }

  /* Can add more later */
  const urgeTypes = ['gaming', 'scrolling', 'avoiding', 'shows', 'food'];

  const alternatives = {
    gaming: [
      'Code for 30 mins', 'Workout', 'Journal', 'Practice instrument',
      'Call a friend', 'Go for a walk', 'Read a chapter of something',
      'Hang out with a friend', 'Work on a side project', 'Watch a tutorial and take notes',
      'Do pushups/quick exercise', 'Clean/organize one area', 'Plan tomorrow authentically'
    ],
    scrolling: [
      'Code for 30 mins', 'Workout', 'Journal - write thoughts', 'Practice instrument',
      'Call a friend', 'Go for a walk', 'Read a chapter of something',
      'Hang out with a friend', 'Clean your space',
      'Plan your next project', 'Write down 3 things you\'re grateful for',
      'Do a coding challenge (LeetCode)','Text someone you care about',
      'Go outside without phone'
    ],
    shows: [
      'Code for 30 mins', 'Workout', 'Journal', 'Practice instrument',
      'Call a friend for real conversation', 'Go for a walk', 'Read fiction/non-fiction',
      'Hang out with a friend', 'Go outside and photograph', 'Cook a real meal',
      'Journal about your day or thoughts'
    ],
    food: [
      'Go for a walk', 'Drink some water and wait', 'Journal -  what emotion am I avoiding?',
      'Call a friend', 'Chew gum', 'Make tea/coffee instead', 'Sit with the feeling for 5 mins',
      'Go for a drive', 'Brush teeth (changes taste/mindset)', 'Take a cold shower'
    ],
    avoiding: ['Set a 5-min timer and start', 'Clean room', 'Make bed',
      'Complete one small task', 'Sit with self(emotions)', 'Journal - why?',
      'Make bed (small wins build momentum)', 'Sit with the discomfort for 4 mins',
      'Remember: "No matter what I can handle it and move forward"', 
      'Start with the hardest part for 3 mins', 'Break task into smallest possible step',
      'Write down the exact thing I am avoiding'
    ]
  };
  const urgeQuestions = {
    gaming: "Am I avoiding something difficult? What would building feel like instead of playing?",
    scrolling: "What real connection am I craving? Who could I reach out to?",
    shows: "What am I numbing? What creative thing wants to come out of me?",
    food: "What emotion/task am I trying to suppress/avoid? Can I sit with it for 2 minutes?",
    avoiding: "What's the 2-minute version of starting this? What's one tiny step?"
  };

  /* Either use numbers for next or set up system */
  // const screens = ['home', 'selectUrge', 'why', 'alternatives', 'rating', 'stats', 'history'];

  const urgeLabels = {
    gaming: "Wants to game",
    scrolling: "Doom scrolling",
    shows: "Wants to watch shows",
    avoiding: "Avoiding something (Fear)",
    food: "Distracting with Food"
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
          <p className="questions-prompt">{urgeQuestions[selectedUrge]}</p>

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
              onClick={() => setCurrentScreen('alternatives')}
            >Next</button>
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
          <p>Urge: {urgeLabels[selectedUrge]}</p>
          <p className="alternative-try-text">Try one below:</p>
          <div>
  {/* Add shuffle button for alt activities, after adding more alternatives */}
            {alternatives[selectedUrge].map(alt => (
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
            <button onClick={() => setCurrentScreen('why')}>Back</button>
          </div>
        </div>

      )}

{/* RATING: Maybe rework based on timing of task for review */}
      {currentScreen === 'rating' && (
        <div className="rating-screen">
          <h2 className="rating__title">How do you feel right now?</h2>

{/* TODO, format the previous choice */}          
          <p className="selected-alt">Chose: {selectedAlternative}</p>
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

          {/* Adding optional personal note */}
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
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <p className="analytics-label">Most Common Urges</p>
                    {getUrgeStats().mostCommon.slice(0, 3).map(([urge, count]) => (
                      <div key={urge} className="urge-stat">
                        <span className="urge-name">{urgeLabels[urge]}</span>
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

        {getUrgeStats() && (
          <div className="analytics-compact">
            <h3>Quick Stats</h3>
            <div className="stats-inline">
              <div className="stat-item">
                <span className="stat-label">Most common urge:</span>
                <span className="stat-value">{urgeLabels[getUrgeStats().mostCommon[0][0]]} ({getUrgeStats().mostCommon[0][1]}x)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average feeling:</span>
                <span className="stat-value">
                  {Object.entries(getUrgeStats().avgRatings)
                    .sort((a, b) => b[1] - a[1])[0][1]}/10
                </span>
              </div>
            </div>
          </div>
        )}
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