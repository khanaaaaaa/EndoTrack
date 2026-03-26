'use client';
import './patterns.css';
import { useState, useEffect } from 'react';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(y: number, m: number)  { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function BunnySVG({ className }: { className: string }) {
  return (
    <div className={`bunny-wrap ${className}`}>
      <svg className="bunny-svg" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse className="bunny-ear-left"  cx="9"  cy="7" rx="3" ry="6" fill="#f9a8d4" stroke="#e91e8c" strokeWidth="1"/>
        <ellipse className="bunny-ear-left"  cx="9"  cy="7" rx="1.5" ry="4" fill="#fce4ec"/>
        <ellipse className="bunny-ear-right" cx="19" cy="7" rx="3" ry="6" fill="#f9a8d4" stroke="#e91e8c" strokeWidth="1"/>
        <ellipse className="bunny-ear-right" cx="19" cy="7" rx="1.5" ry="4" fill="#fce4ec"/>
        <ellipse className="bunny-body" cx="14" cy="20" rx="7" ry="6" fill="#fce4ec" stroke="#e91e8c" strokeWidth="1"/>
        <circle  className="bunny-body" cx="14" cy="13" r="5"  fill="#fce4ec" stroke="#e91e8c" strokeWidth="1"/>
        <circle cx="12" cy="12" r="1"   fill="#e91e8c"/>
        <circle cx="16" cy="12" r="1"   fill="#e91e8c"/>
        <ellipse cx="14" cy="14" rx="1" ry="0.6" fill="#f9a8d4"/>
        <circle cx="21" cy="22" r="2"   fill="white" stroke="#f9a8d4" strokeWidth="0.8"/>
      </svg>
    </div>
  );
}

export default function Patterns() {
  const today = new Date();

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());

  const [periodStart,    setPeriodStartRaw]    = useState<string | null>(null);
  const [periodLength,   setPeriodLengthRaw]   = useState<number>(5);
  const [cycleLength,    setCycleLengthRaw]    = useState<number>(28);
  const [loggedDays,     setLoggedDaysRaw]     = useState<string[]>([]);
  const [showSetup,      setShowSetup]         = useState(false);
  const [pickingStart,   setPickingStart]      = useState(false);
  const [hoveredDay,     setHoveredDay]        = useState<number | null>(null);

  // Load from localStorage after mount
  useEffect(() => {
    const ps = localStorage.getItem('endo_period_start');
    const pl = localStorage.getItem('endo_period_len');
    const cl = localStorage.getItem('endo_cycle_len');
    const ld = localStorage.getItem('endo_logged');
    if (ps) setPeriodStartRaw(ps);
    if (pl) setPeriodLengthRaw(Number(pl));
    if (cl) setCycleLengthRaw(Number(cl));
    if (ld) { try { setLoggedDaysRaw(JSON.parse(ld)); } catch {} }
  }, []);

  const setPeriodStart  = (v: string | null) => { setPeriodStartRaw(v); if (v) localStorage.setItem('endo_period_start', v); else localStorage.removeItem('endo_period_start'); };
  const setPeriodLength = (fn: (n: number) => number) => setPeriodLengthRaw(prev => { const next = fn(prev); localStorage.setItem('endo_period_len', String(next)); return next; });
  const setCycleLength  = (fn: (n: number) => number) => setCycleLengthRaw(prev => { const next = fn(prev); localStorage.setItem('endo_cycle_len',  String(next)); return next; });
  const setLoggedDays   = (fn: (p: string[]) => string[]) => setLoggedDaysRaw(prev => { const next = fn(prev); localStorage.setItem('endo_logged', JSON.stringify(next)); return next; });

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDaySlot = getFirstDayOfMonth(viewYear, viewMonth);

  const toKey = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  // ── Prediction sets ──────────────────────────────────────────────
  // Based on:
  // - Naegele's rule: next period = last period start + cycle length
  // - Knaus-Ogino method: ovulation = next period - 14 days (luteal phase constant)
  // - Fertile window: 5 days before ovulation + ovulation day (sperm viability)
  // - PMS window: 7 days before next period (luteal phase symptoms)
  const buildSets = () => {
    const period    = new Set<string>();
    const estimated = new Set<string>();
    const ovulation = new Set<string>();
    const fertile   = new Set<string>();
    const pms       = new Set<string>();

    if (!periodStart) return { period, estimated, ovulation, fertile, pms };

    const start = new Date(periodStart);

    // Current period
    for (let i = 0; i < periodLength; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      period.add(toISO(d));
    }

    // Current cycle ovulation (Knaus-Ogino: luteal phase = 14 days)
    const curOvDay = new Date(start);
    curOvDay.setDate(start.getDate() + cycleLength - 14);
    ovulation.add(toISO(curOvDay));
    // Fertile window for current cycle
    for (let i = -5; i <= 0; i++) {
      const d = new Date(curOvDay); d.setDate(curOvDay.getDate() + i);
      if (!period.has(toISO(d))) fertile.add(toISO(d));
    }

    // Next 3 cycles
    for (let c = 1; c <= 3; c++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(start.getDate() + cycleLength * c);

      // Predicted period
      for (let i = 0; i < periodLength; i++) {
        const d = new Date(cycleStart); d.setDate(cycleStart.getDate() + i);
        estimated.add(toISO(d));
      }

      // Ovulation = next period start - 14 days (luteal phase constant)
      const ovDay = new Date(cycleStart);
      ovDay.setDate(cycleStart.getDate() - 14);
      ovulation.add(toISO(ovDay));

      // Fertile window = 5 days before ovulation + ovulation day
      for (let i = -5; i <= 0; i++) {
        const d = new Date(ovDay); d.setDate(ovDay.getDate() + i);
        if (!estimated.has(toISO(d))) fertile.add(toISO(d));
      }

      // PMS = 7 days before predicted period start
      for (let i = -7; i < 0; i++) {
        const d = new Date(cycleStart); d.setDate(cycleStart.getDate() + i);
        if (!estimated.has(toISO(d)) && !fertile.has(toISO(d))) pms.add(toISO(d));
      }
    }

    return { period, estimated, ovulation, fertile, pms };
  };

  const { period: periodDays, estimated: estimatedDays, ovulation: ovulationDays, fertile: fertileDays, pms: pmsDays } = buildSets();

  const handleDayClick = (day: number) => {
    if (pickingStart) { setPeriodStart(toKey(day)); setPickingStart(false); return; }
    const key = toKey(day);
    setLoggedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const periodStartDay = periodStart ? (() => { const s = new Date(periodStart); return s.getMonth() === viewMonth && s.getFullYear() === viewYear ? s.getDate() : null; })() : null;

  const bunnyEndDay = periodStart ? (() => {
    const s = new Date(periodStart);
    if (s.getMonth() !== viewMonth || s.getFullYear() !== viewYear) return null;
    return s.getDate() + periodLength - 1;
  })() : null;

  const totalLogged = loggedDays.length;

  const QUOTES = [
    "Your body is not a problem to be solved.",
    "Healing is not linear — and neither is your cycle.",
    "You are more than your pain.",
    "Rest is productive. Listening to your body is brave.",
    "Every cycle is data. Every day is progress.",
  ];
  const dailyQuote = QUOTES[today.getDate() % QUOTES.length];

  // Scientific ovulation: Luteal phase is consistently ~14 days before next period
  // So ovulation = next period date - 14 days (Knaus-Ogino method)
  const ovulationDateStr = periodStart ? (() => {
    const s = new Date(periodStart);
    s.setDate(s.getDate() + cycleLength - 14);
    return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  })() : '—';

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
            <h1 className="p-title">Cycle Patterns</h1>
            <p className="p-sub">Track your period, predict your cycle, understand your body.</p>
          </div>
          <button className="p-setup-btn" onClick={() => { setShowSetup(s => !s); setPickingStart(false); }}>
            Cycle Setup
          </button>
        </div>

        {pickingStart && (
          <div className="p-pick-banner p-animate">
            Tap any day on the calendar to set your period start date.
            <button onClick={() => setPickingStart(false)}>Cancel</button>
          </div>
        )}

        {showSetup && (
          <div className="p-setup-card p-animate">
            <h2 className="p-setup-title">Cycle Settings</h2>
            <div className="p-setup-field" style={{ marginBottom: '1.25rem' }}>
              <label className="p-setup-label">Period Start Date</label>
              <div className="p-start-row">
                <div className="p-start-display">
                  {periodStart ? new Date(periodStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                </div>
                <button className="p-start-btn" onClick={() => { setPickingStart(true); setShowSetup(false); }}>
                  {periodStart ? 'Change on calendar' : 'Tap a day on calendar'}
                </button>
                {periodStart && <button className="p-start-clear" onClick={() => setPeriodStart(null)}>Clear</button>}
              </div>
            </div>
            <div className="p-setup-grid">
              <div className="p-setup-field">
                <label className="p-setup-label">Period Length</label>
                <div className="p-stepper">
                  <button onClick={() => setPeriodLength(l => Math.max(1, l - 1))}>−</button>
                  <span>{periodLength} days</span>
                  <button onClick={() => setPeriodLength(l => Math.min(10, l + 1))}>+</button>
                </div>
              </div>
              <div className="p-setup-field">
                <label className="p-setup-label">Cycle Length</label>
                <div className="p-stepper">
                  <button onClick={() => setCycleLength(l => Math.max(20, l - 1))}>−</button>
                  <span>{cycleLength} days</span>
                  <button onClick={() => setCycleLength(l => Math.min(40, l + 1))}>+</button>
                </div>
              </div>
            </div>
            <button className="p-setup-save" onClick={() => setShowSetup(false)}>Save & Close</button>
          </div>
        )}

        {/* Stats */}
        <div className="p-stats">
          <div className="p-stat-card">
            <span className="p-stat-value">{totalLogged}</span>
            <span className="p-stat-label">Days Logged</span>
          </div>
          <div className="p-stat-card p-stat-quote">
            <span className="p-stat-quote-text">✦ {dailyQuote}</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-cal-card p-animate">
          <div className="p-cal-nav">
            <button className="p-cal-arrow" onClick={prevMonth}>‹</button>
            <h2 className="p-cal-month">{MONTHS[viewMonth]} {viewYear}</h2>
            <button className="p-cal-arrow" onClick={nextMonth}>›</button>
          </div>

          <div className="p-cal-grid">
            {DAYS.map(d => <div key={d} className="p-cal-day-header">{d}</div>)}
            {Array.from({ length: firstDaySlot }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day        = i + 1;
              const key        = toKey(day);
              const isToday    = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isPeriod   = periodDays.has(key);
              const isEst      = estimatedDays.has(key);
              const isOv       = ovulationDays.has(key) && !isPeriod && !isEst;
              const isFertile  = fertileDays.has(key)   && !isPeriod && !isEst && !isOv;
              const isPMS      = pmsDays.has(key)        && !isPeriod && !isEst;
              const isLogged   = loggedDays.includes(key);
              const isBunnyStart = periodStartDay === day;
              const isBunnyEnd   = bunnyEndDay === day && bunnyEndDay !== periodStartDay;

              return (
                <div key={day}
                  className={[
                    'p-cal-day',
                    isToday   ? 'p-day-today'    : '',
                    isPeriod  ? 'p-day-period'   : '',
                    isEst     ? 'p-day-estimated': '',
                    isOv      ? 'p-day-ovulation': '',
                    isFertile ? 'p-day-fertile'  : '',
                    isPMS     ? 'p-day-pms'      : '',
                    isLogged  ? 'p-day-logged'   : '',
                    pickingStart ? 'p-day-pickable' : '',
                  ].join(' ')}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className="p-day-num">{day}</span>
                  {isBunnyStart && <BunnySVG className="bunny-start" />}
                  {isBunnyEnd && !isBunnyStart && <BunnySVG className="bunny-jump" />}
                  {isLogged && !isBunnyStart && <BunnySVG className="bunny-logged" />}
                </div>
              );
            })}
          </div>

        </div>

        {/* Pain Wave */}
        <div className="p-wave-card">
          <h2 className="p-wave-title">Pain Intensity Wave</h2>
          <p className="p-wave-sub">Log entries to see your pattern build over time</p>
          <div className="p-wave">
            {[2,4,7,5,8,3,6,9,4,7,5,8,3,6,2,5,8,6,9,4,7,3,5,8,4,6,9,5,7,3].map((h, i) => (
              <div key={i} className="p-wave-bar" style={{ height: `${h * 8}px`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
          <div className="p-wave-labels"><span>30 days ago</span><span>Today</span></div>
        </div>

      </div>
    </div>
  );
}
