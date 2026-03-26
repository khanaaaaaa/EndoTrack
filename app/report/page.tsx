'use client';
import './report.css';
import { useState } from 'react';

const SAMPLE_ENTRIES = [
  { date: 'Mar 15, 2025', pain: 8, mood: 'Frustrated', symptoms: ['Cramping', 'Bloating', 'Back Pain'], triggers: ['Period'], note: 'Sharp pain during my period again. Doctor said it\'s normal but it\'s getting worse every month.' },
  { date: 'Mar 12, 2025', pain: 5, mood: 'Anxious',    symptoms: ['Fatigue', 'Headache'],               triggers: ['Stress'], note: 'Exhausted all day. Hard to focus at work.' },
  { date: 'Mar 8, 2025',  pain: 9, mood: 'Very Low',   symptoms: ['Stabbing Pain', 'Nausea', 'Bloating'], triggers: ['Period'], note: 'Worst pain this month. Had to leave work early. This is not normal.' },
  { date: 'Feb 18, 2025', pain: 7, mood: 'Frustrated', symptoms: ['Cramping', 'Pressure'],              triggers: ['Period'], note: 'Period started again. Same pain as last month. Told it\'s just cramps.' },
  { date: 'Feb 10, 2025', pain: 4, mood: 'Neutral',    symptoms: ['Bloating', 'Fatigue'],               triggers: ['Food'],   note: 'Bloating after eating. Uncomfortable all evening.' },
  { date: 'Jan 20, 2025', pain: 8, mood: 'Very Low',   symptoms: ['Cramping', 'Back Pain', 'Nausea'],   triggers: ['Period'], note: 'Period pain unbearable. Took 4 painkillers and still didn\'t help.' },
];

const PAIN_COLOR = (p: number) => p <= 3 ? '#4ade80' : p <= 6 ? '#fb923c' : '#f43f5e';

export default function Report() {
  const avgPain     = Math.round(SAMPLE_ENTRIES.reduce((a, e) => a + e.pain, 0) / SAMPLE_ENTRIES.length * 10) / 10;
  const highPain    = SAMPLE_ENTRIES.filter(e => e.pain >= 7).length;
  const allSymptoms = [...new Set(SAMPLE_ENTRIES.flatMap(e => e.symptoms))];
  const allTriggers = [...new Set(SAMPLE_ENTRIES.flatMap(e => e.triggers))];

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

        {/* Header */}
        <div className="r-header">
          <h1 className="r-title">Doctor Report</h1>
          <p className="r-sub">A summary of your logged symptoms to bring to your appointment.</p>
        </div>

        {/* Stats */}
        <div className="r-stats">
          {[
            { label: 'Total Entries',      value: SAMPLE_ENTRIES.length, color: '#e91e8c', bg: '#fff0f3' },
            { label: 'Avg Pain Score',     value: `${avgPain}/10`,       color: '#f43f5e', bg: '#fff1f2' },
            { label: 'High Pain Episodes', value: highPain,              color: '#c2410c', bg: '#fff7ed' },
            { label: 'Symptoms Tracked',   value: allSymptoms.length,    color: '#7c3aed', bg: '#f5f3ff' },
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
            {SAMPLE_ENTRIES.slice().reverse().map((e, i) => (
              <div key={i} className="r-chart-col">
                <div className="r-chart-bar-wrap">
                  <div className="r-chart-bar"
                    style={{ height: `${e.pain * 10}%`, background: PAIN_COLOR(e.pain), animationDelay: `${i * 0.08}s` }} />
                </div>
                <div className="r-chart-label">{e.date.split(',')[0].split(' ')[1]}</div>
                <div className="r-chart-month">{e.date.split(' ')[0]}</div>
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
        <div className="r-card r-animate">
          <h2 className="r-card-title">Symptom Frequency</h2>
          <p className="r-card-sub" style={{ marginBottom: '1.25rem' }}>How often each symptom appeared</p>
          <div className="r-symptom-bars">
            {allSymptoms.map(sym => {
              const count = SAMPLE_ENTRIES.filter(e => e.symptoms.includes(sym)).length;
              const pct   = Math.round((count / SAMPLE_ENTRIES.length) * 100);
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

        {/* Full Log */}
        <div className="r-card r-animate">
          <h2 className="r-card-title">Full Symptom Log</h2>
          <p className="r-card-sub" style={{ marginBottom: '1.25rem' }}>{SAMPLE_ENTRIES.length} entries — most recent first</p>
          <div className="r-entries">
            {SAMPLE_ENTRIES.map((e, i) => (
              <div key={i} className="r-entry">
                <div className="r-entry-left">
                  <div className="r-entry-pain" style={{ background: PAIN_COLOR(e.pain) }}>{e.pain}</div>
                  <div className="r-entry-line" />
                </div>
                <div className="r-entry-body">
                  <div className="r-entry-top">
                    <span className="r-entry-date">{e.date}</span>
                    <span className="r-entry-mood">{e.mood}</span>
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

        {/* Disclaimer */}
        <div className="r-disclaimer">
          <p>This report supports conversations with your healthcare provider. It does not replace medical advice. Always consult a qualified medical professional.</p>
        </div>

      </div>
    </div>
  );
}
