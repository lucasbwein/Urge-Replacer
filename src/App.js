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

  useEffect(() => {
    localStorage.setItem('redirectHistory', JSON.stringify(redirectHistory));
  }, [redirectHistory]);

  /* Can add more later */
  const urgeTypes = ['gaming', 'scrolling', 'avoiding', 'shows', 'food'];

  const alternatives = {
    gaming: [
      'Code for 30 mins', 'Workout', 'Journal', 'Practice instrument',
      'Call a friend', 'Go for a walk', 'Read a chapter of something',
    ],
    scrolling: [
      'Code for 30 mins', 'Workout', 'Journal', 'Practice instrument',
      'Call a friend', 'Go for a walk', 'Read a chapter of something'
    ],
    shows: [
      'Code for 30 mins', 'Workout', 'Journal', 'Practice instrument',
      'Call a friend', 'Go for a walk', 'Read a chapter of something'
    ],
    food: [
      'Go for a walk', 'Drink some water', 'Journal', 'Call a friend',
      'Go for a drive'
    ],
    avoiding: ['Set a 5-min timer and start', 'Clean room', 'Make bed',
      'Complete one small task', 'Sit with self(emotions)', 'Journal'
    ]
  };


  const urgeLabels = {
    gaming: "Wants to game",
    scrolling: "Doom scrolling",
    shows: "Wants to watch shows",
    avoiding: "Avoiding something",
    food: "Distracting with Food"
  };

  return (
    <main className="container">

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

      {currentScreen === 'why' && (
        <div className='why-screen'>
          <p>Ask yourself: </p>
          <h1>What am I avoiding and why?</h1>

          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('selectUrge')}>Back</button>
            <button onClick={() => setCurrentScreen('alternatives')}>Next</button>
          </div>
        </div>
      )}

      {currentScreen === 'alternatives' && (
        <div className='alternatives-screen'>
          <h2>
            Let’s redirect that urge
            {/* Try one below instead */}
          </h2>
          <p>Urge: {urgeLabels[selectedUrge]}</p>
          <p className="alternative-try-text">Try one below:</p>
          <div>
  {/* Add shuffle button for alt activities */}
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

      {currentScreen === 'rating' && (
        <div className="rating-screen">
          <h2 className="rating__title">How do you feel after?</h2>
          <p>Alternative Selected: {selectedAlternative}</p>
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
          <div className="Note">
            <textarea>

            </textarea>
          </div>
          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('alternatives')}>Back</button>
            <button
              onClick={() => {
                if (rating) {
                  const newRedirect = {
                    urge: selectedUrge,
                    alternative: selectedAlternative,
                    rating: parseInt(rating),
                    timestamp: new Date().toISOString(),
                  };

                  setRedirectHistory([...redirectHistory, newRedirect]);

                  setSelectedUrge('')
                  setSelectedAlternative('')
                  setRating('')
                  setCurrentScreen('stats')
                }
              }}
            >Done</button>
          </div>
        </div>
      )}

      {currentScreen === 'stats' && (
        <div className="stats-screen">
          <h2>Nice Work, Keep it Up!</h2>
          <div className="stats">
            <p className="stat__display">
              Urges redirected: <strong>{redirectHistory.length}</strong>
            </p>

            {redirectHistory.length > 0 && (
              <>
                <p>Most recent urge</p>
                <div className="recent-redirect">
                  <p>Urge: {urgeLabels[redirectHistory[redirectHistory.length - 1].urge]}</p>
                  <p>Did: {redirectHistory[redirectHistory.length - 1].alternative}</p>
                  <p>Felt: {redirectHistory[redirectHistory.length - 1].rating}/10</p>
                </div>
              </>
            )}
          </div>
          {redirectHistory.length > 0 && (
            <button onClick={() => setCurrentScreen('history')}>
              View All History ({redirectHistory.length})
            </button>
          )}
          <div className="bottom__buttons">
            <button onClick={() => setCurrentScreen('rating')}>Back</button>
            <button onClick={() => setCurrentScreen('home')}>Home</button>
          </div>
        </div>
      )}

    {/* Shows all history */}
    { currentScreen === 'history' && (
      <div className="history-screen">
        <h2>Your History</h2>
        <div className="history-list">
          {redirectHistory.slice().reverse().map((redirect, index) => (
            <div key={index} className="history-item">
              <p><strong>{urgeLabels[redirect.Urge]}</strong></p>
              <p>→ {redirect.alternative} </p>
              <p>Felt: {redirect.rating}/10</p>
              <p className="timestamp">
                {new Date(redirect.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <div className="bottom__buttons">
          <button onClick={() => setCurrentScreen('stats')}>Back</button>
          <button onClick={() => setCurrentScreen('home')}>Home</button>
        </div>
      </div>
    )}

      <footer className="footer">
        <p>Theres always a deeper meaning.</p>
      </footer>
    </main>
  );
}