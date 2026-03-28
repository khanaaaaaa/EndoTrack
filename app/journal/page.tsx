'use client';
import './journal.css';
import { useState } from 'react';

const TRIGGERS = ['Period', 'Ovulation', 'Exercise', 'Stress', 'Food', 'Bowel', 'Urination', 'Standing', 'Sitting'];
const SYMPTOMS = ['Cramping', 'Bloating', 'Back Pain', 'Nausea', 'Fatigue', 'Headache', 'Spotting', 'Stabbing Pain', 'Pressure', 'Burning'];
const MOODS = ['Very Low', 'Low', 'Neutral', 'Anxious', 'Frustrated', 'Okay', 'Good'];

export default function Journal() {
  const [step, setStep] = useState(1);
  const [pain, setPain] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggle = (item: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const tryNext = (current: number) => {
    setError('');
    if (current === 1 && pain === null) { setError('Please select a pain level before continuing.'); return; }
    if (current === 2 && mood === null) { setError('Please select a mood before continuing.'); return; }

    setStep(current + 1);
  };

  const handleSubmit = () => {
    if (!note.trim()) { setError('Please add a note before saving.'); return; }
    const entry = { date: new Date().toISOString(), pain, mood: mood !== null ? MOODS[mood] : null, symptoms, triggers, note };
    const existing = JSON.parse(localStorage.getItem('endo_entries') || '[]');
    localStorage.setItem('endo_entries', JSON.stringify([entry, ...existing]));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPain(null); setMood(null); setSymptoms([]); setTriggers([]); setNote(''); setStep(1);
    }, 3000);
  };

  const painColor = pain === null ? '#e91e8c' : pain <= 3 ? '#4ade80' : pain <= 6 ? '#fb923c' : '#f43f5e';
  const painLabel = pain === null ? '' : pain === 0 ? 'No Pain' : pain <= 3 ? 'Mild' : pain <= 6 ? 'Moderate' : pain <= 8 ? 'Severe' : 'Unbearable';

  const STEPS = ['Pain Level', 'Mood', 'Symptoms', 'Triggers', 'Note'];

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">EndoTrack</a>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Journal'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="j-container">

        {/* Header */}
        <div className="j-header">
          <div>
            <p className="j-date">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
            <h1 className="j-title">How are you feeling?</h1>
          </div>
          <div className="j-streak">
            <span className="j-streak-num">3</span>
            <span className="j-streak-label">day streak</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="j-steps">
          <div className="j-step-line-bg" />
          <div className="j-step-line-fill" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((s, i) => (
            <div key={s} className="j-step-item">
              <div className={`j-step-circle ${step === i+1 ? 'j-step-active' : step > i+1 ? 'j-step-done' : ''}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className={`j-step-label ${step === i+1 ? 'j-step-label-active' : ''}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <div className="j-error">{error}</div>}

        {/* Step 1 — Pain */}
        {step === 1 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon">01</div>
              <div>
                <h2 className="j-card-title">Pain Level</h2>
                <p className="j-card-sub">Select your current pain intensity from 0 to 10</p>
              </div>
            </div>

            <div className="j-pain-display">
              <div className="j-pain-number" style={{ color: painColor }}>
                {pain === null ? '—' : pain}
              </div>
              <div className="j-pain-label" style={{ color: painColor }}>{painLabel}</div>
            </div>

            <div className="j-pain-buttons">
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => { setPain(n); setError(''); }}
                  className={`j-pain-btn ${pain === n ? 'j-pain-btn-active' : ''}`}
                  style={pain === n ? { background: painColor, borderColor: painColor } : {}}>
                  {n}
                </button>
              ))}
            </div>

            <div className="j-pain-scale">
              {[
                { range: '0–2', label: 'Mild',        color: '#4ade80', bg: '#f0fdf4' },
                { range: '3–5', label: 'Moderate',    color: '#fb923c', bg: '#fff7ed' },
                { range: '6–8', label: 'Severe',      color: '#f43f5e', bg: '#fff1f2' },
                { range: '9–10', label: 'Unbearable', color: '#be123c', bg: '#ffe4e6' },
              ].map(p => (
                <div key={p.label} className="j-pain-ref" style={{ background: p.bg }}>
                  <span className="j-pain-ref-range" style={{ color: p.color }}>{p.range}</span>
                  <span className="j-pain-ref-label">{p.label}</span>
                </div>
              ))}
            </div>

            <button className="j-next-btn" onClick={() => tryNext(1)}>Continue to Mood</button>
          </div>
        )}

        {/* Step 2 — Mood */}
        {step === 2 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon">02</div>
              <div>
                <h2 className="j-card-title">Mood</h2>
                <p className="j-card-sub">How are you feeling emotionally right now?</p>
              </div>
            </div>

            <div className="j-mood-grid">
              {MOODS.map((m, i) => (
                <button key={m} onClick={() => { setMood(i); setError(''); }}
                  className={`j-mood-btn ${mood === i ? 'j-mood-selected' : ''}`}>
                  {m}
                </button>
              ))}
            </div>

            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => { setStep(1); setError(''); }}>Back</button>
              <button className="j-next-btn" onClick={() => tryNext(2)}>Continue to Symptoms</button>
            </div>
          </div>
        )}

        {/* Step 3 — Symptoms */}
        {step === 3 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon">03</div>
              <div>
                <h2 className="j-card-title">Symptoms</h2>
                <p className="j-card-sub">Select all symptoms you are experiencing today</p>
              </div>
            </div>

            <div className="j-tag-grid">
              {SYMPTOMS.map(s => (
                <button key={s} onClick={() => { toggle(s, symptoms, setSymptoms); setError(''); }}
                  className={`j-tag ${symptoms.includes(s) ? 'j-tag-active' : ''}`}>{s}</button>
              ))}
            </div>

            <div className="j-selected-count">{symptoms.length} selected</div>

            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => { setStep(2); setError(''); }}>Back</button>
              <button className="j-skip-btn" onClick={() => { setSymptoms([]); setStep(4); setError(''); }}>Skip</button>
              <button className="j-next-btn" onClick={() => tryNext(3)}>Continue to Triggers</button>
            </div>
          </div>
        )}

        {/* Step 4 — Triggers */}
        {step === 4 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon">04</div>
              <div>
                <h2 className="j-card-title">Triggers</h2>
                <p className="j-card-sub">What do you think triggered your symptoms today?</p>
              </div>
            </div>

            <div className="j-tag-grid">
              {TRIGGERS.map(t => (
                <button key={t} onClick={() => { toggle(t, triggers, setTriggers); setError(''); }}
                  className={`j-tag ${triggers.includes(t) ? 'j-tag-active' : ''}`}>{t}</button>
              ))}
            </div>

            <div className="j-selected-count">{triggers.length} selected</div>

            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => { setStep(3); setError(''); }}>Back</button>
              <button className="j-skip-btn" onClick={() => { setTriggers([]); setStep(5); setError(''); }}>Skip</button>
              <button className="j-next-btn" onClick={() => tryNext(4)}>Continue to Note</button>
            </div>
          </div>
        )}

        {/* Step 5 — Note */}
        {step === 5 && (
          <div className="j-card j-animate">
            <div className="j-card-header">
              <div className="j-card-icon">05</div>
              <div>
                <h2 className="j-card-title">Your Note</h2>
                <p className="j-card-sub">Describe how you feel in your own words</p>
              </div>
            </div>

            <textarea className="j-textarea"
              placeholder='e.g. "Sharp pain during my period again. Doctor said it is normal but it keeps getting worse."'
              value={note} onChange={e => { setNote(e.target.value); setError(''); }} rows={5} />
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
                  <span className="j-summary-val">{mood !== null ? MOODS[mood] : '—'}</span>
                </div>
                <div className="j-summary-item">
                  <span className="j-summary-key">Symptoms</span>
                  <span className="j-summary-val">{symptoms.join(', ')}</span>
                </div>
                <div className="j-summary-item">
                  <span className="j-summary-key">Triggers</span>
                  <span className="j-summary-val">{triggers.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="j-nav-row">
              <button className="j-back-btn" onClick={() => { setStep(4); setError(''); }}>Back</button>
              <button className="j-submit-btn" onClick={handleSubmit}>Save Entry</button>
            </div>
          </div>
        )}

        {/* Toast */}
        {submitted && (
          <div className="j-toast">
            <div className="j-toast-title">Entry saved!</div>
            <div className="j-toast-sub">Your symptom log has been recorded.</div>
          </div>
        )}

        {/* Past entries */}
        <div>
          <h2 className="j-past-title">Recent Entries</h2>
          <div className="j-past-empty">
            <div className="j-past-empty-icon">No entries yet</div>
            <p>Start logging to see your history here.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
