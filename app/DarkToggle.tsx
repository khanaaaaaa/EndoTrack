'use client';
import { useEffect, useState } from 'react';

export default function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('endo_dark');
    if (saved === '1') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('endo_dark', next ? '1' : '0');
  };

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        background: dark ? '#2a2a2a' : '#f0f0f0',
        border: 'none',
        borderRadius: '999px',
        padding: '4px',
        cursor: 'pointer',
        gap: '2px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
      aria-label="Toggle dark mode"
    >
      {(['Light', 'Dark'] as const).map(opt => {
        const active = (opt === 'Dark') === dark;
        return (
          <span
            key={opt}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              color: active ? (dark ? '#e8e8e8' : '#1a1a1a') : '#888',
              background: active ? (dark ? '#111' : 'white') : 'transparent',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {opt}
          </span>
        );
      })}
    </button>
  );
}
