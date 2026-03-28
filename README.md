## EndoTrack

Demo: https://endo-track-woad.vercel.app/

# What It Is

EndoTrack is a care tool that is designed to help women on their periods actually gather patterns and figure out if they are having normal period cramps or they might be having a chronic disease through data they enter.

# Why I Made It

Got awarness about Endometriosis through a TikTok creator and it was so heart breaking to hear that research on males getting balder as they age was getting more funding than a chronic condition. So made this to look at the early signs and attached helpful resources to help women. Even if one person is inspired by this, the project is worth it.

# What I Struggled With & What I Learnt

The routing of the tabs with eachother especially trying to route Patterns with Insights and report. The calender was also such a hassle, spent most of my time on it. But I learnt a lot about endometriosis so it was fun researching about it, and actually making a long term analyzing system for it.

# How I Made It

**Stack**
- Next.js
- React
- TypeScript
- Plain CSS

The calendar is built with CSS Grid, and the formulas I used for cycle dates are:

- *Naegele's rule* — next period = last period start + cycle length
- *Knaus-Ogino method* — ovulation = next period − 14 days (constant luteal phase)

Home section was inspired by the classic webpage format that I see everywhere. It's made from basic TSX and CSS.

All the other sections were made with the help of multiple YouTube tutorials. 

**AI Usage**

ChatGPT for occasional debugging.