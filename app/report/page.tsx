'use client';
import './report.css';
import { useState, useEffect } from 'react';

type Entry = { date: string; pain: number | null; mood: string | null; symptoms: string[]; triggers: string[]; note: string };

const PAIN_COLOR = (p: number) => p <= 3 ? '#4ade80' : p <= 6 ? '#fb923c' : '#f43f5e';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Report() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem('endo_entries') || '[]'));
  }, []);

  const withPain    = entries.filter(e => e.pain !== null);
  const avgPain     = withPain.length ? Math.round(withPain.reduce((a, e) => a + (e.pain ?? 0), 0) / withPain.length * 10) / 10 : 0;
  const highPain    = withPain.filter(e => (e.pain ?? 0) >= 7).length;
  const allSymptoms = [...new Set(entries.flatMap(e => e.symptoms))];

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">EndoTrack</a>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Report'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="r-container">

        <div className="r-header">
          <h1 className="r-title">Doctor Report</h1>
          <p className="r-sub">A summary of your logged symptoms to bring to your appointment.</p>
        </div>

        {entries.length === 0 ? (
          <div className="r-empty">
            <div className="r-empty-icon">📋</div>
            <h2 className="r-empty-title">No entries yet</h2>
            <p className="r-empty-text">Start logging your symptoms in the Journal and your report will build automatically.</p>
            <a href="/journal" className="btn-primary">+ Log your first entry</a>
          </div>
        ) : (
          <>
            <div className="r-stats">
              {[
                { label: 'Total Entries',      value: entries.length,      color: '#e91e8c', bg: '#fff0f3' },
                { label: 'Avg Pain Score',     value: `${avgPain}/10`,     color: '#f43f5e', bg: '#fff1f2' },
                { label: 'High Pain Episodes', value: highPain,            color: '#c2410c', bg: '#fff7ed' },
                { label: 'Symptoms Tracked',   value: allSymptoms.length,  color: '#7c3aed', bg: '#f5f3ff' },
              ].map(s => (
                <div key={s.label} className="r-stat-card" style={{ background: s.bg }}>
                  <div className="r-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="r-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pain Timeline */}
            <div className="r-card r-animate">
              <h2 className="r-card-title">Pain Timeline</h2>
              <p className="r-card-sub" style={{ marginBottom: '1.5rem' }}>Pain intensity across your logged entries</p>
              <div className="r-timeline-chart">
                {[...entries].reverse().map((e, i) => (
                  <div key={i} className="r-chart-col">
                    <div className="r-chart-bar-wrap">
                      <div className="r-chart-bar"
                        style={{ height: `${(e.pain ?? 0) * 10}%`, background: PAIN_COLOR(e.pain ?? 0), animationDelay: `${i * 0.08}s` }} />
                    </div>
                    <div className="r-chart-label">{new Date(e.date).getDate()}</div>
                    <div className="r-chart-month">{new Date(e.date).toLocaleDateString('en-US',{month:'short'})}</div>
                  </div>
                ))}
              </div>
              <div className="r-chart-legend">
                {[{c:'#4ade80',l:'Mild (0–3)'},{c:'#fb923c',l:'Moderate (4–6)'},{c:'#f43f5e',l:'Severe (7–10)'}].map(l => (
                  <div key={l.l} className="r-legend-item">
                    <div className="r-legend-dot" style={{ background: l.c }} />
                    <span>{l.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptom Frequency */}
            {allSymptoms.length > 0 && (
              <div className="r-card r-animate">
                <h2 className="r-card-title">Symptom Frequency</h2>
                <p className="r-card-sub" style={{ marginBottom: '1.25rem' }}>How often each symptom appeared</p>
                <div className="r-symptom-bars">
                  {allSymptoms.map(sym => {
                    const count = entries.filter(e => e.symptoms.includes(sym)).length;
                    const pct   = Math.round((count / entries.length) * 100);
                    return (
                      <div key={sym} className="r-sym-row">
                        <span className="r-sym-name">{sym}</span>
                        <div className="r-sym-track">
                          <div className="r-sym-fill" style={{ width: `${pct}%`, animationDelay: `${allSymptoms.indexOf(sym) * 0.06}s` }} />
                        </div>
                        <span className="r-sym-count">{count}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full Log */}
            <div className="r-card r-animate">
              <h2 className="r-card-title">Full Symptom Log</h2>
              <p className="r-card-sub" style={{ marginBottom: '1.25rem' }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'} — most recent first</p>
              <div className="r-entries">
                {entries.map((e, i) => (
                  <div key={i} className="r-entry">
                    <div className="r-entry-left">
                      <div className="r-entry-pain" style={{ background: PAIN_COLOR(e.pain ?? 0) }}>{e.pain ?? '—'}</div>
                      <div className="r-entry-line" />
                    </div>
                    <div className="r-entry-body">
                      <div className="r-entry-top">
                        <span className="r-entry-date">{formatDate(e.date)}</span>
                        {e.mood && <span className="r-entry-mood">{e.mood}</span>}
                      </div>
                      <div className="r-entry-tags">
                        {e.symptoms.map(s => <span key={s} className="r-tag r-tag-symptom">{s}</span>)}
                        {e.triggers.map(t => <span key={t} className="r-tag r-tag-trigger">{t}</span>)}
                      </div>
                      {e.note && <p className="r-entry-note">&quot;{e.note}&quot;</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="r-disclaimer">
              <p>This report supports conversations with your healthcare provider. It does not replace medical advice. Always consult a qualified medical professional.</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
