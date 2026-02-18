# TEJAS

**Tagline:** _Where speed meets focus._

TEJAS is a modern, dark-themed typing practice web app inspired by the clean experience of Monkeytype (visual inspiration only). Users can type immediately with no login barrier, view full analytics after every test, and optionally sign in to save results and access history.

## Features

- Instant typing screen at `/` (no forced auth)
- Unlimited tests for guests
- Modes: **30s / 60s / 120s**
- Character-level correctness rendering
- Exact caret behavior (`caretIndex = typed.length`)
- Timer starts on first keystroke
- Auto-navigation to results when timer ends
- Result analytics panel with:
  - WPM
  - Accuracy
  - Raw WPM
  - Character breakdown (correct / incorrect / extra / missed)
  - Consistency
  - Time
- Animated performance graph:
  - WPM (yellow line)
  - Raw speed (gray line)
  - Error markers (red dots)
- Firebase Auth:
  - Email/password login/register
  - Google OAuth login
  - Persistent auth session
- Firestore persistence for profile + saved test history
- Dashboard for authenticated users
- Keyboard shortcuts:
  - `Tab` / `Enter` → restart
  - `Ctrl + R` → restart
- Mobile responsive UI
- Loading states + toast notifications

## Tech Stack

- React + Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Framer Motion

## Firestore User Schema

`users/{uid}`

```json
{
  "uid": "string",
  "email": "string",
  "joinedAt": "timestamp",
  "bestWPM": 0,
  "averageAccuracy": 0,
  "testHistory": []
}
```

## Project Structure

```txt
src/
 components/
   TypingBox.jsx
   Caret.jsx
   Stats.jsx
   ResultGraph.jsx
 pages/
   Typing.jsx
   Result.jsx
   Login.jsx
   Register.jsx
   Dashboard.jsx
 firebase.js
 App.jsx
 main.jsx
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env
```

3. Fill Firebase variables in `.env`.

4. Start development server:

```bash
npm run dev
```

5. Build production bundle:

```bash
npm run build
```

## Notes

- Guests can always complete tests and view analytics.
- Save action is gated by authentication.
- If unauthenticated users are on the result screen, they will see:
  - “Sign in to save your result”
  - Login/Register/Continue without saving options.
