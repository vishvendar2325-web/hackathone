# FOCUSFLOW — REST API Reference (v1)

## Base URL
`/api/v1`

---

## 1. System & Health

### `GET /api/v1/health`
Checks backend operational status.
- **Auth**: None
- **Response**:
```json
{
  "success": true,
  "message": "FOCUSFLOW API is running"
}
```

### `GET /api/v1/health/diagnostics`
Returns system uptime, environment, and module status.
- **Auth**: None
- **Response**:
```json
{
  "success": true,
  "message": "FOCUSFLOW API is running",
  "environment": "development",
  "uptimeSeconds": 142,
  "timestamp": "2026-10-30T14:10:00.000Z",
  "modules": {
    "database": "PostgreSQL + Prisma configured",
    "extensionBridge": "Manifest V3 sync ready",
    "aiCoach": "Gemini / LLM pipeline configured"
  }
}
```

---

## 2. Standard Response Envelope
All API endpoints conform to a standardized JSON structure:

### Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation"
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_SERVER_ERROR",
    "message": "Descriptive message",
    "details": { ... }
  }
}
```
