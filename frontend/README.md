# Bail Eligibility Check — Frontend

Vite + React + i18next starter for the BNSS §187 eligibility flow.

## Get running

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. The dev server proxies `/api/*` to
`http://localhost:3000` (Person 1's Express server) — change the target in
`vite.config.js` if theirs runs elsewhere.

## What's here

- `src/App.jsx` — state machine: form → loading → result/error
- `src/components/QuestionFlow.jsx` — the 4-question flow (offence type,
  arrest date, chargesheet status, district), one screen per question
- `src/components/ResultScreen.jsx` — eligible/waiting result with a
  day-counter ring
- `src/components/LanguageSwitcher.jsx` — EN / HI / ML toggle
- `src/i18n/locales/*.json` — translation strings. **The Hindi and Malayalam
  translations here are a first draft — get a native speaker (ideally your
  mentor or the lawyer contact) to review the legal terms before the demo.**
- `src/api/client.js` — calls `POST /api/check-eligibility`. Set
  `USE_MOCK = true` at the top of this file to build/demo the UI without the
  backend running.

## Next steps (in rough priority order)

1. **Confirm the API contract with Person 1** — this was scaffolded from the
   planning conversation, not the live `server.js`. Check field names match
   exactly: `offenceType`, `arrestDate`, `chargesheetFiled`, `district` in,
   `{ eligible, daysRemaining, reason }` out.
2. Swap the free-text district `<input>` in `QuestionFlow.jsx` for a
   `<select>` once Person 3's DLSA directory data is ready.
3. Wire the two `alert('TODO...')` buttons in `ResultScreen.jsx` to the real
   PDF download and DLSA map link.
4. Add offline caching (service worker) once the happy path works — the app
   is meant to run for users with patchy connectivity, so this matters for
   the pitch, but don't build it before the core flow works end to end.
5. Only after all of the above: polish transitions/animations. Keep it
   minimal — this app is for people who may not be comfortable with
   smartphones, so restraint beats flourish here.

## Design notes

- Palette: deep indigo (`--color-primary`) for trust/authority, warm gold
  (`--color-accent`) for the primary action, teal-green vs. rust for
  eligible/waiting states — deliberately not a red/green traffic-light
  pairing, since "not yet eligible" isn't a failure state for the user.
- One question per screen, large tap targets (64px option cards, 52px
  buttons), icon + text on every choice — built for low digital literacy on
  small/low-end screens, not for information density.
- The day-counter ring on the result screen is the one bit of visual
  flourish — it's there because BNSS §187 eligibility *is* fundamentally a
  countdown, so the metaphor is doing real work, not just decorating.
