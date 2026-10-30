# FOCUSFLOW — Architecture & System Design

## 1. High-Level Architecture Overview

FOCUSFLOW is organized as an enterprise-grade TypeScript monorepo with three primary client/server applications and three shared internal packages:

```
                      ┌────────────────────────────┐
                      │    Chrome Extension (MV3)  │
                      │  - Observable Transitions  │
                      │  - Declarative Blocking    │
                      └─────────────┬──────────────┘
                                    │
                                    │ (Sync via REST / JSON)
                                    ▼
┌────────────────────────────┐    ┌────────────────────────────┐    ┌────────────────────────────┐
│      React Web Client      │───▶│    Express API Gateway     │───▶│   PostgreSQL Database      │
│  - Focus Timer & Dashboard │    │  - Helmet & CORS Security  │    │  - Prisma ORM (17 Models)  │
│  - Analytics & AI Coach    │    │  - Zod Validation Pipeline │    │  - Relations & Indices     │
└────────────────────────────┘    └─────────────┬──────────────┘    └────────────────────────────┘
                                                │
                                                ▼
                                  ┌────────────────────────────┐
                                  │      AI Coach Engine       │
                                  │  - Structured JSON Output  │
                                  │  - Gemini / LLM Backend    │
                                  └────────────────────────────┘
```

## 2. Monorepo Organization

- **`apps/web`**: Single Page Application built with React 19, Vite, Tailwind CSS, Lucide icons, Zustand, and React Router.
- **`apps/api`**: RESTful backend service built on Node.js, Express, TypeScript, Helmet, and Prisma ORM.
- **`apps/extension`**: Google Chrome Extension (Manifest V3) monitoring observable short-form video feed transitions and executing website blocking during active focus sprints.
- **`packages/shared-types`**: Canonical domain models, interfaces, and API response contracts.
- **`packages/validation`**: Zod validation schemas for authentication, focus sessions, reels syncing, and consent.
- **`packages/shared-utils`**: Pure, cross-environment helper functions (duration formatting, domain sanitization, fatigue scoring).

## 3. Communication Patterns

- **Web Client ➔ API**: Authenticated HTTP REST requests utilizing Bearer JWT tokens.
- **Extension ➔ Content Scripts**: Native Chrome messaging (`chrome.runtime.sendMessage`).
- **Extension ➔ API**: Periodic background batch synchronization using Chrome Alarms API (`chrome.alarms`).
- **API ➔ Database**: Prisma Client querying PostgreSQL with prepared statements and foreign key integrity.
