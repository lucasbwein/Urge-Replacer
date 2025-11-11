import { useState } from 'react';
import './App.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const [selectedUrge, setSelectedUrge] = useState('');
  const [selectedAlternative, setSelectedAlternative] = useState('');

  const [rating, setRating] = useState("");

  const [redirectHistory, setRedirectHistory] = useState([]);
    /* Add local storage abovve and add useEffect to intialize */

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

      {currentScreen === 'home' && (
        <div className="home-screen">
          <h1 className="title__home">
            Replace the Urge
          </h1>
          <button
            className='big__button'
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
          <button onClick={() => setCurrentScreen('home')}>Back</button>
        </div>
      )}

      {currentScreen === 'why' && (
        <div className='why-screen'>
          <p>Ask yourself: </p>
          <h1>What am I avoiding and why?</h1>

          <button onClick={() => setCurrentScreen('selectUrge')}>Back</button>
          <button onClick={() => setCurrentScreen('alternatives')}>Next</button>
        </div>
      )}

      {currentScreen === 'alternatives' && (
        <div className='alternatives-screen'>
          <h2>
            {/* Alternatives */}
            Try one below instead
          </h2>
          <p>Urge: {urgeLabels[selectedUrge]}</p>
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
          <button onClick={() => setCurrentScreen('why')}>Back</button>
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
          <button onClick={() => setCurrentScreen('alternatives')}>Back</button>
          <button
            onClick={() => {
              if (rating) {
                const newRedirect = {
                  urge: selectedUrge,
                  alternatives: selectedAlternative,
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
          <button onClick={() => setCurrentScreen('home')}>Home</button>
        </div>
      )}

    {/* TODO add history home screen */}

      <footer className="footer">
        <p>Theres always a deeper meaning.</p>
      </footer>
    </main>
  );
}