'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFadeOut(true), 3200);
    const done = setTimeout(() => setLoading(false), 3800);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, []);

  if (loading) return <Splash fadeOut={fadeOut} />;

  return (
    <div className="page">

      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">🌸 EndoTrack</span>
          {['Home', 'Journal', 'Patterns', 'Insights', 'Report'].map(l => (
            <a key={l} href={`/${l === 'Home' ? '' : l.toLowerCase()}`}
              className={`nav-link ${l === 'Home' ? 'nav-link-active' : ''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="container">

        {/* Hero */}
        <div className="hero">
          <div className="hero-label">Symptom Tracking</div>
          <h1 className="hero-title">Your pain has a pattern. Let&apos;s find it.</h1>
          <p className="hero-desc">
            Log how you feel each day. Track cycles, spot recurring symptoms, and walk into every appointment prepared.
          </p>
          <div className="hero-actions">
            <a href="/journal" className="btn-primary">✍️ Start Check-in</a>
            <a href="/patterns" className="btn-outline">View Patterns →</a>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="alert-banner">
          <div className="alert-icon">!</div>
          <div className="alert-body">
            <div className="alert-title">This may not be typical.</div>
            <div className="alert-desc">Some of your logged symptoms show a recurring pattern. It may be worth discussing with a doctor.</div>
          </div>
          <a href="/insights" className="btn-primary btn-sm">See Why →</a>
        </div>

        {/* Stats */}
        <div className="grid-3">
          {[
            { label: 'Entries Logged', value: '0', icon: '📝', cls: 'stat-purple', txt: 'stat-purple-text' },
            { label: 'Patterns Found', value: '0', icon: '🔍', cls: 'stat-pink',   txt: 'stat-pink-text' },
            { label: 'Days Tracked',   value: '0', icon: '📅', cls: 'stat-rose',   txt: 'stat-rose-text' },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              <div className={`stat-value ${s.txt}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Check-in */}
        <div className="card checkin">
          <div className="checkin-header">
            <div>
              <h2 className="checkin-title">Today&apos;s Check-in</h2>
              <p className="checkin-sub">How are you feeling right now?</p>
            </div>
            <span className="checkin-emoji">🌸</span>
          </div>

          <div className="pain-section">
            <div className="pain-row">
              <span className="pain-label">Pain Level</span>
              <span className="pain-value">5 / 10</span>
            </div>
            <div className="pain-track">
              <div className="pain-fill" />
            </div>
            <div className="pain-row">
              <span className="pain-hint">No pain</span>
              <span className="pain-hint">Severe</span>
            </div>
          </div>

          <div className="mood-section">
            <span className="mood-label">Mood</span>
            <div className="mood-bubbles">
              {['😔 Low', '😐 Okay', '😤 Frustrated', '😰 Anxious', '🙂 Good'].map((m, i) => (
                <button key={m} className={`mood-btn ${i === 0 ? 'mood-active' : ''}`}>{m}</button>
              ))}
            </div>
          </div>

          <a href="/journal" className="btn-primary btn-block">Log Full Entry →</a>
        </div>

        {/* Feature Cards */}
        <div className="grid-2">
          {[
            { href: '/patterns', icon: '📊', title: 'Pattern Pulse',  desc: 'Visual wave graph of your pain cycles over time',        cls: 'icon-purple' },
            { href: '/insights', icon: '🔴', title: 'Second Look',     desc: 'Flags symptoms that keep getting dismissed',             cls: 'icon-pink' },
            { href: '/journal',  icon: '✍️', title: 'Symptom Journal', desc: 'Write naturally and track pain, triggers and mood',      cls: 'icon-rose' },
            { href: '/report',   icon: '📄', title: 'Doctor Report',   desc: 'Export a clean PDF timeline for your next appointment',  cls: 'icon-red' },
          ].map(c => (
            <a key={c.href} href={c.href} className="feature-link">
              <div className="card feature-card">
                <div className={`feature-icon ${c.cls}`}>{c.icon}</div>
                <div className="feature-title">{c.title}</div>
                <div className="feature-desc">{c.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Quote */}
        <div className="quote-card">
          <div className="quote-heart">💗</div>
          <p className="quote-text">&quot;This doesn&apos;t have to be something you just live with.&quot;</p>
          <p className="quote-sub">On average, endometriosis takes 7–10 years to diagnose. Your records can help change that.</p>
        </div>

      </div>
    </div>
  );
}

function Splash({ fadeOut }: { fadeOut: boolean }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    'Initializing your journal...',
    'Loading symptom patterns...',
    'Preparing your insights...',
    'Almost ready...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
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

  return (
    <div className={`splash ${fadeOut ? 'splash-fade' : ''}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {[...Array(12)].map((_, i) => (
        <div key={i} className={`particle particle-${i + 1}`} />
      ))}

      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-ring splash-ring-1" />
          <div className="splash-ring splash-ring-2" />
          <div className="splash-ring splash-ring-3" />
          <div className="splash-icon">🌸</div>
        </div>

        <h1 className="splash-title">EndoTrack</h1>
        <p className="splash-tagline">Your body. Your data. Your voice.</p>

        <div className="splash-progress-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
            <div className="splash-progress-glow" style={{ left: `${progress}%` }} />
          </div>
          <div className="splash-progress-row">
            <span className="splash-step">{steps[step]}</span>
            <span className="splash-pct">{progress}%</span>
          </div>
        </div>

        <div className="splash-dots">
          {[0, 1, 2].map(i => (
            <div key={i} className="splash-dot" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
