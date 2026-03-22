'use client';
import './patterns.css';
import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Patterns() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [periodStart, setPeriodStart] = useState<string | null>(null);
  const [periodLength, setPeriodLength] = useState(5);
  const [cycleLength, setCycleLength]   = useState(28);
  const [loggedDays, setLoggedDays]     = useState<string[]>([]);
  const [hoveredDay, setHoveredDay]     = useState<number | null>(null);
  const [bunnyPos, setBunnyPos]         = useState<number | null>(null);
  const [showSetup, setShowSetup]       = useState(false);

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDaySlot = getFirstDayOfMonth(viewYear, viewMonth);

  // Build period ranges from start date
  const getPeriodDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    for (let i = 0; i < periodLength; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    return days;
  };

  // Build estimated future cycles
  const getEstimatedDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    for (let cycle = 1; cycle <= 3; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(start.getDate() + cycleLength * cycle);
      for (let i = 0; i < periodLength; i++) {
        const d = new Date(cycleStart);
        d.setDate(cycleStart.getDate() + i);
        days.add(d.toISOString().split('T')[0]);
      }
    }
    return days;
  };

  // Ovulation window (14 days before next period)
  const getOvulationDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    const ovStart = new Date(start);
    ovStart.setDate(start.getDate() + cycleLength - 16);
    for (let i = 0; i < 5; i++) {
      const d = new Date(ovStart);
      d.setDate(ovStart.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const periodDays    = getPeriodDays();
  const estimatedDays = getEstimatedDays();
  const ovulationDays = getOvulationDays();

  const toKey = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const toggleLog = (day: number) => {
    const key = toKey(day);
    setLoggedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Bunny animation: which day in the period range is it jumping to
  const getBunnyDay = (): number | null => {
    if (!periodStart) return null;
    const start = new Date(periodStart);
    const startMonth = start.getMonth();
    const startYear  = start.getFullYear();
    if (startMonth !== viewMonth || startYear !== viewYear) return null;
    // animate bunny to end of period
    return start.getDate() + periodLength - 1;
  };

  const bunnyEndDay = getBunnyDay();
  const periodStartDay = periodStart ? new Date(periodStart).getDate() : null;

  // Stats
  const totalLogged = loggedDays.length;
  const nextPeriod  = periodStart
    ? (() => {
        const s = new Date(periodStart);
        s.setDate(s.getDate() + cycleLength);
        return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      })()
    : '—';

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">🌸 EndoTrack</a>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l === 'Home' ? '' : l.toLowerCase()}`}
              className={`nav-link ${l === 'Patterns' ? 'nav-link-active' : ''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="p-container">

        {/* Header */}
        <div className="p-header">
          <div>
            <h1 className="p-title">Pattern Pulse 🐰</h1>
            <p className="p-sub">Track your cycle, spot patterns, predict what's next.</p>
          </div>
          <button className="p-setup-btn" onClick={() => setShowSetup(s => !s)}>
            ⚙️ Cycle Setup
          </button>
        </div>

        {/* Setup Panel */}
        {showSetup && (
          <div className="p-setup-card p-animate">
            <h2 className="p-setup-title">🌸 Cycle Settings</h2>
            <div className="p-setup-grid">
              <div className="p-setup-field">
                <label className="p-setup-label">Period Start Date</label>
                <input type="date" className="p-setup-input"
                  value={periodStart || ''}
                  onChange={e => setPeriodStart(e.target.value)} />
              </div>
              <div className="p-setup-field">
                <label className="p-setup-label">Period Length (days)</label>
                <div className="p-stepper">
                  <button onClick={() => setPeriodLength(l => Math.max(1, l - 1))}>−</button>
                  <span>{periodLength} days</span>
                  <button onClick={() => setPeriodLength(l => Math.min(10, l + 1))}>+</button>
                </div>
              </div>
              <div className="p-setup-field">
                <label className="p-setup-label">Cycle Length (days)</label>
                <div className="p-stepper">
                  <button onClick={() => setCycleLength(l => Math.max(20, l - 1))}>−</button>
                  <span>{cycleLength} days</span>
                  <button onClick={() => setCycleLength(l => Math.min(40, l + 1))}>+</button>
                </div>
              </div>
            </div>
            <button className="p-setup-save" onClick={() => setShowSetup(false)}>
              Save & Close ✓
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="p-stats">
          {[
            { icon: '🐰', label: 'Days Logged',   value: totalLogged },
            { icon: '📅', label: 'Next Period',    value: nextPeriod },
            { icon: '🔄', label: 'Cycle Length',   value: `${cycleLength}d` },
            { icon: '🌸', label: 'Period Length',  value: `${periodLength}d` },
          ].map(s => (
            <div key={s.label} className="p-stat-card">
              <span className="p-stat-icon">{s.icon}</span>
              <span className="p-stat-value">{s.value}</span>
              <span className="p-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="p-cal-card p-animate">

          {/* Month nav */}
          <div className="p-cal-nav">
            <button className="p-cal-arrow" onClick={prevMonth}>‹</button>
            <h2 className="p-cal-month">{MONTHS[viewMonth]} {viewYear}</h2>
            <button className="p-cal-arrow" onClick={nextMonth}>›</button>
          </div>

          {/* Day headers */}
          <div className="p-cal-grid">
            {DAYS.map(d => (
              <div key={d} className="p-cal-day-header">{d}</div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: firstDaySlot }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day  = i + 1;
              const key  = toKey(day);
              const isToday     = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isPeriod    = periodDays.has(key);
              const isEstimated = estimatedDays.has(key);
              const isOvulation = ovulationDays.has(key);
              const isLogged    = loggedDays.includes(key);
              const isBunnyStart = periodStartDay === day;
              const isBunnyEnd   = bunnyEndDay === day;
              const isHovered    = hoveredDay === day;

              return (
                <div key={day}
                  className={[
                    'p-cal-day',
                    isToday     ? 'p-day-today'     : '',
                    isPeriod    ? 'p-day-period'    : '',
                    isEstimated ? 'p-day-estimated' : '',
                    isOvulation ? 'p-day-ovulation' : '',
                    isLogged    ? 'p-day-logged'    : '',
                    isHovered   ? 'p-day-hovered'   : '',
                  ].join(' ')}
                  onClick={() => toggleLog(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className="p-day-num">{day}</span>

                  {/* Bunny on period start */}
                  {isBunnyStart && (
                    <span className="p-bunny p-bunny-start" title="Period starts">🐰</span>
                  )}

                  {/* Jumping bunny on period end */}
                  {isBunnyEnd && bunnyEndDay !== periodStartDay && (
                    <span className="p-bunny p-bunny-jump" title="Estimated end">🐇</span>
                  )}

                  {/* Logged checkmark bunny */}
                  {isLogged && !isBunnyStart && (
                    <span className="p-bunny-check">🐰</span>
                  )}

                  {/* Ovulation flower */}
                  {isOvulation && !isPeriod && (
                    <span className="p-ov-dot" title="Ovulation window">🌸</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-legend">
            {[
              { color: '#fce4ec', border: '#e91e8c', label: 'Period' },
              { color: '#ffeef8', border: '#f9a8d4', label: 'Estimated' },
              { color: '#fef9c3', border: '#fbbf24', label: 'Ovulation' },
              { color: '#f0fdf4', border: '#4ade80', label: 'Logged' },
            ].map(l => (
              <div key={l.label} className="p-legend-item">
                <div className="p-legend-dot" style={{ background: l.color, border: `1.5px solid ${l.border}` }} />
                <span>{l.label}</span>
              </div>
            ))}
            <div className="p-legend-item"><span>🐰</span><span>Logged day</span></div>
            <div className="p-legend-item"><span>🐇</span><span>Period end</span></div>
            <div className="p-legend-item"><span>🌸</span><span>Ovulation</span></div>
          </div>
        </div>

        {/* Pattern Pulse Wave */}
        <div className="p-wave-card">
          <h2 className="p-wave-title">📊 Pain Intensity Wave</h2>
          <p className="p-wave-sub">Log entries to see your pattern pulse build over time</p>
          <div className="p-wave">
            {[2,4,7,5,8,3,6,9,4,7,5,8,3,6,2,5,8,6,9,4,7,3,5,8,4,6,9,5,7,3].map((h, i) => (
              <div key={i} className="p-wave-bar"
                style={{ height: `${h * 8}px`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
          <div className="p-wave-labels">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="p-insights">
          <h2 className="p-insights-title">🔍 Cycle Insights</h2>
          <div className="p-insights-grid">
            {[
              { icon: '🐰', title: 'Bunny Trail Active', desc: periodStart ? `Your period started ${new Date(periodStart).toLocaleDateString('en-US',{month:'short',day:'numeric'})}. Estimated end in ${periodLength} days.` : 'Set your period start date to activate the bunny trail.', color: '#fff0f3', border: '#fce4ec' },
              { icon: '📅', title: 'Next Cycle', desc: periodStart ? `Your next period is estimated around ${nextPeriod}. Your cycle is ${cycleLength} days.` : 'Add your cycle data to see predictions.', color: '#fdf4ff', border: '#f5d0fe' },
              { icon: '🌸', title: 'Ovulation Window', desc: periodStart ? `Your ovulation window is approximately 14 days before your next period.` : 'Set your period start to calculate ovulation.', color: '#fefce8', border: '#fef08a' },
            ].map(c => (
              <div key={c.title} className="p-insight-card" style={{ background: c.color, border: `1px solid ${c.border}` }}>
                <span className="p-insight-icon">{c.icon}</span>
                <div className="p-insight-title">{c.title}</div>
                <div className="p-insight-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
