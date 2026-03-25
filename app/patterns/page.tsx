'use client';
import './patterns.css';
import { useState } from 'react';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(y: number, m: number)  { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

function BunnySVG({ className }: { className: string }) {
  return (
    <div className={`bunny-wrap ${className}`}>
      <svg className="bunny-svg" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ear left */}
        <ellipse className="bunny-ear-left" cx="9" cy="7" rx="3" ry="6" fill="#f9a8d4" stroke="#e91e8c" strokeWidth="1"/>
        <ellipse className="bunny-ear-left" cx="9" cy="7" rx="1.5" ry="4" fill="#fce4ec"/>
        {/* Ear right */}
        <ellipse className="bunny-ear-right" cx="19" cy="7" rx="3" ry="6" fill="#f9a8d4" stroke="#e91e8c" strokeWidth="1"/>
        <ellipse className="bunny-ear-right" cx="19" cy="7" rx="1.5" ry="4" fill="#fce4ec"/>
        {/* Body */}
        <ellipse className="bunny-body" cx="14" cy="20" rx="7" ry="6" fill="#fce4ec" stroke="#e91e8c" strokeWidth="1"/>
        {/* Head */}
        <circle className="bunny-body" cx="14" cy="13" r="5" fill="#fce4ec" stroke="#e91e8c" strokeWidth="1"/>
        {/* Eyes */}
        <circle cx="12" cy="12" r="1" fill="#e91e8c"/>
        <circle cx="16" cy="12" r="1" fill="#e91e8c"/>
        {/* Nose */}
        <ellipse cx="14" cy="14" rx="1" ry="0.6" fill="#f9a8d4"/>
        {/* Tail */}
        <circle cx="21" cy="22" r="2" fill="white" stroke="#f9a8d4" strokeWidth="0.8"/>
      </svg>
    </div>
  );
}

function FlowerSVG() {
  return (
    <svg className="ov-flower" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0,45,90,135].map(angle => (
        <ellipse key={angle} cx="7" cy="7" rx="2.5" ry="4.5"
          fill="#fbbf24" opacity="0.8"
          transform={`rotate(${angle} 7 7)`}/>
      ))}
      <circle cx="7" cy="7" r="2.5" fill="#f59e0b"/>
    </svg>
  );
}

export default function Patterns() {
  const today = new Date();
  const [viewMonth, setViewMonth]       = useState(today.getMonth());
  const [viewYear, setViewYear]         = useState(today.getFullYear());
  const [periodStart, setPeriodStartRaw]   = useState<string | null>(() => typeof window !== 'undefined' ? localStorage.getItem('endo_period_start') : null);
  const [periodLength, setPeriodLengthRaw] = useState<number>(() => typeof window !== 'undefined' ? Number(localStorage.getItem('endo_period_len') || 5) : 5);
  const [cycleLength, setCycleLengthRaw]   = useState<number>(() => typeof window !== 'undefined' ? Number(localStorage.getItem('endo_cycle_len') || 28) : 28);
  const [loggedDays, setLoggedDaysRaw]     = useState<string[]>(() => { try { return JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('endo_logged') || '[]' : '[]'); } catch { return []; } });
  const [hoveredDay, setHoveredDay]     = useState<number | null>(null);
  const [showSetup, setShowSetup]       = useState(false);
  const [pickingStart, setPickingStart] = useState(false);

  const setPeriodStart = (v: string | null) => { setPeriodStartRaw(v); if (v) localStorage.setItem('endo_period_start', v); else localStorage.removeItem('endo_period_start'); };
  const setPeriodLength = (fn: (n: number) => number) => { setPeriodLengthRaw(prev => { const next = fn(prev); localStorage.setItem('endo_period_len', String(next)); return next; }); };
  const setCycleLength  = (fn: (n: number) => number) => { setCycleLengthRaw(prev => { const next = fn(prev); localStorage.setItem('endo_cycle_len', String(next)); return next; }); };
  const setLoggedDays   = (fn: (prev: string[]) => string[]) => { setLoggedDaysRaw(prev => { const next = fn(prev); localStorage.setItem('endo_logged', JSON.stringify(next)); return next; }); };

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDaySlot = getFirstDayOfMonth(viewYear, viewMonth);

  const getPeriodDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    for (let i = 0; i < periodLength; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const getEstimatedDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    for (let c = 1; c <= 3; c++) {
      const cs = new Date(start); cs.setDate(start.getDate() + cycleLength * c);
      for (let i = 0; i < periodLength; i++) {
        const d = new Date(cs); d.setDate(cs.getDate() + i);
        days.add(d.toISOString().split('T')[0]);
      }
    }
    return days;
  };

  const getOvulationDays = (): Set<string> => {
    const days = new Set<string>();
    if (!periodStart) return days;
    const start = new Date(periodStart);
    const ov = new Date(start); ov.setDate(start.getDate() + cycleLength - 16);
    for (let i = 0; i < 5; i++) {
      const d = new Date(ov); d.setDate(ov.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const periodDays    = getPeriodDays();
  const estimatedDays = getEstimatedDays();
  const ovulationDays = getOvulationDays();

  const toKey = (day: number) =>
    `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const handleDayClick = (day: number) => {
    if (pickingStart) {
      setPeriodStart(toKey(day));
      setPickingStart(false);
      return;
    }
    const key = toKey(day);
    setLoggedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };

  const prevMonth = () => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };

  const getBunnyEndDay = (): number | null => {
    if (!periodStart) return null;
    const s = new Date(periodStart);
    if (s.getMonth() !== viewMonth || s.getFullYear() !== viewYear) return null;
    return s.getDate() + periodLength - 1;
  };

  const bunnyEndDay    = getBunnyEndDay();
  const periodStartDay = periodStart ? (() => { const s = new Date(periodStart); return s.getMonth() === viewMonth && s.getFullYear() === viewYear ? s.getDate() : null; })() : null;
  const totalLogged    = loggedDays.length;
  const nextPeriod     = periodStart
    ? (() => { const s = new Date(periodStart); s.setDate(s.getDate()+cycleLength); return s.toLocaleDateString('en-US',{month:'short',day:'numeric'}); })()
    : '—';

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">EndoTrack</a>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Patterns'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="p-container">

        <div className="p-header">
          <div>
            <h1 className="p-title">Pattern Pulse</h1>
            <p className="p-sub">Track your cycle, spot patterns, predict what&apos;s next.</p>
          </div>
          <button className="p-setup-btn" onClick={() => { setShowSetup(s => !s); setPickingStart(false); }}>Cycle Setup</button>
        </div>

        {/* Period start picker banner */}
        {pickingStart && (
          <div className="p-pick-banner p-animate">
            Tap any day on the calendar to set your period start date.
            <button onClick={() => setPickingStart(false)}>Cancel</button>
          </div>
        )}

        {showSetup && (
          <div className="p-setup-card p-animate">
            <h2 className="p-setup-title">Cycle Settings</h2>

            {/* Period start — tap on calendar */}
            <div className="p-setup-field" style={{ marginBottom: '1.25rem' }}>
              <label className="p-setup-label">Period Start Date</label>
              <div className="p-start-row">
                <div className="p-start-display">
                  {periodStart
                    ? new Date(periodStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Not set'}
                </div>
                <button className="p-start-btn" onClick={() => { setPickingStart(true); setShowSetup(false); }}>
                  {periodStart ? 'Change on calendar' : 'Tap a day on calendar'}
                </button>
                {periodStart && (
                  <button className="p-start-clear" onClick={() => setPeriodStart(null)}>Clear</button>
                )}
              </div>
            </div>

            <div className="p-setup-grid">
              <div className="p-setup-field">
                <label className="p-setup-label">Period Length</label>
                <div className="p-stepper">
                  <button onClick={() => setPeriodLength(l => Math.max(1,l-1))}>−</button>
                  <span>{periodLength} days</span>
                  <button onClick={() => setPeriodLength(l => Math.min(10,l+1))}>+</button>
                </div>
              </div>
              <div className="p-setup-field">
                <label className="p-setup-label">Cycle Length</label>
                <div className="p-stepper">
                  <button onClick={() => setCycleLength(l => Math.max(20,l-1))}>−</button>
                  <span>{cycleLength} days</span>
                  <button onClick={() => setCycleLength(l => Math.min(40,l+1))}>+</button>
                </div>
              </div>
            </div>
            <button className="p-setup-save" onClick={() => setShowSetup(false)}>Save & Close</button>
          </div>
        )}

        <div className="p-stats">
          {[
            { label: 'Days Logged',  value: totalLogged },
            { label: 'Next Period',   value: nextPeriod },
            { label: 'Cycle Length',  value: `${cycleLength}d` },
            { label: 'Period Length', value: `${periodLength}d` },
          ].map(s => (
            <div key={s.label} className="p-stat-card">
              <span className="p-stat-value">{s.value}</span>
              <span className="p-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="p-cal-card p-animate">
          <div className="p-cal-nav">
            <button className="p-cal-arrow" onClick={prevMonth}>‹</button>
            <h2 className="p-cal-month">{MONTHS[viewMonth]} {viewYear}</h2>
            <button className="p-cal-arrow" onClick={nextMonth}>›</button>
          </div>

          <div className="p-cal-grid">
            {DAYS.map(d => <div key={d} className="p-cal-day-header">{d}</div>)}
            {Array.from({length: firstDaySlot}).map((_,i) => <div key={`e-${i}`}/>)}
            {Array.from({length: daysInMonth}).map((_,i) => {
              const day = i + 1;
              const key = toKey(day);
              const isToday     = day===today.getDate() && viewMonth===today.getMonth() && viewYear===today.getFullYear();
              const isPeriod    = periodDays.has(key);
              const isEstimated = estimatedDays.has(key);
              const isOvulation = ovulationDays.has(key);
              const isLogged    = loggedDays.includes(key);
              const isBunnyStart = periodStartDay === day;
              const isBunnyEnd   = bunnyEndDay === day && bunnyEndDay !== periodStartDay;

              return (
                <div key={day}
                  className={['p-cal-day', isToday?'p-day-today':'', isPeriod?'p-day-period':'', isEstimated?'p-day-estimated':'', isOvulation?'p-day-ovulation':'', isLogged?'p-day-logged':'', pickingStart?'p-day-pickable':''].join(' ')}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className="p-day-num">{day}</span>
                  {isBunnyStart && <BunnySVG className="bunny-start" />}
                  {isBunnyEnd   && <BunnySVG className="bunny-jump" />}
                  {isLogged && !isBunnyStart && <BunnySVG className="bunny-logged" />}
                  {isOvulation && !isPeriod && <FlowerSVG />}
                </div>
              );
            })}
          </div>

          <div className="p-legend">
            {[
              { color: '#fce4ec', border: '#e91e8c', label: 'Period' },
              { color: '#ffeef8', border: '#f9a8d4', label: 'Estimated' },
              { color: '#fef9c3', border: '#fbbf24', label: 'Ovulation' },
              { color: '#f0fdf4', border: '#4ade80', label: 'Logged' },
            ].map(l => (
              <div key={l.label} className="p-legend-item">
                <div className="p-legend-dot" style={{background:l.color, border:`1.5px solid ${l.border}`}}/>
                <span>{l.label}</span>
              </div>
            ))}
            <div className="p-legend-item">
              <div style={{width:14,height:14,background:'#fce4ec',border:'1px solid #e91e8c',borderRadius:3}}/>
              <span>Period start bunny</span>
            </div>
          </div>
        </div>

        <div className="p-wave-card">
          <h2 className="p-wave-title">Pain Intensity Wave</h2>
          <p className="p-wave-sub">Log entries to see your pattern pulse build over time</p>
          <div className="p-wave">
            {[2,4,7,5,8,3,6,9,4,7,5,8,3,6,2,5,8,6,9,4,7,3,5,8,4,6,9,5,7,3].map((h,i) => (
              <div key={i} className="p-wave-bar" style={{height:`${h*8}px`, animationDelay:`${i*0.05}s`}}/>
            ))}
          </div>
          <div className="p-wave-labels"><span>30 days ago</span><span>Today</span></div>
        </div>

        <div>
          <h2 className="p-insights-title">Cycle Insights</h2>
          <div className="p-insights-grid">
            {[
              { title: 'Period Tracker', desc: periodStart ? `Your period started ${new Date(periodStart).toLocaleDateString('en-US',{month:'short',day:'numeric'})}. Estimated end in ${periodLength} days.` : 'Set your period start date to activate the bunny trail.', color: '#fff0f3', border: '#fce4ec' },
              { title: 'Next Cycle',     desc: periodStart ? `Your next period is estimated around ${nextPeriod}. Your cycle is ${cycleLength} days.` : 'Add your cycle data to see predictions.', color: '#fdf4ff', border: '#f5d0fe' },
              { title: 'Ovulation Window', desc: periodStart ? `Your ovulation window is approximately 14 days before your next period.` : 'Set your period start to calculate ovulation.', color: '#fefce8', border: '#fef08a' },
            ].map(c => (
              <div key={c.title} className="p-insight-card" style={{background:c.color, border:`1px solid ${c.border}`}}>
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
