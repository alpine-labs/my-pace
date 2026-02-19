# MyPace — Travel PT Expert Recommendations — Execution Plan

## Background
A board-certified PT / exercise physiologist reviewed the MyPace app (targeting older adults) and identified critical safety gaps, missing exercises, and enhancement opportunities. This plan prioritizes their recommendations for implementation.

---

## Approach
Implement changes in three tiers: **Critical Safety** (must-ship), **Clinical Enhancements** (high-value), and **Travel & Engagement** (differentiators). Each tier builds on the previous.

---

## Tier 1 — Critical Safety (Must-Ship)

### 1. Medical Disclaimer Modal
- Add a full-screen modal on first app launch with medical disclaimer text
- Require user acknowledgment checkbox before proceeding
- Store acknowledgment in SQLite `users` table
- Cover: not a substitute for medical advice, consult physician, stop if symptoms

### 2. PAR-Q Health Screening Questionnaire
- Add a 7-question Physical Activity Readiness Questionnaire after disclaimer
- If any "Yes" answers → show "Consult your doctor" advisory (non-blocking)
- Store responses in a new `health_screening` table
- Re-prompt annually or on user request from Settings

### 3. RPE / Talk Test Guidance on Walking Screen
- Add a simple RPE prompt (1-10 scale) after each walk log
- Display the "Talk Test" guidance on the walking timer screen
- Add `rpe_rating` and `felt_symptoms` fields to `walk_log` table
- Show a symptom checklist (dizziness, chest discomfort, shortness of breath) post-walk

### 4. Warm-Up / Cool-Down Prompts
- Add a warm-up prompt screen before walking timer starts (marching, ankle circles, heel raises)
- Add a cool-down prompt after walk completes (slow walk, stretching)
- Make prompts dismissible but shown by default
- Add user setting to disable warm-up/cool-down prompts

### 5. Exercise Safety Warnings
- Add `contraindications` and `precautions` fields to `Exercise` type
- Update **Toe Touches**: add seated alternative warning, dizziness caution
- Update **Neck Stretches**: add "never rotate in full circles" warning
- Update **Standing Balance**: emphasize chair/wall support is REQUIRED
- Display warnings prominently on exercise detail screen

---

## Tier 2 — Clinical Enhancements

### 6. Add Fall Prevention Exercises (5-8 new)
- Tandem Stand (heel-to-toe standing)
- Sit-to-Stand (no hands)
- Lateral Weight Shifts
- Tandem Walking (heel-to-toe walking)
- Step-Ups (using bottom stair step)
- Add new category: "Fall Prevention" in exercise catalog
- Include appropriate contraindications/precautions for each

### 7. Add Core & Functional Exercises (4-6 new)
- Seated Core Rotation
- Pelvic Tilts
- Seated Knee Extension
- Hip Abduction (Seated)
- Calf Stretch
- Chin Tucks (postural)

### 8. Rest Day Guidance
- Walking program: recommend 5-6 days/week (not daily)
- Add "rest day" concept to walking program data
- Add re-entry guidance: "If you miss 2+ days, resume at previous week's goal"
- Add illness recovery guidance: "After illness, start 1-2 weeks back"

### 9. Fiber & Fluid Tracking
- Add `fiber_g` to nutrition tracking (USDA API already provides this)
- Add a standalone fluid/water intake tracker (cups per day)
- Update daily targets: fiber 25g, fluid 64oz defaults
- Add `fluid_log` table or field to daily tracking

### 10. Walking Program Tuning
- Week 2: reduce from 8 min to 7 min (less aggressive jump)
- Week 12: reduce from 35 min to 32 min (safer finish)
- Add `travel_friendly` and `equipment_needed` fields to Exercise type

---

## Tier 3 — Travel & Engagement

### 11. Travel Mode
- Add `travel_mode` toggle in Settings
- When active: filter exercises to `travel_friendly: true` only
- Walking program switches to "Maintenance Mode" (15-20 min flexible goal)
- Simplified nutrition tracking option

### 12. Hotel Room Workout Routine
- Create curated "Hotel Room Workout" (10-15 min routine)
- Include warm-up, strength, balance, flexibility, cool-down
- Add "In-Flight Exercises" category (ankle circles, seated knee lifts, etc.)
- Travel walking tips content

### 13. Gentle Engagement / Milestones
- Replace streak-based messaging with positive weekly summaries
- Add achievement milestones (first walk, 7 walks, program graduate, etc.)
- Use encouraging (not guilt-inducing) notification language
- Weekly summary view: "4 of 7 days — Great job!"

### 14. Caregiver / Care Circle Sharing
- Add "Care Circle" concept: share weekly summaries with family/caregiver
- Weekly email report: walking totals, exercise frequency
- Inactivity alert: notify caregiver if no activity for 3+ days
- Shareable milestone achievements

---

## Notes & Considerations
- The PT expert stated they would **not recommend the app to patients** without Tier 1 (safety) implemented
- Fall prevention exercises (#6) are the #1 clinical reason older adults need exercise programs
- Protein tracking was called out as an excellent choice for this population
- The existing exercise catalog and walking program are fundamentally sound
- Exercise images are still missing (placeholder) — not addressed in this plan
- Caregiver sharing (#14) requires cloud sync (Supabase) which is currently optional
