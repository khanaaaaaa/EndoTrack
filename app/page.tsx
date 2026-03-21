export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f5ff', color: '#1a1a2e', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        background: 'rgba(255,255,255,0.85)',
        borderBottom: '1px solid #e8e0f5',
        backdropFilter: 'blur(12px)',
        padding: '0 2rem',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: '0.5rem' }}>
          <span style={{
            fontWeight: 800, fontSize: '1.25rem', marginRight: 'auto', letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>🌸 EndoTrack</span>
          {[
            { label: 'Home', href: '/' },
            { label: 'Journal', href: '/journal' },
            { label: 'Patterns', href: '/patterns' },
            { label: 'Insights', href: '/insights' },
            { label: 'Report', href: '/report' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              color: l.label === 'Home' ? '#7c3aed' : '#6b7280',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
              background: l.label === 'Home' ? 'rgba(124,58,237,0.08)' : 'transparent',
              padding: '0.4rem 0.9rem', borderRadius: 8, transition: 'all 0.2s',
            }}>{l.label}</a>
          ))}
          <a href="/journal" style={{
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            color: 'white', textDecoration: 'none', borderRadius: 10,
            padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.875rem',
          }}>+ Log Symptom</a>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          borderRadius: 24, padding: '3.5rem 3rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Smart Symptom Tracking
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', maxWidth: 380 }}>
              Your pain has a pattern. Let&apos;s find it.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 360, marginBottom: '1.75rem' }}>
              Log symptoms naturally. Our AI detects cycles, escalations, and patterns that get dismissed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/journal" style={{
                background: 'white', color: '#7c3aed',
                textDecoration: 'none', borderRadius: 12,
                padding: '0.75rem 1.75rem', fontWeight: 700, fontSize: '0.95rem',
              }}>✍️ Start Check-in</a>
              <a href="/patterns" style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                textDecoration: 'none', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.75rem 1.75rem', fontWeight: 600, fontSize: '0.95rem',
              }}>View Patterns →</a>
            </div>
          </div>
          {/* Visual pulse graphic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.9 }}>
            {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60].map((h, i) => (
              <div key={i} style={{
                width: 8, height: h * 0.6,
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 4,
                alignSelf: h > 60 ? 'flex-start' : 'center',
              }} />
            ))}
          </div>
        </div>

        {/* Alert Banner */}
        <div style={{
          background: '#fff5f8',
          border: '1.5px solid #fbb6ce',
          borderRadius: 16, padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{
            background: '#db2777', borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '1.1rem',
          }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#9d174d', marginBottom: '0.2rem' }}>This may NOT be typical.</div>
            <div style={{ color: '#be185d', fontSize: '0.875rem' }}>Your symptom patterns suggest further evaluation may be warranted. Don&apos;t ignore this.</div>
          </div>
          <a href="/insights" style={{
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            color: 'white', textDecoration: 'none', borderRadius: 10,
            padding: '0.6rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap',
          }}>See Why →</a>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Entries Logged', value: '0', icon: '📝', color: '#7c3aed', bg: '#f5f0ff' },
            { label: 'Patterns Found', value: '0', icon: '🔍', color: '#db2777', bg: '#fff0f6' },
            { label: 'Days Tracked', value: '0', icon: '📅', color: '#0891b2', bg: '#f0faff' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white', border: '1px solid #f0e8ff',
              borderRadius: 16, padding: '1.5rem', textAlign: 'center',
              boxShadow: '0 2px 12px rgba(124,58,237,0.07)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', margin: '0 auto 0.75rem',
              }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Check-in Card */}
        <div style={{
          background: 'white', border: '1px solid #f0e8ff',
          borderRadius: 20, padding: '2rem',
          boxShadow: '0 2px 12px rgba(124,58,237,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>Today&apos;s Check-in</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.2rem' }}>How are you feeling right now?</p>
            </div>
            <span style={{ fontSize: '1.75rem' }}>🌸</span>
          </div>

          {/* Pain Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Pain Level</span>
              <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 700 }}>5 / 10</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: '#f3f0ff', borderRadius: 8 }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%', width: '50%',
                background: 'linear-gradient(90deg, #7c3aed, #db2777)', borderRadius: 8,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>No pain</span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Severe</span>
            </div>
          </div>

          {/* Mood Bubbles */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.75rem' }}>Mood</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['😔 Low', '😐 Okay', '😤 Frustrated', '😰 Anxious', '🙂 Good'].map(mood => (
                <button key={mood} style={{
                  background: mood === '😔 Low' ? 'rgba(124,58,237,0.1)' : '#f9fafb',
                  border: mood === '😔 Low' ? '1.5px solid #7c3aed' : '1.5px solid #f3f4f6',
                  borderRadius: 20, padding: '0.4rem 0.9rem',
                  fontSize: '0.85rem', cursor: 'pointer', color: mood === '😔 Low' ? '#7c3aed' : '#6b7280',
                  fontWeight: mood === '😔 Low' ? 600 : 400,
                }}>{mood}</button>
              ))}
            </div>
          </div>

          <a href="/journal" style={{
            display: 'block', textAlign: 'center',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            color: 'white', textDecoration: 'none', borderRadius: 12,
            padding: '0.85rem', fontWeight: 600, fontSize: '0.95rem',
          }}>Log Full Entry →</a>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { href: '/patterns', icon: '📊', title: 'Pattern Pulse', desc: 'Animated wave graph of your pain cycles over time', color: '#7c3aed', bg: '#f5f0ff' },
            { href: '/insights', icon: '🔴', title: 'Second Look Insights', desc: 'AI flags symptoms that were dismissed but matter', color: '#db2777', bg: '#fff0f6' },
            { href: '/journal', icon: '✍️', title: 'Smart Journal', desc: 'Type naturally — AI extracts pain, triggers & tone', color: '#0891b2', bg: '#f0faff' },
            { href: '/report', icon: '📄', title: 'Doctor Report', desc: 'Auto-generate a PDF timeline to bring to appointments', color: '#059669', bg: '#f0fdf4' },
          ].map(card => (
            <a key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', border: '1px solid #f0e8ff',
                borderRadius: 16, padding: '1.5rem', cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(124,58,237,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s', height: '100%',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', marginBottom: '0.75rem',
                }}>{card.icon}</div>
                <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '0.35rem' }}>{card.title}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.83rem', lineHeight: 1.5 }}>{card.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Emotional Validation */}
        <div style={{
          textAlign: 'center', padding: '2.5rem 2rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(219,39,119,0.06))',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 20,
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💜</div>
          <p style={{ fontSize: '1.15rem', color: '#7c3aed', fontWeight: 600, fontStyle: 'italic', maxWidth: 480, margin: '0 auto' }}>
            "This doesn&apos;t have to be something you just live with."
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            On average, endometriosis takes 7–10 years to diagnose. Your data can change that.
          </p>
        </div>

      </div>
    </div>
  );
}
