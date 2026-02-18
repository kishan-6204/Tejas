# TEJAS

> **Where speed meets focus.**

TEJAS is a premium dark, keyboard-first typing practice app built with React + Vite, Tailwind CSS, Firebase, Firestore, and Framer Motion.

## Features

- Email/password auth (register/login/logout)
- Protected dashboard + typing routes
- Typing test modes: **30s / 60s / 120s**
- Live character-level correctness highlighting
- Blinking caret and smooth page animations
- WPM, accuracy, error, and timer stats
- Save best WPM + accuracy history in Firestore
- Restart shortcut: **Ctrl + R**
- Theme toggle (dark/light)
- Optional keypress sound
- Responsive UI + loading/error states

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Framer Motion

## Project Structure

```txt
src/
 ├─ components/
 │   ├─ Caret.jsx
 │   ├─ LoadingSpinner.jsx
 │   ├─ ProtectedRoute.jsx
 │   ├─ Stats.jsx
 │   ├─ ThemeToggle.jsx
 │   ├─ TypingBox.jsx
 │   └─ WordRow.jsx
 ├─ context/
 │   ├─ AuthContext.jsx
 │   └─ ThemeContext.jsx
 ├─ hooks/
 │   └─ useTypingTest.js
 ├─ pages/
 │   ├─ Dashboard.jsx
 │   ├─ Login.jsx
 │   ├─ Register.jsx
 │   └─ Typing.jsx
 ├─ firebase.js
 ├─ App.jsx
 ├─ main.jsx
 └─ index.css
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Fill Firebase credentials in `.env`.

4. Run development server:

```bash
npm run dev
```

5. Build production:

```bash
npm run build
```

## Firestore User Document

`users/{uid}` stores:

- `uid`
- `email`
- `joinedAt`
- `bestWPM`
- `averageAccuracy`
- `lastResult`
- `accuracyHistory`

## Notes

- Timer starts on first keystroke.
- WPM formula: `(correctChars / 5) / minutes`
- Accuracy formula: `(correct / totalTyped) * 100`
