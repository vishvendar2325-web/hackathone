# FOCUSFLOW — AI Focus Coach & Digital Wellbeing

> **Phase 1: Project Foundation, Architecture & Development Environment**

FOCUSFLOW is an AI-powered productivity platform and behavioral digital wellbeing companion designed specifically for school, college, and university students. It empowers students to understand their screen habits, reduce short-form video doomscrolling (Instagram Reels, YouTube Shorts, Facebook Reels), execute deep study blocks, and build resilient academic momentum.

---

## 1. Problem Statement

Students lose between 2 to 5 hours daily to compulsive short-form video consumption. Algorithms are mathematically optimized for dopamine retention, resulting in:
- Rapid attention span decay and cognitive fragmentation.
- Procrastination on critical study sprints and exam preparation.
- Existing screen-time apps relying on binary lockouts without behavioral understanding, engaging accountability, or student consent.

---

## 2. Technology Stack

### Frontend (`apps/web`):
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui design language
- **State Management**: Zustand
- **Data Fetching & Cache**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router
- **Visuals & Charts**: Recharts + Lucide React + Motion

### Backend (`apps/api`):
- **Runtime**: Node.js + Express.js + TypeScript
- **Architecture**: Clean Architecture (Controllers, Services, Routes, Middleware)
- **Validation**: Zod
- **Security**: Helmet + CORS + Centralized Error Handling
- **Authentication**: JWT Bearer Tokens + bcrypt

### Database (`apps/api/prisma`):
- **Engine**: PostgreSQL
- **ORM**: Prisma Client v6

### Chrome Extension (`apps/extension`):
- **Standard**: Chrome Extension Manifest V3
- **Languages**: TypeScript + React popup
- **APIs**: Chrome Tabs, Windows, Idle, Storage, Alarms, and Declarative Net Request for focus site blocking

### AI Integration:
- **Engine**: Google Gemini API / OpenAI API via server-side proxy
- **Output**: Structured JSON actionable recommendations

---

## 3. Monorepo Folder Structure

```
focusflow/
│
├── apps/
│   ├── web/                     # React 19 + Vite Frontend SPA
│   │   ├── src/
│   │   │   ├── components/      # UI, layout, dashboard, timer, reels, ai
│   │   │   ├── pages/           # 12 core application pages
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # Axios API client
│   │   │   ├── store/           # Zustand stores (Auth, Focus, Reels)
│   │   │   └── utils/           # Utility helpers (cn)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                     # Node.js + Express Backend Service
│   │   ├── src/
│   │   │   ├── config/          # Centralized configuration
│   │   │   ├── controllers/     # Request handlers (HealthController, etc.)
│   │   │   ├── middleware/      # Error, Auth, and Zod middleware
│   │   │   ├── routes/          # REST route definitions (/api/v1)
│   │   │   └── index.ts         # Server entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma    # 17 PostgreSQL models
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── extension/               # Chrome Extension (Manifest V3)
│       ├── manifest.json        # MV3 manifest with Declarative Net Request
│       ├── src/
│       │   ├── background/      # Service worker & sync alarms
│       │   ├── content/         # Non-invasive observers (IG, YT, FB)
│       │   ├── tracking/        # Reels counter & screen counter engines
│       │   ├── blocking/        # Focus distraction blocker engine
│       │   ├── storage/         # Typed Chrome storage
│       │   └── popup/           # Popup interface
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared-types/            # Canonical TypeScript interfaces & enums
│   ├── validation/              # Shared Zod validation schemas
│   └── shared-utils/            # Pure formatting & fatigue calculators
│
├── docs/
│   ├── ARCHITECTURE.md          # Monorepo topology & communication design
│   ├── DATABASE.md              # Prisma entity dictionary & privacy policies
│   ├── API.md                   # REST API documentation & health endpoint
│   ├── SECURITY.md              # Security hardening & zero-PII principles
│   └── DEVELOPMENT_SETUP.md     # Windows 11 PowerShell setup guide
│
├── .cursor/
│   └── rules/
│       └── focusflow.mdc        # Cursor AI engineering directives
├── AGENTS.md                    # Autonomous agent constitution & rules
├── .gitignore                   # Monorepo ignore patterns
├── .env.example                 # Root environment template
├── package.json                 # Monorepo workspaces & scripts
└── README.md                    # Project documentation
```

---

## 4. Getting Started (Windows 11 & PowerShell)

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Environment Variables
```powershell
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
```

### Step 3: Prisma Schema Generation
```powershell
npm run prisma:generate
```

### Step 4: Run Development Server
```powershell
# Runs full-stack server with Express API + Vite Frontend on port 3000
npm run dev
```

### Development Scripts Available from Root:
- `npm run dev:web`: Starts only the web frontend
- `npm run dev:api`: Starts only the Express backend
- `npm run dev:extension`: Watches and builds the Chrome extension
- `npm run build:web`: Builds web bundle
- `npm run build:api`: Compiles API TypeScript
- `npm run build:extension`: Compiles Chrome extension
- `npm run lint`: Verifies TypeScript types across the codebase

---

## 5. Health Check Endpoint

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health" -Method Get
```

**Response**:
```json
{
  "success": true,
  "message": "FOCUSFLOW API is running"
}
```

---

## 6. Implementation Status (Phase 1 Completed)

- [x] Monorepo architecture configured with npm workspaces.
- [x] Shared packages: `@focusflow/shared-types`, `@focusflow/validation`, `@focusflow/shared-utils`.
- [x] Express backend configured with Helmet, CORS, centralized error handling, and `GET /api/v1/health`.
- [x] Prisma database schema with all 17 models, foreign keys, unique constraints, and privacy-first design.
- [x] Chrome Extension (Manifest V3) with background worker, non-invasive content scripts, and distraction blocker.
- [x] React 19 web application with routing across all 12 requested starter pages and dashboard UI.
- [x] Cursor AI engineering rules (`AGENTS.md`, `.cursor/rules/focusflow.mdc`).
- [x] Complete technical documentation in `docs/`.
