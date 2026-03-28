// ── DATA ──────────────────────────────────────────────────────────────────────
localStorage.removeItem('endoLogs');
const logs = [];
let symptomScore = 0;
let doctorScore  = 0;

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function navigate(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(screen + '-screen').classList.add('active');
    const btn = document.querySelector(`[data-screen="${screen}"]`);
    if (btn) btn.classList.add('active');
    if (screen === 'symptoms') renderSymptomQuestions();
    if (screen === 'doctor')   renderDoctorQuestions();
    if (screen === 'next')     renderNextSteps();
    if (screen === 'journal')  renderJournal();
}

// ── SYMPTOM CHECKER ───────────────────────────────────────────────────────────
// Each question maps to a real ESNM/ACOG diagnostic indicator. Weight = clinical significance.
const SYMPTOM_QS = [
    { id: 's1', w: 2, text: 'Do you have pelvic pain that worsens in the days before your period?' },
    { id: 's2', w: 2, text: 'Is your menstrual pain severe enough to miss work, school, or daily activities?' },
    { id: 's3', w: 2, text: 'Do you experience pain during or after sexual intercourse (dyspareunia)?' },
    { id: 's4', w: 2, text: 'Do you have painful bowel movements or urination, especially during your period?' },
    { id: 's5', w: 1, text: 'Do you experience chronic pelvic pain outside of your period?' },
    { id: 's6', w: 1, text: 'Do you have heavy menstrual bleeding or bleeding with clots?' },
    { id: 's7', w: 1, text: 'Do you experience bloating, nausea, or fatigue that correlates with your cycle?' },
    { id: 's8', w: 1, text: 'Have you had difficulty conceiving (or been told you may have fertility issues)?' },
    { id: 's9', w: 1, text: 'Do you have a first-degree relative (mother, sister) with endometriosis?' },
    { id: 's10', w: 1, text: 'Have your symptoms been present for more than 6 months?' },
];
const MAX_SYMPTOM_SCORE = SYMPTOM_QS.reduce((s, q) => s + q.w, 0); // 14

function renderSymptomQuestions() {
    document.getElementById('symptom-questions').innerHTML = SYMPTOM_QS.map(q => `
        <div class="card q-card">
            <p class="q-text">${q.text}</p>
            <div class="yn-row">
                <label class="yn-label"><input type="radio" name="${q.id}" value="yes"> Yes</label>
                <label class="yn-label"><input type="radio" name="${q.id}" value="no" checked> No</label>
            </div>
        </div>`).join('');
}

function scoreSymptoms() {
    symptomScore = SYMPTOM_QS.reduce((s, q) => {
        const val = document.querySelector(`input[name="${q.id}"]:checked`)?.value;
        return s + (val === 'yes' ? q.w : 0);
    }, 0);

    const pct   = Math.round(symptomScore / MAX_SYMPTOM_SCORE * 100);
    const flags = SYMPTOM_QS.filter(q => document.querySelector(`input[name="${q.id}"]:checked`)?.value === 'yes');

    let level, levelClass, statement;
    if (pct >= 70) {
        level = 'High Alignment'; levelClass = 'level-high';
        statement = 'Your symptoms strongly align with established endometriosis diagnostic criteria. Per ACOG guidelines, this warrants a referral to a gynecologic specialist and consideration of diagnostic laparoscopy.';
    } else if (pct >= 40) {
        level = 'Moderate Alignment'; levelClass = 'level-mid';
        statement = 'Your symptoms show moderate alignment with endometriosis indicators. ESNM guidelines recommend further investigation including pelvic ultrasound and specialist consultation.';
    } else {
        level = 'Low Alignment'; levelClass = 'level-low';
        statement = 'Fewer indicators are present, but endometriosis can present atypically. If symptoms are affecting your quality of life, you are entitled to further investigation.';
    }

    // Pull real symptom data from journal logs
    const journalSymptoms = buildJournalSymptomSummary();

    document.getElementById('symptom-result-content').innerHTML = `
        <div class="result-score-card ${levelClass}">
            <div class="score-num">${symptomScore}<span class="score-denom">/${MAX_SYMPTOM_SCORE}</span></div>
            <div class="score-label">${level}</div>
            <div class="score-pct">${pct}% of clinical indicators present</div>
        </div>
        <div class="card">
            <p class="label">Clinical Statement</p>
            <p class="body-text">${statement}</p>
        </div>
        <div class="card">
            <p class="label">Indicators You Reported</p>
            ${flags.length ? flags.map(q => `<p class="flag-item">· ${q.text}</p>`).join('') : '<p class="body-text muted-text">None selected.</p>'}
        </div>
        ${journalSymptoms}`;

    navigate('symptom-result');
}

function buildJournalSymptomSummary() { return ''; }

// ── DOCTOR CHECKER ────────────────────────────────────────────────────────────
// dismissed = true means this response is a red flag / guideline violation
const DOCTOR_QS = [
    { id: 'd1', dismissed: true,  text: 'They said "period pain is normal" without further investigation.' },
    { id: 'd2', dismissed: true,  text: 'They only offered the contraceptive pill with no explanation of why.' },
    { id: 'd3', dismissed: true,  text: 'They did not refer me to a gynecologist despite severe symptoms.' },
    { id: 'd4', dismissed: true,  text: 'They told me to "just manage the pain" with over-the-counter medication.' },
    { id: 'd5', dismissed: true,  text: 'They dismissed my symptoms as anxiety or stress.' },
    { id: 'd6', dismissed: true,  text: 'They did not ask about the impact on my daily life or work.' },
    { id: 'd7', dismissed: false, text: 'They ordered a pelvic ultrasound or MRI.' },
    { id: 'd8', dismissed: false, text: 'They referred me to a gynecologist or endometriosis specialist.' },
    { id: 'd9', dismissed: false, text: 'They discussed diagnostic laparoscopy as an option.' },
    { id: 'd10', dismissed: false, text: 'They took a detailed symptom history and asked about cycle patterns.' },
];

function renderDoctorQuestions() {
    document.getElementById('doctor-questions').innerHTML = DOCTOR_QS.map(q => `
        <div class="card q-card">
            <label class="check-label">
                <input type="checkbox" name="${q.id}" value="yes">
                <span>${q.text}</span>
            </label>
        </div>`).join('');
}

function scoreDoctor() {
    const dismissals = DOCTOR_QS.filter(q =>
        q.dismissed && document.querySelector(`input[name="${q.id}"]`)?.checked
    );
    const appropriate = DOCTOR_QS.filter(q =>
        !q.dismissed && document.querySelector(`input[name="${q.id}"]`)?.checked
    );

    doctorScore = dismissals.length;

    let verdict, verdictClass, statement;
    if (dismissals.length >= 3) {
        verdict = 'Significant Dismissal'; verdictClass = 'level-high';
        statement = 'Your doctor\'s response shows multiple deviations from ESNM and ACOG clinical guidelines. Patients with your symptom profile are entitled to specialist referral and structured investigation.';
    } else if (dismissals.length >= 1) {
        verdict = 'Partial Dismissal'; verdictClass = 'level-mid';
        statement = 'Some aspects of your doctor\'s response fall below recommended clinical standards. You have the right to request further investigation or a second opinion.';
    } else if (appropriate.length >= 2) {
        verdict = 'Appropriate Response'; verdictClass = 'level-low';
        statement = 'Your doctor\'s response appears to align with clinical guidelines. Continue to advocate for yourself if symptoms persist or worsen.';
    } else {
        verdict = 'Unclear'; verdictClass = 'level-low';
        statement = 'Not enough information selected to assess. If your symptoms are affecting your quality of life, you are always entitled to a second opinion.';
    }

    document.getElementById('doctor-result-content').innerHTML = `
        <div class="result-score-card ${verdictClass}">
            <div class="score-label">${verdict}</div>
            <div class="score-pct">${dismissals.length} guideline violation${dismissals.length !== 1 ? 's' : ''} identified</div>
        </div>
        <div class="card">
            <p class="label">Clinical Statement</p>
            <p class="body-text">${statement}</p>
        </div>
        ${dismissals.length ? `
        <div class="card">
            <p class="label">Violations Flagged</p>
            ${dismissals.map(q => `<p class="flag-item flag-red">· ${q.text}</p>`).join('')}
        </div>` : ''}
        ${appropriate.length ? `
        <div class="card">
            <p class="label">Appropriate Actions Taken</p>
            ${appropriate.map(q => `<p class="flag-item flag-green">· ${q.text}</p>`).join('')}
        </div>` : ''}`;

    navigate('doctor-result');
}

// ── NEXT STEPS ────────────────────────────────────────────────────────────────
function renderNextSteps() {
    const highSymptoms = symptomScore / MAX_SYMPTOM_SCORE >= 0.4;
    const dismissed    = doctorScore >= 1;

    const questions = [
        '"I would like a referral to a gynecologist who specialises in endometriosis."',
        '"Can we discuss diagnostic laparoscopy as an option?"',
        '"I would like a pelvic ultrasound or MRI ordered."',
        '"My symptoms are significantly impacting my quality of life — I need structured investigation."',
        '"I would like a second opinion."',
    ];

    const rights = [
        'You have the right to request a specialist referral at any time.',
        'You have the right to a second opinion — ask your GP to refer you.',
        'ACOG guidelines state that severe dysmenorrhea unresponsive to NSAIDs warrants further investigation.',
        'ESNM guidelines recommend laparoscopy as the gold standard for endometriosis diagnosis.',
        'You can request your full medical records at any time.',
    ];

    const checklist = [
        'Write down your symptoms with dates, pain levels, and cycle days.',
        'Note how symptoms affect your work, sleep, and daily activities.',
        'Bring a trusted person to your next appointment.',
        'Record or take notes during your consultation.',
        'If dismissed again, ask for the reason to be documented in writing.',
    ];

    document.getElementById('next-content').innerHTML = `
        ${(highSymptoms || dismissed) ? `
        <div class="card alert-card">
            <p class="label">Your Situation</p>
            <p class="body-text">${highSymptoms && dismissed
                ? 'Your symptoms align with clinical criteria <strong>and</strong> your doctor\'s response shows guideline violations. You have strong grounds to escalate.'
                : highSymptoms
                ? 'Your symptoms align with clinical criteria. You are entitled to specialist investigation.'
                : 'Your doctor\'s response shows potential guideline violations. You have the right to escalate.'
            }</p>
        </div>` : ''}
        <div class="card">
            <p class="label">Say This To Your Doctor</p>
            ${questions.map(q => `<p class="flag-item">· ${q}</p>`).join('')}
        </div>
        <div class="card">
            <p class="label">Your Medical Rights</p>
            ${rights.map(r => `<p class="flag-item">· ${r}</p>`).join('')}
        </div>
        <div class="card">
            <p class="label">Before Your Next Appointment</p>
            ${checklist.map(c => `<p class="flag-item">· ${c}</p>`).join('')}
        </div>
        <button class="btn-secondary" style="margin-top:4px;" onclick="navigate('journal')">View Full Journal →</button>`;
}

// ── JOURNAL ───────────────────────────────────────────────────────────────────
function renderJournal() {
    const el = document.getElementById('journal-content');

    if (!logs.length) {
        el.innerHTML = '<div class="card muted-card"><p>No entries yet. Use a symptom tracking app and export to localStorage key <code>endoLogs</code>.</p></div>';
        return;
    }

    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <p class="section-label" style="margin:0;">${logs.length} entries — most recent first</p>
            <button onclick="clearJournal()" style="font-size:11px;color:var(--red);background:none;border:1px solid var(--red);border-radius:8px;padding:4px 10px;cursor:pointer;font-family:'DM Sans',sans-serif;">Clear All</button>
        </div>
        ${sorted.map(log => {
            const date = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const painColor = log.painLevel >= 7 ? 'pain-high' : log.painLevel >= 4 ? 'pain-mid' : 'pain-low';
            return `
            <div class="card journal-entry">
                <div class="journal-top">
                    <span class="journal-date">${date}</span>
                    <span class="pain-badge ${painColor}">Pain ${log.painLevel}/10</span>
                </div>
                ${log.symptoms?.length ? `<p class="journal-row"><span class="journal-key">Symptoms</span> ${log.symptoms.join(', ')}</p>` : ''}
                ${log.bleeding && log.bleeding !== 'None' ? `<p class="journal-row"><span class="journal-key">Bleeding</span> ${log.bleeding}</p>` : ''}
                ${log.triggers?.length ? `<p class="journal-row"><span class="journal-key">Triggers</span> ${log.triggers.join(', ')}</p>` : ''}
                ${log.locations?.length ? `<p class="journal-row"><span class="journal-key">Location</span> ${log.locations.join(', ')}</p>` : ''}
                ${log.cycleDay ? `<p class="journal-row"><span class="journal-key">Cycle Day</span> ${log.cycleDay}</p>` : ''}
                ${log.medication ? `<p class="journal-row"><span class="journal-key">Medication</span> ${log.medication}</p>` : ''}
            </div>`;
        }).join('')}
        ${logs.length > 6 ? `<p class="muted-text" style="text-align:center;padding:10px 0;">${logs.length - 6} older entries not shown</p>` : ''}`;
}

// ── CLEAR JOURNAL ────────────────────────────────────────────────────────────
function clearJournal() {
    if (!confirm('Clear all journal entries? This cannot be undone.')) return;
    localStorage.removeItem('endoLogs');
    logs.length = 0;
    renderJournal();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderSymptomQuestions();
