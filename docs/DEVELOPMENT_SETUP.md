# FOCUSFLOW — Local Development Setup (Windows 11 & PowerShell)

## Prerequisites
- **Node.js**: v20+ or v22+
- **npm**: v10+
- **Code Editor**: Cursor AI or VS Code
- **Browser**: Google Chrome
- **OS**: Windows 11 (PowerShell)

---

## 1. Initial Repository Setup

Open PowerShell in your project directory:

```powershell
# Clone the repository
git clone <repo-url> focusflow
cd focusflow

# Install root & workspace dependencies
npm install
```

---

## 2. Environment Configuration

Copy the example environment files:

```powershell
# Copy root environment variables
Copy-Item .env.example .env

# Copy API environment variables
Copy-Item apps/api/.env.example apps/api/.env
```

---

## 3. Database Setup (Prisma + PostgreSQL)

Configure your `DATABASE_URL` in `.env`, then run:

```powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to PostgreSQL database
npx prisma db push --schema=apps/api/prisma/schema.prisma
```

---

## 4. Running the Development Environment

### Start Full-Stack App (Web + Backend on port 3000):
```powershell
npm run dev
```

### Or Start Services Individually:
```powershell
# Start Web Application (Vite)
npm run dev:web

# Start Backend API (Express + TypeScript)
npm run dev:api

# Watch and Build Chrome Extension
npm run dev:extension
```

---

## 5. Loading Chrome Extension into Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** in the top-right corner.
3. Click **Load unpacked**.
4. Select the `focusflow/apps/extension` folder.
5. The **FOCUSFLOW** icon will appear in your Chrome toolbar.

---

## 6. Verification Commands

```powershell
# Verify TypeScript Compilation across packages
npm run lint

# Test Backend Health Endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health" -Method Get
```
