'use client';
import './insights.css';
import { useState, useEffect } from 'react';

type Entry = { date: string; pain: number | null; mood: string | null; symptoms: string[]; triggers: string[]; note: string };
type Insight = { id: number; type: string; severity: string; title: string; summary: string; detail: string; action: string; count: number };

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

function deriveInsights(entries: Entry[]): Insight[] {
  if (entries.length === 0) return [];
  const insights: Insight[] = [];
  let id = 1;

  // Escalating pain: compare avg of first half vs second half
  const withPain = entries.filter(e => e.pain !== null);
  if (withPain.length >= 4) {
    const half = Math.floor(withPain.length / 2);
    const older = withPain.slice(half);
    const newer = withPain.slice(0, half);
    const avgOld = older.reduce((s, e) => s + (e.pain ?? 0), 0) / older.length;
    const avgNew = newer.reduce((s, e) => s + (e.pain ?? 0), 0) / newer.length;
    if (avgNew - avgOld >= 1.5) {
      insights.push({ id: id++, type: 'escalating', severity: 'high', title: 'Escalating Pain Intensity',
        summary: `Your average pain score has risen from ${avgOld.toFixed(1)} to ${avgNew.toFixed(1)} across your recent entries.`,
        detail: 'A consistent upward trend in pain intensity is a significant pattern. Pain that worsens over time, especially around your cycle, is not something to ignore.',
        action: 'Track your pain daily and bring this chart to your next appointment.', count: newer.length });
    }
  }

  // Recurring symptoms: any symptom appearing in >40% of entries
  const symCount: Record<string, number> = {};
  entries.forEach(e => e.symptoms.forEach(s => { symCount[s] = (symCount[s] || 0) + 1; }));
  Object.entries(symCount).forEach(([sym, count]) => {
    if (count / entries.length >= 0.4 && count >= 3) {
      insights.push({ id: id++, type: 'recurring', severity: 'medium', title: `Recurring Symptom: ${sym}`,
        summary: `"${sym}" has appeared in ${count} of your ${entries.length} entries.`,
        detail: `Frequently recurring symptoms like "${sym}" may indicate an underlying pattern worth discussing with your doctor.`,
        action: `Note when "${sym}" occurs relative to your cycle and bring this to your next appointment.`, count });
    }
  });

  // Recurring triggers: any trigger appearing in >40% of entries
  const trigCount: Record<string, number> = {};
  entries.forEach(e => e.triggers.forEach(t => { trigCount[t] = (trigCount[t] || 0) + 1; }));
  Object.entries(trigCount).forEach(([trig, count]) => {
    if (count / entries.length >= 0.4 && count >= 3) {
      insights.push({ id: id++, type: 'cycle', severity: 'medium', title: `Recurring Trigger: ${trig}`,
        summary: `"${trig}" has been logged as a trigger ${count} times across your entries.`,
        detail: `Repeated association with "${trig}" as a trigger suggests a consistent pattern that may be worth investigating.`,
        action: `Keep tracking when "${trig}" occurs and discuss the pattern with your doctor.`, count });
    }
  });

  // Emotional distress: frustrated or anxious mood in >50% of entries
  const distressCount = entries.filter(e => e.mood === 'Frustrated' || e.mood === 'Anxious' || e.mood === 'Very Low' || e.mood === 'Low').length;
  if (distressCount >= 3 && distressCount / entries.length >= 0.5) {
    insights.push({ id: id++, type: 'emotional', severity: 'low', title: 'Emotional Distress Pattern',
      summary: `Low or distressed mood logged in ${distressCount} of your ${entries.length} entries.`,
      detail: 'Chronic pain has a significant impact on mental health. Emotional distress is a valid and important part of your health picture.',
      action: 'Consider speaking with a counselor who specializes in chronic illness.', count: distressCount });
  }

  // Dismissed symptoms: note contains dismissal language
  const dismissedKeywords = ["normal", "it's fine", "nothing wrong", "doctor said", "they said", "told me"];
  const dismissedCount = entries.filter(e => dismissedKeywords.some(k => e.note.toLowerCase().includes(k))).length;
  if (dismissedCount >= 2) {
    insights.push({ id: id++, type: 'dismissed', severity: 'high', title: 'Repeatedly Dismissed Symptoms',
      summary: `Your notes suggest your symptoms may have been dismissed ${dismissedCount} times.`,
      detail: 'Endometriosis takes an average of 7–10 years to diagnose, often because symptoms are normalized by medical professionals. You deserve to be heard.',
      action: 'Request a referral to a gynecologist or endometriosis specialist.', count: dismissedCount });
  }

  return insights;
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [entryCount, setEntryCount] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const entries: Entry[] = JSON.parse(localStorage.getItem('endo_entries') || '[]');
    setEntryCount(entries.length);
    setInsights(deriveInsights(entries));
  }, []);

  const filtered = filter === 'all' ? insights : insights.filter(i => i.severity === filter);
  const highCount = insights.filter(i => i.severity === 'high').length;

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
            <p className="i-sub">Patterns your symptoms are telling you, that should not be ignored.</p>
          </div>
        </div>

        {entryCount === 0 ? (
          <div className="i-empty">
            <div className="i-empty-icon">📋</div>
            <h2 className="i-empty-title">No insights yet</h2>
            <p className="i-empty-text">Start logging your symptoms in the Journal and your patterns will appear here automatically.</p>
            <a href="/journal" className="btn-primary">+ Log your first entry</a>
          </div>
        ) : (
          <>
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
                { label: 'Entries Logged',  value: entryCount,                                              color: '#e91e8c', bg: '#fff0f3' },
                { label: 'Total Patterns',  value: insights.length,                                         color: '#e91e8c', bg: '#fff0f3' },
                { label: 'High Priority',   value: insights.filter(i=>i.severity==='high').length,   color: '#be123c', bg: '#fff1f2' },
                { label: 'Medium Priority', value: insights.filter(i=>i.severity==='medium').length, color: '#b45309', bg: '#fffbeb' },
              ].map(s => (
                <div key={s.label} className="i-stat-card" style={{ background: s.bg }}>
                  <div className="i-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="i-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {insights.length === 0 ? (
              <div className="i-empty">
                <h2 className="i-empty-title">No patterns detected yet</h2>
                <p className="i-empty-text">Keep logging, patterns emerge after a few consistent entries.</p>
              </div>
            ) : (
              <>
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
                              <span>Occurred {insight.count} times</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="i-validation">
              <h2 className="i-validation-title">You know your body best.</h2>
              <p className="i-validation-text">These insights are here to help you advocate for yourself. If something feels wrong, it deserves to be taken seriously by you and by your doctor.</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
