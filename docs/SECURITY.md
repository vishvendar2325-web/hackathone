# FOCUSFLOW — Security & Privacy Architecture

## 1. Zero-PII Tracking Policy
- **No Keystroke Logging**: The Chrome extension contains zero input listeners.
- **No Screen Capture / OCR**: Neither extension nor web app captures screenshots or video frames.
- **No Private Message / Comment Scraping**: Content scripts do not access DOM nodes containing text messages, DMs, captions, or profiles.
- **Observable Feed Transitions Only**: Transition counters trigger only upon visible video container switches in foreground viewports.

## 2. API & Network Security
- **Helmet Middleware**: Configures secure HTTP headers to mitigate cross-site scripting (XSS) and clickjacking.
- **CORS Allowlist**: Restricts cross-origin resource sharing to designated client origins.
- **Zod Validation Barrier**: Strict schema validation terminates malformed payloads before execution reaches controller handlers.
- **Password Hashing**: Bcrypt with minimum 10 salt rounds.
- **JWT Authorization**: Stateless Bearer tokens signed with 256-bit cryptographically secure secrets.

## 3. Student & Consent Controls
- **Explicit Opt-in**: Tracking is inactive by default until the student agrees on the consent screen.
- **Parental / Counsellor Sharing**: High-level aggregated productivity statistics are viewable by parents or counsellors ONLY if the student explicitly toggles consent in their Privacy Settings.
