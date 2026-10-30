# AGENTS.md — FOCUSFLOW Engineering Guidelines

## Project Purpose
FOCUSFLOW is an AI-powered digital wellbeing and focus coach designed for students across schools, colleges, and universities. The platform helps users curb short-form video doomscrolling (Instagram Reels, YouTube Shorts, Facebook Reels), execute deep focus work blocks, and receive personalized productivity recommendations.

---

## Architecture Constitution & Monorepo Rules

1. **Always Use TypeScript**: Every file across `apps/web`, `apps/api`, `apps/extension`, and shared `packages/*` must be strictly typed.
2. **Clean Architecture & Separation of Concerns**:
   - **Controllers**: Handle HTTP request extraction, status codes, and JSON responses.
   - **Services**: Contain business logic, database queries, and external service calls.
   - **Routes**: Define URL paths, methods, and attach middleware pipelines.
   - **Validators**: Enforce Zod schemas before controllers receive execution.
3. **Validate All API Inputs**: Never accept raw or unparsed request payloads. Use `@focusflow/validation` schemas with `validateRequest`.
4. **Secure Authentication & Token Management**:
   - Use bcrypt for password hashing (minimum 10 salt rounds).
   - Use short-lived JWT access tokens and secure refresh mechanisms.
   - Never store raw passwords or plain secrets.
5. **Never Hardcode Secrets**:
   - Environment variables must be loaded via `dotenv` and read from `process.env`.
   - Never expose AI keys or database credentials in client-side code or browser extensions.
6. **Zero-PII & Ethical Tracking**:
   - Do NOT claim exact Reel or Shorts counts can be fetched via platform APIs.
   - Counts are treated strictly as **estimates** derived from observable viewport/container transitions.
   - Never inspect or capture captions, comments, messages, keystrokes, screenshots, or private content.
   - Tracking must be opt-in, transparent, and user-controllable.
7. **Clearly Label Demo Data**:
   - When offline or developing, mock data must be explicitly flagged with `(Demo Mode)` badges.
   - Never fake tracking data or claim non-existent measurements.
8. **Robust UI States**:
   - Every view must account for Loading, Empty, Error, and Success states.
9. **Respect Working Code**:
   - Inspect files before modifying them.
   - Avoid destructive full rewrites when localized edits suffice.

---

## Agent Pre-Implementation Checklist
Before making changes:
- [ ] Inspect existing files using appropriate read tools.
- [ ] Formulate a concise implementation plan.
- [ ] Identify necessary package dependencies.
- [ ] Ensure backward compatibility with existing modules.

## Agent Post-Implementation Checklist
After making changes:
- [ ] Verify TypeScript compilation with `npm run lint` or `tsc --noEmit`.
- [ ] Verify build execution with `npm run build`.
- [ ] Confirm backend health endpoint `GET /api/v1/health`.
- [ ] Report modified and created files clearly.
