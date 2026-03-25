'use client';
import { useState, useEffect } from 'react';

const AFFIRMATIONS = [
  "Your pain is real. Your experience is valid.",
  "You deserve answers, not dismissal.",
  "Tracking today is advocating for yourself tomorrow.",
  "You know your body better than anyone.",
  "One entry at a time. You're doing great.",
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [affirmation, setAffirmation] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [quickPain, setQuickPain] = useState(5);
  const [quickMood, setQuickMood] = useState<number | null>(null);

  useEffect(() => {
    const fade = setTimeout(() => setFadeOut(true), 3200);
    const done = setTimeout(() => setLoading(false), 3800);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAffirmation(a => (a + 1) % AFFIRMATIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Splash fadeOut={fadeOut} />;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour  = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">🌸 EndoTrack</span>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Home'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="container">

        {/* Greeting */}
        <div className="h-greeting-row">
          <div>
            <p className="h-date">{today}</p>
            <h1 className="h-greeting">{greeting} 🌸</h1>
          </div>
          <div className="h-streak-badge">
            <span className="h-streak-fire">🔥</span>
            <div>
              <div className="h-streak-num">3</div>
              <div className="h-streak-label">day streak</div>
            </div>
          </div>
        </div>

        {/* Rotating Affirmation */}
        <div className="h-affirmation">
          <div className="h-affirmation-bar" />
          <p className="h-affirmation-text" key={affirmation}>
            {AFFIRMATIONS[affirmation]}
          </p>
        </div>

        {/* Quick Check-in */}
        {!checkedIn ? (
          <div className="card h-checkin">
            <div className="h-checkin-top">
              <div>
                <h2 className="h-checkin-title">Quick Check-in</h2>
                <p className="h-checkin-sub">30 seconds. How are you right now?</p>
              </div>
              <span style={{ fontSize: '1.75rem' }}>🌡️</span>
            </div>

            <div className="h-pain-row">
              <span className="h-pain-label">Pain</span>
              <input type="range" min={0} max={10} value={quickPain}
                onChange={e => setQuickPain(Number(e.target.value))}
                className="j-slider" />
              <span className="h-pain-val"
                style={{ color: quickPain <= 3 ? '#4ade80' : quickPain <= 6 ? '#fb923c' : '#f43f5e' }}>
                {quickPain}
              </span>
            </div>

            <div className="h-mood-row">
              {['😔','😐','😤','😰','🙂','😊'].map((m, i) => (
                <button key={m} onClick={() => setQuickMood(i)}
                  className={`h-mood-btn ${quickMood === i ? 'h-mood-active' : ''}`}>{m}</button>
              ))}
            </div>

            <div className="h-checkin-actions">
              <button className="btn-primary h-checkin-save"
                onClick={() => setCheckedIn(true)}>
                Save Quick Entry ✓
              </button>
              <a href="/journal" className="h-checkin-full">Full entry →</a>
            </div>
          </div>
        ) : (
          <div className="card h-checked-done">
            <span style={{ fontSize: '2rem' }}>✅</span>
            <div>
              <div className="h-done-title">Check-in saved!</div>
              <div className="h-done-sub">Pain: {quickPain}/10 · <a href="/journal" style={{ color: '#e91e8c' }}>Add more detail →</a></div>
            </div>
          </div>
        )}

        {/* Normal Alert */}
        <div className="h-alert">
          <div className="h-alert-pulse"><div className="h-alert-dot" /></div>
          <div className="h-alert-body">
            <div className="h-alert-title">⚠️ This may not be typical.</div>
            <div className="h-alert-desc">Recurring high-pain entries detected. Your patterns may warrant medical evaluation.</div>
          </div>
          <a href="/insights" className="btn-primary h-alert-btn">See Why →</a>
        </div>

        {/* Stats */}
        <div className="grid-3">
          {[
            { label: 'Entries Logged', value: '6',   icon: '📝', color: '#e91e8c', bg: '#fce4ec' },
            { label: 'Avg Pain Score', value: '6.8', icon: '📊', color: '#c2410c', bg: '#fff7ed' },
            { label: 'Days Tracked',   value: '14',  icon: '📅', color: '#7c3aed', bg: '#f5f3ff' },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* This Week Heatmap */}
        <div className="card h-week">
          <h2 className="h-week-title">This Week</h2>
          <div className="h-week-grid">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
              const pain = [7, 4, 0, 8, 5, 3, 0][i];
              const bg = pain === 0 ? '#fce4ec' : pain <= 3 ? '#bbf7d0' : pain <= 6 ? '#fed7aa' : '#fecaca';
              const color = pain === 0 ? '#b07a90' : pain <= 3 ? '#166534' : pain <= 6 ? '#9a3412' : '#991b1b';
              return (
                <div key={d} className="h-week-day">
                  <div className="h-week-bubble" style={{ background: bg, color }}>
                    {pain === 0 ? '—' : pain}
                  </div>
                  <span className="h-week-label">{d}</span>
                </div>
              );
            })}
          </div>
          <div className="h-week-legend">
            <span style={{ color: '#b07a90' }}>— No entry</span>
            <span style={{ color: '#166534' }}>● Mild</span>
            <span style={{ color: '#9a3412' }}>● Moderate</span>
            <span style={{ color: '#991b1b' }}>● Severe</span>
          </div>
        </div>

        {/* Nav Cards */}
        <div className="grid-2">
          {[
            { href: '/patterns', icon: '📊', title: 'Pattern Pulse',   desc: 'Bunny calendar + pain wave visualization' },
            { href: '/insights', icon: '🔍', title: 'Second Look',      desc: 'AI flags symptoms that keep getting dismissed' },
            { href: '/journal',  icon: '✍️', title: 'Full Journal',     desc: 'Log pain, mood, symptoms and triggers' },
            { href: '/report',   icon: '📄', title: 'Doctor Report',    desc: 'Export a PDF timeline for your appointment' },
          ].map(c => (
            <a key={c.href} href={c.href} className="feature-link">
              <div className="card feature-card">
                <div className="feature-icon icon-purple">{c.icon}</div>
                <div className="feature-title">{c.title}</div>
                <div className="feature-desc">{c.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Quote */}
        <div className="quote-card">
          <div className="quote-heart">💗</div>
          <p className="quote-text">"This doesn&apos;t have to be something you just live with."</p>
          <p className="quote-sub">On average, endometriosis takes 7–10 years to diagnose. Your records can help change that.</p>
        </div>

      </div>
    </div>
  );
}

function Splash({ fadeOut }: { fadeOut: boolean }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const steps = ['Initializing your journal...','Loading symptom patterns...','Preparing your insights...','Almost ready...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 1; });
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
      <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
      {[...Array(12)].map((_,i) => <div key={i} className={`particle particle-${i+1}`} />)}
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-ring splash-ring-1" />
          <div className="splash-ring splash-ring-2" />
          <div className="splash-ring splash-ring-3" />
          <div className="splash-icon">🌸</div>
        </div>
        <h1 className="splash-title">EndoTrack</h1>
        <p className="splash-tagline">Your body. Your data. Your voice.</p>
        <div className="pulse-wave">
          {[20,40,65,30,80,45,90,35,70,25,60,40,85,30,55].map((h,i) => (
            <div key={i} className="pulse-bar" style={{ height:`${h}%`, animationDelay:`${i*0.08}s` }} />
          ))}
        </div>
        <div className="splash-progress-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width:`${progress}%` }} />
            <div className="splash-progress-glow" style={{ left:`${progress}%` }} />
          </div>
          <div className="splash-progress-row">
            <span className="splash-step">{steps[step]}</span>
            <span className="splash-pct">{progress}%</span>
          </div>
        </div>
        <div className="splash-dots">
          {[0,1,2].map(i => <div key={i} className="splash-dot" style={{ animationDelay:`${i*0.2}s` }} />)}
        </div>
      </div>
    </div>
  );
}
