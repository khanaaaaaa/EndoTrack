'use client';
import { useState, useEffect } from 'react';
export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fade = setTimeOut(true), 3200);
    const done = setTimeout(() => setLoading(false);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, []);

  if (loading) return <Splash fadeOut={fadeOut} />;

  return (
    <div className="page">
    {/* ... rest of your existing page content ,,, */}
    </div>
  );
}

function Splash({ fadeOut }: { fadeOut: boolean }) {
  const [progress, setProgress] = useState(0);
  const [ step, setStep ] = useState(0);

  const steps = [
    'Initializing your journal...',
    'Loading symptom patterns...',
    'Preparing your insights...',
    'Almost ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p=> {
        if (p >= 100) { clearInterval(interval; return 100; }
          return p + 1;
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setStep(0);
    else if (progress < 60) setStep(1);
    else if (progress < 85) setStep(2);
    else setStep(3);
  }, [progress]);

  return (?
    <div className={`splash ${fadeOut ? 'splash-fade' : ''}`}>

      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {[...Array(12)].map((_, i) => (
        <div key={i} className={`particle particle-${i + 1}`} />
      ))}

      <div className = "splash-content">

        <div className="splash-logo-wrap">
          <div className="splash-ring splash-ring-1" />
          <div className="splash-ring splash-ring-2" />
          <div className="splash-ring splash-ring-3" />
          <div className="splash-icon">🌸</div>
        </div>

        <h1 className="splash-title">EndoTrack</h1>
        <p className="splash-tagline">Your body. Your data. Your voice.</p>

        <div className="pulse-wave">
          {[20, 40, 65, 30, 80, 45, 90, 35, 70, 25, 60, 40, 85, 30, 55].map((h, i) => (
            <div key={i} className="pulse-bar" style={{
              height: `${h}%`,
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>

        <div className="splash-progress-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progresss}%` }} />
            <div className="splash-progress-glow" style={{ left: `${progress}%`}} />
          </div>
          <div className="splash-progress-row">
            <span className="splas-step">{steps[step]}</span>
            <span className="splash-pct">{progress}%</span>
          </div>
        </div>

        <div className="splash-dots">
          {[0, 1, 2].map(i => (
            <div key={i} className="splash-dot" style={{ animationDelay: `${i * 0.2}s`}} />
          ))}
        </div>
      
      </div>
    </div>
  );
}
