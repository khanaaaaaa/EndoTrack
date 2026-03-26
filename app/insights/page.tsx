'use client';
import './insights.css';
import { useState } from 'react';

const SAMPLE_INSIGHTS = [
  { id: 1, type: 'dismissed', severity: 'high', title: 'Repeatedly Dismissed Symptoms', summary: 'You have logged "doctor said it\'s normal" 4 times in the past 3 months.', detail: 'Symptoms that are repeatedly dismissed but persist may indicate an underlying condition. Endometriosis takes an average of 7–10 years to diagnose, often because symptoms are normalized by medical professionals.', action: 'Request a referral to a gynecologist or endometriosis specialist.', date: 'Last 3 months', count: 4 },
  { id: 2, type: 'escalating', severity: 'high', title: 'Escalating Pain Intensity', summary: 'Your average pain score has increased from 4.2 to 7.8 over 6 weeks.', detail: 'A consistent upward trend in pain intensity is a significant pattern. Pain that worsens over time, especially around your cycle, is not something to ignore.', action: 'Track your pain daily and bring this chart to your next appointment.', date: 'Last 6 weeks', count: 6 },
  { id: 3, type: 'cycle', severity: 'medium', title: '28-Day Recurring Pain Cycle', summary: 'Sharp pain has occurred on a ~28-day cycle for the past 3 months.', detail: 'Cyclical pain that aligns with your menstrual cycle is a hallmark symptom of endometriosis and adenomyosis. This pattern is medically significant.', action: 'Note the exact days pain peaks and share with your doctor.', date: 'Last 3 months', count: 3 },
  { id: 4, type: 'recurring', severity: 'medium', title: 'Recurring Trigger: Period', summary: 'Pain linked to your period has been logged 8 times in 2 months.', detail: 'While some discomfort during menstruation is common, severe or debilitating pain is not normal and should be evaluated.', action: 'Keep a detailed log of pain timing relative to your cycle start.', date: 'Last 2 months', count: 8 },
  { id: 5, type: 'emotional', severity: 'low', title: 'Emotional Distress Pattern', summary: 'Frustrated or anxious mood logged on 6 of your last 10 entries.', detail: 'Chronic pain has a significant impact on mental health. Emotional distress is a valid and important part of your health picture.', action: 'Consider speaking with a counselor who specializes in chronic illness.', date: 'Last 10 entries', count: 6 },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  dismissed: { color: '#be123c', bg: '#fff1f2', border: '#fecdd3', label: 'Dismissed' },
  escalating: { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa', label: 'Escalating' },
  cycle:      { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'Cycle' },
  recurring:  { color: '#b45309', bg: '#fffbeb', border: '#fde68a', label: 'Recurring' },
  emotional:  { color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', label: 'Emotional' },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  high:   { label: 'High Priority',   color: '#be123c', bg: '#fff1f2' },
  medium: { label: 'Medium Priority', color: '#b45309', bg: '#fffbeb' },
  low:    { label: 'Low Priority',    color: '#0369a1', bg: '#f0f9ff' },
};

export default function Insights() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? SAMPLE_INSIGHTS : SAMPLE_INSIGHTS.filter(i => i.severity === filter);
  const highCount = SAMPLE_INSIGHTS.filter(i => i.severity === 'high').length;

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">EndoTrack</a>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Insights'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="i-container">

        <div className="i-header">
          <div>
            <h1 className="i-title">Second Look Insights</h1>
            <p className="i-sub">Patterns your symptoms are telling you — that should not be ignored.</p>
          </div>
        </div>

        {highCount > 0 && (
          <div className="i-alert i-animate">
            <div className="i-alert-left">
              <div className="i-alert-pulse"><div className="i-alert-dot" /></div>
              <div>
                <div className="i-alert-title">This may NOT be typical.</div>
                <div className="i-alert-desc">{highCount} high-priority pattern{highCount > 1 ? 's' : ''} detected. These symptoms have been flagged as potentially significant and warrant medical evaluation.</div>
              </div>
            </div>
          </div>
        )}

        <div className="i-stats">
          {[
            { label: 'Total Patterns',  value: SAMPLE_INSIGHTS.length, color: '#e91e8c', bg: '#fff0f3' },
            { label: 'High Priority',   value: SAMPLE_INSIGHTS.filter(i=>i.severity==='high').length,   color: '#be123c', bg: '#fff1f2' },
            { label: 'Medium Priority', value: SAMPLE_INSIGHTS.filter(i=>i.severity==='medium').length, color: '#b45309', bg: '#fffbeb' },
            { label: 'Low Priority',    value: SAMPLE_INSIGHTS.filter(i=>i.severity==='low').length,    color: '#0369a1', bg: '#f0f9ff' },
          ].map(s => (
            <div key={s.label} className="i-stat-card" style={{ background: s.bg }}>
              <div className="i-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="i-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="i-filters">
          {['all','high','medium','low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`i-filter-btn ${filter === f ? 'i-filter-active' : ''}`}>
              {f === 'all' ? 'All Insights' : SEVERITY_CONFIG[f].label}
            </button>
          ))}
        </div>

        <div className="i-cards">
          {filtered.map((insight, idx) => {
            const cfg  = TYPE_CONFIG[insight.type];
            const scfg = SEVERITY_CONFIG[insight.severity];
            const isOpen = expanded === insight.id;
            return (
              <div key={insight.id} className="i-card i-animate"
                style={{ animationDelay: `${idx * 0.07}s`, borderColor: cfg.border }}>
                <div className="i-card-top" onClick={() => setExpanded(isOpen ? null : insight.id)}>
                  <div className="i-card-left">
                    <div className="i-card-icon" style={{ background: cfg.bg, color: cfg.color }}>
                      {insight.count}x
                    </div>
                    <div>
                      <div className="i-card-badges">
                        <span className="i-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        <span className="i-badge" style={{ background: scfg.bg, color: scfg.color }}>{scfg.label}</span>
                      </div>
                      <h3 className="i-card-title">{insight.title}</h3>
                      <p className="i-card-summary">{insight.summary}</p>
                    </div>
                  </div>
                  <div className={`i-chevron ${isOpen ? 'i-chevron-open' : ''}`}>›</div>
                </div>
                {isOpen && (
                  <div className="i-card-detail i-animate">
                    <div className="i-detail-divider" style={{ background: cfg.border }} />
                    <div className="i-detail-section">
                      <div className="i-detail-label">What this means</div>
                      <p className="i-detail-text">{insight.detail}</p>
                    </div>
                    <div className="i-detail-action" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <div>
                        <div className="i-detail-action-label">Recommended Action</div>
                        <div className="i-detail-action-text">{insight.action}</div>
                      </div>
                    </div>
                    <div className="i-detail-meta">
                      <span>{insight.date}</span>
                      <span>Occurred {insight.count} times</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="i-validation">
          <h2 className="i-validation-title">You know your body best.</h2>
          <p className="i-validation-text">These insights are here to help you advocate for yourself. If something feels wrong, it deserves to be taken seriously — by you and by your doctor.</p>
        </div>

      </div>
    </div>
  );
}
