'use client';
import './journal.css';
import { useState } from 'react';

const TRIGGERS = ['Period', 'Ovulation', 'Exercise', 'Stress', 'Food', 'Sex', 'Bowel', 'Urination', 'Standing', 'Sitting'];
const SYMPTOMS = ['Cramping', 'Bloating', 'Back Pain', 'Nausea', 'Fatigue', 'Headache', 'Spotting', 'Stabbing Pain', 'Pressure', 'Burning'];
const MOODS = ['😔', '😐', '😤', '😰', '😢', '🙂', '😊'];
const MOOD_LABELS = ['Very Low', 'Neutral', 'Frustrated', 'Anxious', 'Sad', 'Okay', 'Good'];

export default function Journal() {
  const [pain, setPain] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setPain(0); setMood(null); setTriggers([]); setSymptoms([]); setNote(''); setStep(1);
  };

  const painColor = pain <= 3 ? '#4ade80' : pain <= 6 ? '#fb923c' : '#f43f5e';
  const painLabel = pain === 0 ? 'No Pain' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : pain <= 8 ? 'Severe' : 'Unbearable';

  return (
    <div className="page">

      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">🌸 EndoTrack</a>
          {['Home', 'Journal', 'Patterns', 'Insights', 'Report'].map(l => (
            <a key={l} href={`/${l === 'Home' ? '' : l.toLowerCase()}`}
              className={`nav-link ${l === 'Journal' ? 'nav-link-active' : ''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="j-container">

        <div className="j-header">
          <div>
            <p className="j-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="j-title">How are you feeling?</h1>
          </div>
          <div className="j-streak">
            <span className="j-streak-num">🔥 3</span>
            <span className="j-streak-label">day streak</span>
          </div>
        </div>

        <div className="j-steps">
          {['Pain', 'Mood', 'Symptoms', 'Note'].map((s, i) => (
            <div key={s} className="j-step-item" onClick={() => setStep(i + 1)}>
              <div className={`j-step-circle ${step === i + 1 ? 'j-step-active' : step > i + 1 ? 'j-step-done' : ''}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`j-step-label ${step === i + 1 ? 'j-step-label-active' : ''}`}>{s}</span>
            </div>
          ))}
          <div className="j-step-line" />
        </div>

        {step === 1 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon" style={{ background: '#fff0f3' }}>🌡️</div>
              <div>
                <h2 className="j-card-title">Pain Level</h2>
                <p className="j-card-sub">Drag to set your current pain intensity</p>
              </div>
            </div>
            <div className="j-pain-display">
              <div className="j-pain-number" style={{ color: painColor }}>{pain}</div>
              <div className="j-pain-label" style={{ color: painColor }}>{painLabel}</div>
            </div>
            <div className="j-slider-wrap">
              <input type="range" min={0} max={10} value={pain}
                onChange={e => setPain(Number(e.target.value))}
                className="j-slider" />
              <div className="j-slider-ticks">
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                  <span key={n} className={`j-tick ${n <= pain ? 'j-tick-active' : ''}`}
                    style={{ color: n <= pain ? painColor : undefined }}>{n}</span>
                ))}
              </div>
            </div>
            <div className="j-pain-scale">
              {[
                { range: '0–2', label: 'Mild',       color: '#4ade80', bg: '#f0fdf4' },
                { range: '3–5', label: 'Moderate',   color: '#fb923c', bg: '#fff7ed' },
                { range: '6–8', label: 'Severe',     color: '#f43f5e', bg: '#fff1f2' },
                { range: '9–10', label: 'Unbearable', color: '#be123c', bg: '#ffe4e6' },
              ].map(p => (
                <div key={p.label} className="j-pain-ref" style={{ background: p.bg }}>
                  <span className="j-pain-ref-range" style={{ color: p.color }}>{p.range}</span>
                  <span className="j-pain-ref-label">{p.label}</span>
                </div>
              ))}
            </div>
            <button className="j-next-btn" onClick={() => setStep(2)}>Continue → Mood</button>
          </div>
        )}

        {step === 2 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon" style={{ background: '#fdf4ff' }}>💭</div>
              <div>
                <h2 className="j-card-title">Mood Check</h2>
                <p className="j-card-sub">How are you feeling emotionally?</p>
              </div>
            </div>
            <div className="j-mood-grid">
              {MOODS.map((m, i) => (
                <button key={m} onClick={() => setMood(i)}
                  className={`j-mood-btn ${mood === i ? 'j-mood-selected' : ''}`}>
                  <span className="j-mood-emoji">{m}</span>
                  <span className="j-mood-label">{MOOD_LABELS[i]}</span>
                </button>
              ))}
            </div>
            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="j-next-btn" onClick={() => setStep(3)}>Continue → Symptoms</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon" style={{ background: '#fff0f3' }}>🔍</div>
              <div>
                <h2 className="j-card-title">Symptoms & Triggers</h2>
                <p className="j-card-sub">Select everything that applies today</p>
              </div>
            </div>
            <p className="j-section-label">Symptoms</p>
            <div className="j-tag-grid">
              {SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggleItem(s, symptoms, setSymptoms)}
                  className={`j-tag ${symptoms.includes(s) ? 'j-tag-active' : ''}`}>{s}</button>
              ))}
            </div>
            <p className="j-section-label" style={{ marginTop: '1.5rem' }}>Triggers</p>
            <div className="j-tag-grid">
              {TRIGGERS.map(t => (
                <button key={t} onClick={() => toggleItem(t, triggers, setTriggers)}
                  className={`j-tag ${triggers.includes(t) ? 'j-tag-active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="j-nav-row" style={{ marginTop: '1.75rem' }}>
              <button className="j-back-btn" onClick={() => setStep(2)}>← Back</button>
              <button className="j-next-btn" onClick={() => setStep(4)}>Continue → Note</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon" style={{ background: '#fff7ed' }}>✍️</div>
              <div>
                <h2 className="j-card-title">Add a Note</h2>
                <p className="j-card-sub">Describe how you feel in your own words</p>
              </div>
            </div>
            <textarea className="j-textarea"
              placeholder={`e.g. "Sharp pain during my period again, doctor said it's normal but it's getting worse..."`}
              value={note} onChange={e => setNote(e.target.value)} rows={5} />
            <div className="j-char-count">{note.length} characters</div>
            <div className="j-summary">
              <p className="j-summary-title">Entry Summary</p>
              <div className="j-summary-grid">
                <div className="j-summary-item">
                  <span className="j-summary-key">Pain</span>
                  <span className="j-summary-val" style={{ color: painColor }}>{pain}/10 — {painLabel}</span>
                </div>
                <div className="j-summary-item">
                  <span className="j-summary-key">Mood</span>
                  <span className="j-summary-val">{mood !== null ? `${MOODS[mood]} ${MOOD_LABELS[mood]}` : 'Not set'}</span>
                </div>
                <div className="j-summary-item">
                  <span className="j-summary-key">Symptoms</span>
                  <span className="j-summary-val">{symptoms.length > 0 ? symptoms.join(', ') : 'None selected'}</span>
                </div>
                <div className="j-summary-item">
                  <span className="j-summary-key">Triggers</span>
                  <span className="j-summary-val">{triggers.length > 0 ? triggers.join(', ') : 'None selected'}</span>
                </div>
              </div>
            </div>
            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => setStep(3)}>← Back</button>
              <button className="j-submit-btn" onClick={handleSubmit}>Save Entry 💾</button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="j-toast">
            <span>✅</span>
            <div>
              <div className="j-toast-title">Entry saved!</div>
              <div className="j-toast-sub">Your symptom log has been recorded.</div>
            </div>
          </div>
        )}

        <div>
          <h2 className="j-past-title">Recent Entries</h2>
          <div className="j-past-empty">
            <div className="j-past-empty-icon">📋</div>
            <p>No entries yet. Start logging to see your history here.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
