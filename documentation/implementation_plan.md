# Church Management Platform (CMP) v1.1 Implementation Plan

This document outlines the proposed implementation plan for creating the CMP v1.1 core loop. The application will be a mobile-first, offline-capable PWA built with Next.js (App Router), Tailwind CSS, and backed by Supabase.

## User Review Required

> [!IMPORTANT]
> Please review the proposed database schema, specifically the constraints and triggers ensuring the invariants, such as the double-entry accounting guard and PJP/PP separation.

## Open Questions

> [!WARNING]
> **Offline-First Synchronization**
> Supabase does not have built-in offline-first synchronization out-of-the-box for its JS client (like Firebase or WatermelonDB does). To achieve robust PWA offline capabilities with sync recovery, I propose using **IndexedDB (via Dexie.js) paired with Zustand for state management**, or alternatively integrating **PowerSync** (which works seamlessly with Supabase for offline-first local SQL). 
> *Question: Which offline-first strategy do you prefer? (e.g., standard Dexie+Zustand custom sync, or PowerSync?)*

> [!WARNING]
> **Authentication Flow**
> Next.js App Router with Supabase usually requires server-side cookie management (`@supabase/ssr`). However, true offline-first PWAs often rely on client-side session tokens. 
> *Question: Should we prioritize traditional server-rendered secure cookies, or a fully client-side SPA-like auth flow that is more friendly to offline modes?*

## Proposed Changes

### 1. Database Schema (Supabase)
We will create a foundational `schema.sql` file containing all definitions.

**Enums & Types**
- `user_role_enum`
- `program_status_enum`
- `journal_status_enum`

**Core Tables**
- `periods`: ID, name, start_date, end_date, is_active
- `organization_units`: ID, name, parent_id (self-referencing, max 2 levels enforced by check or trigger).
- `memberships`: ID, user_id, period_id.
- `positions`: ID, membership_id, unit_id, role, period_id (Unique constraint on user per period).
- `user_role`: junction table for IAM.
- `programs`: ID, period_id, name, status, pjp_unit_id, pic_membership_id, budget.
- `program_responsibility_pp`: junction table for multiple PP assignments to a program.
- `coa` (Chart of Accounts): ID, code, name, type.
- `journals`: ID, period_id, reference_no, status, date.
- `journal_lines`: ID, journal_id, coa_id, debit, credit.

**Constraints & Triggers (Enforcing Invariants)**
- *Hierarchy Constraint*: A trigger to ensure `organization_units` depth does not exceed 2 (Bidang -> Sub-Bidang).
- *Separation Guard*: A trigger on `program_responsibility_pp` ensuring `unit_id != program.pjp_unit_id`.
- *Double-Entry Constraint*: A deferred constraint or trigger on `journal_lines` / `journals` checking `SUM(debit) = SUM(credit)` before a journal can be `POSTED`.
- *COA Guard*: A check constraint or trigger ensuring `journal_lines.coa_id` is NOT NULL when the parent journal's status changes to `POSTED`.

### 2. Next.js PWA Initialization
- Run `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- Configure `next-pwa` for service worker generation and manifest setup.
- Set up Tailwind CSS for a mobile-first premium aesthetic.

### 3. Application Architecture
- `src/app`: Next.js App Router pages (Auth, Setup, Programs, Ledger).
- `src/lib/supabase`: Supabase client initialization (Client and Server).
- `src/store`: Zustand stores for local state and optimistic UI updates.
- `src/components`: Reusable UI components conforming to the mandated aesthetic.

## Verification Plan

### Automated Tests
- Database tests (using pgTAP if available or Supabase local testing) to verify:
  - Journal entry rejects `POSTED` status if unbalanced or missing COA.
  - PJP cannot be assigned as PP.
  - Max hierarchy level is 2.

### Manual Verification
- **Auth Flow**: Run app locally and verify login/logout and role-based redirects.
- **Offline Capabilities**: Turn off network in DevTools, try to create a program, restore network, and verify sync.
- **UI/UX**: Check mobile responsiveness and premium aesthetic.
