## EndoTrack

Demo: https://endo-track-woad.vercel.app/

# What It Is

EndoTrack is a symptom tracking tool designed to help individuals with menstrual health concerns log their daily experiences, identify recurring patterns, and determine whether their symptoms may indicate a chronic condition such as endometriosis. All data is stored locally on the user's device.

# Why I Made It

Awareness of endometriosis came through a content creator online. It was difficult to learn that research into male pattern baldness was receiving more funding than a chronic condition affecting millions of women. This project was built to surface early warning signs and provide accessible resources. If it helps even one person advocate for themselves, it has served its purpose.

# What I Struggled With and What I Learnt

Routing between pages, particularly connecting Patterns, Insights, and Report so they share the same data source, was the most challenging part. The calendar required the most time, as it involved implementing medical cycle prediction formulas accurately. The research into endometriosis itself was valuable and informed how the insight detection logic was designed.

# How I Made It

**Stack**
- Next.js 14 (App Router)
- React with hooks (useState, useEffect)
- TypeScript
- Plain CSS (one stylesheet per page, no framework)

**Architecture**

Each page is a self-contained page.tsx and page.css pair under the app directory. There is no backend. All user data is persisted in localStorage under the following keys:

- endo_entries: array of journal entries containing pain score, mood, symptoms, triggers, note, and ISO timestamp
- endo_period_start, endo_period_len, endo_cycle_len: cycle configuration for the patterns calendar

Data is loaded on mount via useEffect to avoid server-side rendering conflicts.

**Calendar and Cycle Prediction**

The calendar is built with CSS Grid. Predicted cycle dates are calculated using two established medical methods:

- Naegele's rule: next period start = last period start + cycle length
- Knaus-Ogino method: ovulation = next period start minus 14 days (constant luteal phase assumption)

Fertile window (5 days before ovulation) and PMS window (7 days before next period) are derived from those values and rendered across 3 future cycles.

**Insight Detection**

The Insights page reads all journal entries and runs five pattern detection checks:

1. Escalating pain: compares average pain score of the older half of entries against the newer half
2. Recurring symptoms: any symptom appearing in more than 40 percent of entries with at least 3 occurrences
3. Recurring triggers: same threshold applied to logged triggers
4. Emotional distress: distressed or low mood logged in more than 50 percent of entries
5. Dismissed symptoms: note text contains language associated with medical dismissal

**Recent Fix**

Entry saving was broken due to a mandatory note field blocking submission and localStorage being read inconsistently. This was resolved by removing the note requirement, using React state as the single source of truth for entries, and syncing to localStorage on save. The Recent Entries section and streak counter now reflect real logged data.

**AI Usage**

Amazon Q Developer (in VS Code) was used throughout development for building and iterating on features. ChatGPT was used for occasional debugging.
