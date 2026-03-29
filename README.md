## EndoTrack

Demo: https://endo-track-woad.vercel.app/

# What It Is

EndoTrack is a symptom tracking tool for people dealing with menstrual health concerns. You log how you feel each day, and over time it starts picking up on patterns, like whether your pain is getting worse, whether certain triggers keep showing up, or whether your mood consistently dips at certain points in your cycle. Everything stays on your device, no accounts, no servers.

# Why I Made It

I came across a TikTok creator talking about endometriosis and it genuinely shocked me. The average diagnosis takes 7 to 10 years, partly because symptoms get dismissed as "just bad cramps." I wanted to build something that helps people build a documented case for themselves before walking into a doctor's appointment. Even if one person uses this to finally get taken seriously, it was worth building.

# What I Struggled With and What I Learnt

Getting the calendar right took the longest. I had to actually read about how cycle prediction works medically before I could implement it properly. Naegele's rule and the Knaus-Ogino method are not complicated once you understand them, but getting the fertile window, PMS window, and ovulation day to all render correctly across multiple future cycles took a lot of iteration.

# How I Made It

**Stack**
- Next.js
- React
- TypeScript
- Plain CSS

Everything is in localStorage.

Also used https://www.youtube.com/watch?v=G3e-cpL7ofc.