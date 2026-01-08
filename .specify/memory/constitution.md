<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: 0.0.0 → 1.0.0 (MAJOR - initial constitution creation)

  Modified Principles: N/A (new constitution)

  Added Sections:
  - I. Spec-Driven Development
  - II. Security First (NON-NEGOTIABLE)
  - III. Code Quality
  - IV. User Experience
  - V. Data Integrity
  - Technology Standards
  - API Contract
  - Authentication Flow
  - Non-Negotiables

  Removed Sections: N/A (template placeholders replaced)

  Templates Status:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (user stories, requirements aligned)
  - .specify/templates/tasks-template.md: ✅ Compatible (web app structure matches)

  Follow-up TODOs: None
-->

# Phase II Full-Stack Web Application Constitution

Panaversity Hackathon II - Task Management System

## Core Principles

### I. Spec-Driven Development

All specifications MUST be written before code implementation begins.

- Feature specifications document user stories, acceptance criteria, and edge cases
- Implementation plans define technical approach and architecture decisions
- Task lists break work into trackable, parallelizable units
- Changes to requirements MUST update specs first, then code
- Spec-Kit Plus methodology governs all documentation in `specs/` directory

**Rationale**: Specifications prevent scope creep, ensure alignment, and create traceable decisions.

### II. Security First (NON-NEGOTIABLE)

Security is not optional. Every feature MUST implement these controls:

- **User Isolation**: ALL database queries MUST filter by authenticated `user_id`
- **JWT Verification**: ALL protected routes MUST verify JWT token signature
- **User ID Validation**: Token `user_id` MUST match URL `{user_id}` parameter
- **Password Security**: Passwords MUST be hashed with bcrypt (NEVER plain text)
- **Token Handling**: JWTs transmitted via `Authorization: Bearer <token>` header only

**Violations are blocking**: Code that bypasses security controls MUST NOT be merged.

### III. Code Quality

Type safety and validation are mandatory across the entire stack:

- **Frontend (TypeScript)**:
  - Strict mode enabled (`"strict": true` in tsconfig.json)
  - All props, state, and API responses fully typed
  - No `any` types without explicit justification
  - Server Components by default; `'use client'` only when interactivity required

- **Backend (Python)**:
  - Type hints on all function signatures and return values
  - Pydantic/SQLModel validation for all request/response schemas
  - Async route handlers (`async def`) for all endpoints

**Rationale**: Type safety catches errors at compile time, reducing runtime bugs.

### IV. User Experience

The application MUST provide responsive, feedback-rich interactions:

- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints (sm/md/lg/xl)
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages (not raw exceptions)
- **Confirmation**: Destructive actions (delete) MUST require user confirmation

**Rationale**: Poor UX leads to user abandonment regardless of technical correctness.

### V. Data Integrity

Persistent storage with enforced relationships and optimized queries:

- **Neon PostgreSQL**: All data stored in serverless PostgreSQL
- **Foreign Keys**: `tasks.user_id` references `users.id` with ON DELETE CASCADE
- **Indexes** (CRITICAL for performance):
  - `tasks.user_id` - filtered on EVERY query
  - `tasks.completed` - filtered for active/done views
  - `users.email` - used in authentication queries
- **Timestamps**: `created_at` and `updated_at` on all mutable entities

**Rationale**: Proper indexing prevents O(n) table scans at scale.

## Technology Standards

The following technology stack is MANDATORY:

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Frontend Framework | Next.js | 16+ with App Router |
| Frontend Language | TypeScript | Strict mode |
| Frontend Styling | Tailwind CSS | Utility-first |
| Frontend Auth | Better Auth | Session + JWT issuance |
| Backend Framework | FastAPI | Async Python |
| Backend ORM | SQLModel | SQLAlchemy + Pydantic |
| Database | Neon PostgreSQL | Serverless |
| JWT Library | python-jose | HS256 algorithm |

**Monorepo Structure**:
```
project-root/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── specs/             # Spec-Kit Plus specifications
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
└── .specify/          # Templates and scripts
```

## API Contract

All task operations use this exact endpoint pattern:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get single task |
| PUT | `/api/{user_id}/tasks/{id}` | Full update of task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

**Data Model**:

```
users
├── id: str (PK, UUID from Better Auth)
├── email: str (UNIQUE, INDEXED)
├── name: str
├── password_hash: str (bcrypt)
└── created_at: datetime

tasks
├── id: int (PK, auto-increment)
├── user_id: str (FK → users.id, INDEXED)
├── title: str (1-200 chars, required)
├── description: str (max 1000 chars, optional)
├── completed: bool (default: false, INDEXED)
├── created_at: datetime
└── updated_at: datetime
```

## Authentication Flow

The authentication system operates in 5 steps:

```
1. LOGIN
   User submits credentials → Better Auth validates → Creates session + JWT

2. API CALL
   Frontend extracts JWT → Attaches to request header
   Authorization: Bearer <token>

3. VERIFICATION
   Backend extracts token → Verifies signature with BETTER_AUTH_SECRET
   Invalid/expired → 401 Unauthorized

4. AUTHORIZATION
   Backend decodes token → Extracts user_id from 'sub' claim
   Compares with URL {user_id} → Mismatch → 403 Forbidden

5. DATA FILTERING
   Query includes WHERE user_id = authenticated_user_id
   Returns ONLY that user's data
```

**Environment Variables**:

| Variable | Location | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |
| `BETTER_AUTH_SECRET` | Both | JWT signing/verification (MUST match) |
| `BETTER_AUTH_URL` | Frontend | Auth service endpoint |
| `DATABASE_URL` | Backend | Neon PostgreSQL connection string |
| `CORS_ORIGINS` | Backend | Allowed frontend origins |

**CRITICAL**: `BETTER_AUTH_SECRET` MUST be identical in frontend and backend environments.

## Non-Negotiables

These rules have NO exceptions:

1. **JWT Verification**: Every protected route MUST call `verify_jwt_token()` dependency
2. **User ID Match**: Token `sub` claim MUST equal URL `{user_id}` or return 403
3. **Query Filtering**: Every SELECT/UPDATE/DELETE MUST include `WHERE user_id = X`
4. **Password Hashing**: `password_hash` column only; never store or log plain passwords
5. **Index on user_id**: Task table MUST have index on `user_id` column
6. **TypeScript Strict**: `tsconfig.json` MUST have `"strict": true`
7. **Server Components Default**: Only add `'use client'` when hooks/events required

## Success Criteria

The project is complete when ALL of these are verified:

- [ ] All 5 features working (Create, View, Update, Delete, Mark Complete)
- [ ] Multi-user authentication functional (register, login, logout)
- [ ] User isolation verified (User A cannot see/modify User B's tasks)
- [ ] Data persists across browser sessions (Neon PostgreSQL)
- [ ] Responsive UI works on mobile, tablet, and desktop
- [ ] Deployed to production (Vercel for frontend, Render/Railway for backend)
- [ ] Zero security vulnerabilities in code review
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)
- [ ] No Python type errors (mypy or pyright clean)
- [ ] No console errors in browser

## Governance

This constitution supersedes all other project documentation.

**Amendment Process**:
1. Propose change with rationale
2. Update constitution version (semantic versioning)
3. Update all affected specs and templates
4. Document change in Sync Impact Report

**Compliance**:
- All pull requests MUST verify constitution compliance
- Constitution Check in `plan.md` MUST pass before implementation
- Violations require explicit justification in Complexity Tracking table

**Version Policy**:
- MAJOR: Backward-incompatible principle changes
- MINOR: New principles or expanded guidance
- PATCH: Clarifications and typo fixes

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
