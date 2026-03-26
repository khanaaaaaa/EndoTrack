'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') return !sessionStorage.getItem('splashSeen');
    return true;
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const fade = setTimeout(() => setFadeOut(true), 3200);
    const done = setTimeout(() => {
      sessionStorage.setItem('splashSeen', '1');
      setLoading(false);
    }, 3800);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, [loading]);

  if (loading) return <Splash fadeOut={fadeOut} />;

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">EndoTrack</span>
          {['Home','Journal','Patterns','Insights','Report'].map(l => (
            <a key={l} href={`/${l==='Home'?'':l.toLowerCase()}`}
              className={`nav-link ${l==='Home'?'nav-link-active':''}`}>{l}</a>
          ))}
          <a href="/journal" className="btn-primary">+ Log Symptom</a>
        </div>
      </nav>

      <div className="container">

        {/* Hero */}
        <div className="h-hero">
          <p className="h-hero-label">Endometriosis Care</p>
          <h1 className="h-hero-title">
            Track your symptoms.<br />Understand your body.<br />Advocate for yourself.
          </h1>
          <p className="h-hero-desc">
            EndoTrack is a personalized care tool designed to help people with endometriosis
            track symptoms and turn their daily experiences into meaningful health insights.
          </p>
          <a href="/journal" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}>
            Start Tracking
          </a>
        </div>

        {/* Why it matters */}
        <div className="card">
          <h2 className="h-section-title">Why tracking matters</h2>
          <div className="h-facts">
            {[
              { stat: '7–10', label: 'years', desc: 'The average time it takes to receive an endometriosis diagnosis.' },
              { stat: '1 in 10', label: 'people', desc: 'With a uterus are affected by endometriosis worldwide.' },
              { stat: '176M', label: 'globally', desc: 'People living with endometriosis, many without a diagnosis.' },
            ].map(f => (
              <div key={f.stat} className="h-fact">
                <div className="h-fact-stat">{f.stat}</div>
                <div className="h-fact-label">{f.label}</div>
                <div className="h-fact-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What EndoTrack does */}
        <div>
          <h2 className="h-section-title" style={{ marginBottom: '1rem' }}>What EndoTrack does</h2>
          <div className="grid-2">
            {[
              {
                href: '/journal',
                title: 'Symptom Journal',
                desc: 'Log pain intensity, mood, symptoms and triggers step by step. Every entry builds your health picture.',
              },
              {
                href: '/patterns',
                title: 'Cycle Patterns',
                desc: 'Visualize how your symptoms align with your menstrual cycle. Spot recurring pain before your next appointment.',
              },
              {
                href: '/insights',
                title: 'Health Insights',
                desc: 'See which symptoms are recurring, escalating, or being dismissed. Know when to push for further evaluation.',
              },

            ].map(c => (
              <a key={c.href} href={c.href} className="feature-link">
                <div className="card feature-card h-tool-card">
                  <div className="feature-title">{c.title}</div>
                  <div className="feature-desc">{c.desc}</div>
                  <span className="h-tool-link">Open</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="card">
          <h2 className="h-section-title">How to use EndoTrack</h2>
          <div className="h-steps">
            {[
              { n: '01', title: 'Log daily', desc: 'Use the Journal to record your pain level, mood, symptoms and what triggered them.' },
              { n: '02', title: 'Set your cycle', desc: 'In Patterns, tap your period start date on the calendar to activate cycle tracking.' },
              { n: '03', title: 'Review insights', desc: 'Check Insights regularly to see patterns your doctor should know about.' },
              { n: '04', title: 'Review your history', desc: 'Open the Report page to see your full symptom log and share it with your doctor.' },
            ].map(s => (
              <div key={s.n} className="h-step">
                <div className="h-step-num">{s.n}</div>
                <div>
                  <div className="h-step-title">{s.title}</div>
                  <div className="h-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="card">
          <h2 className="h-section-title">Endometriosis resources</h2>
          <div className="h-resources">
            {[
              { name: 'Endometriosis Foundation of America', url: 'https://www.endofound.org', desc: 'Research, education and advocacy.' },
              { name: 'World Endometriosis Society', url: 'https://endometriosis.ca', desc: 'Global clinical and research standards.' },
              { name: 'Endometriosis UK', url: 'https://www.endometriosis-uk.org', desc: 'Support, helpline and local groups.' },
            ].map(r => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="h-resource">
                <div className="h-resource-name">{r.name}</div>
                <div className="h-resource-desc">{r.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="quote-card">
          <p className="quote-text">
            &quot;This doesn&apos;t have to be something you just live with.&quot;
          </p>
          <p className="quote-sub">
            Consistent tracking gives you the evidence to advocate for yourself.
            On average, endometriosis takes 7–10 years to diagnose — your data can help change that.
          </p>
        </div>

      </div>
    </div>
  );
}

function Splash({ fadeOut }: { fadeOut: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`splash ${fadeOut ? 'splash-fade' : ''}`}>
      <div className="splash-content">
        <h1 className="splash-title">EndoTrack</h1>
        <p className="splash-tagline">A personalized care tool for people with endometriosis.</p>
        <div className="splash-bar-track">
          <div className="splash-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
