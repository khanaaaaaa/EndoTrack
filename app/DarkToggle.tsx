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
    <button onClick={toggle} className="dark-toggle" aria-label="Toggle dark mode">
      <span className={`dark-toggle-opt ${!dark ? 'dark-toggle-active' : ''}`}>Light</span>
      <span className={`dark-toggle-opt ${dark ? 'dark-toggle-active' : ''}`}>Dark</span>
    </button>
  );
}
