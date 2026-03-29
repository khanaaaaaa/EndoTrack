## EndoTrack

Demo: https://endo-track-woad.vercel.app/

# What It Is

EndoTrack is a symptom tracking tool for people dealing with menstrual health concerns. You log how you feel each day, and over time it starts picking up on patterns, like whether your pain is getting worse, whether certain triggers keep showing up, or whether your mood consistently dips at certain points in your cycle. Everything stays on your device, no accounts, no servers.

# Why I Made It

I came across a TikTok creator talking about endometriosis and it genuinely shocked me. The average diagnosis takes 7 to 10 years, partly because symptoms get dismissed as "just bad cramps." I wanted to build something that helps people build a documented case for themselves before walking into a doctor's appointment. Even if one person uses this to finally get taken seriously, it was worth building.

# What I Struggled With and What I Learnt

Getting the calendar right took the longest. I had to actually read about how cycle prediction works medically before I could implement it properly. Naegele's rule and the Knaus-Ogino method are not complicated once you understand them, but getting the fertile window, PMS window, and ovulation day to all render correctly across multiple future cycles took a lot of iteration.

Connecting the data across pages was also tricky. The journal, patterns, insights, and report all need to read from the same source, and making sure nothing broke when entries were added or the cycle was reconfigured took careful state management.

# Features

**Journal**
- 5-step entry flow: pain level (0-10), mood, symptoms, triggers, and a personal note
- Symptoms and triggers can be skipped if not relevant
- Entries are saved instantly to localStorage and appear in Recent Entries below the form
- Streak counter tracks how many consecutive days you have logged

**Patterns Calendar**
- Full interactive calendar with month navigation
- Cycle predictions rendered across 3 future cycles using Naegele's rule and the Knaus-Ogino method
- Colour-coded days: current period, estimated future periods, ovulation, fertile window, PMS window, and logged days
- Cycle setup is always visible: set your period start date by clicking any calendar day, adjust period length and cycle length with steppers
- Days Logged and Next Period stats appear once your cycle is configured

**Insights**
- Automatically detects 5 pattern types from your journal entries:
  - Escalating pain (compares older vs newer entries)
  - Recurring symptoms (any symptom in over 40% of entries)
  - Recurring triggers (same threshold)
  - Emotional distress pattern (distressed mood in over 50% of entries)
  - Dismissed symptoms (detects dismissal language in your notes)
- Each insight is expandable with a plain-language explanation and a recommended action
- Severity levels: High, Medium, Low with filter buttons
- Shows an empty state with a prompt to start logging if no entries exist

**Doctor Report**
- Auto-generated summary of all your entries
- Pain timeline bar chart
- Symptom frequency bars showing which symptoms appear most
- Full chronological log with pain score, mood, symptoms, triggers, and note
- Designed to be brought to a medical appointment as supporting evidence

# How I Made It

**Stack**
- Next.js 14 (App Router)
- React with hooks (useState, useEffect)
- TypeScript
- Plain CSS, one stylesheet per page, no framework

**Data**

No backend. Everything lives in localStorage:
- `endo_entries` — journal entries with pain, mood, symptoms, triggers, note, ISO timestamp
- `endo_period_start`, `endo_period_len`, `endo_cycle_len` — cycle configuration

**Calendar**

Built with CSS Grid. The bunny SVG markers animate on period start and end days. Predicted days are computed fresh on every render from the stored cycle config.

**Insight Detection**

Five algorithms run over the full entry array on page load. Thresholds were chosen to avoid false positives on small datasets (minimum 3 occurrences, minimum 4 entries for escalation detection).
