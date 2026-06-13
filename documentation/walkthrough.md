# CMP v1.1 Core Loop Walkthrough

I have successfully generated the core codebase for the Church Management Platform (CMP) v1.1 according to your specifications. The application features a mobile-first, premium PWA aesthetic backed by Next.js, Tailwind CSS, and a robust offline-first architecture using Dexie.js, Zustand, and Supabase.

## What was Accomplished

### 1. Robust Database Schema (Supabase)
Created `schema.sql` at the root of the project ensuring all your architectural invariants:
- **Period-Bound Entities**: All tables enforce data isolation via `period_id`.
- **Many-to-Many IAM**: A fixed `user_role_enum` with junction tables ensuring explicit capability assignments.
- **Hierarchy Constraints**: Implemented a PostgreSQL trigger (`check_org_hierarchy_depth`) validating that organization structures never exceed 2 levels (Bidang → Sub-Bidang).
- **Separation Guards**: Implemented triggers ensuring the Penopang Program unit is never the same as the Penanggung Jawab Program unit (`PJP.unit_id != PP.unit_id`).
- **Double-Entry Financial Guards**: Implemented `check_journal_posting` ensuring a Journal can only transition to `POSTED` if `total_debit == total_credit` and all line items map to a valid Chart of Accounts (`coa_id` is not null). Modifications are locked down after posting.

### 2. Next.js App Initialization
The Next.js App Router has been successfully initialized in the workspace root with TypeScript and Tailwind CSS. The app features:
- A responsive `layout.tsx` optimized for mobile views with a fixed bottom navigation bar (`Navigation.tsx`).
- Integrated styling leveraging modern Tailwind CSS concepts and CSS variables for a premium, clean design.

### 3. Offline-First PWA Architecture
We adopted the SPA-like token-based flow you requested, integrating IndexedDB and Zustand:
- **[supabase.ts](file:///d:/PROJECT/FLOW/src/lib/supabase.ts)**: Configured client-side persistent sessions.
- **[db.ts](file:///d:/PROJECT/FLOW/src/lib/db.ts)**: Configured `dexie` local database stores for Offline `programs` and `journals` tracking sync status.
- **[useAppStore.ts](file:///d:/PROJECT/FLOW/src/store/useAppStore.ts)**: Established global state using `zustand` to manage the active period, current user, and offline status.
- **[OfflineManager.tsx](file:///d:/PROJECT/FLOW/src/components/OfflineManager.tsx)**: Intercepts network connectivity changes to alert the UI and orchestrate sync actions when online.

### 4. Core Application Loop Modules
The MVP interfaces with dummy presentation data have been established demonstrating the UI/UX:
- **[Dashboard](file:///d:/PROJECT/FLOW/src/app/page.tsx)**: A welcome screen routing authenticated and unauthenticated users.
- **[Auth / Login](file:///d:/PROJECT/FLOW/src/app/auth/login/page.tsx)**: Secure credential login mapped directly to Supabase Auth.
- **[Organization Setup](file:///d:/PROJECT/FLOW/src/app/organization/page.tsx)**: Management view enforcing the 2-level unit structure.
- **[Program Planning](file:///d:/PROJECT/FLOW/src/app/programs/page.tsx)**: Tracking program draft states and budgets.
- **[General Ledger](file:///d:/PROJECT/FLOW/src/app/ledger/page.tsx)**: Double-entry financial journal tracking with clear visual indicators for POSTED vs DRAFT statuses.

## Next Steps
You can spin up the development server by running:
```bash
npm run dev
```

To fully test offline capabilities and synchronization, you will need to apply the provided `schema.sql` to your Supabase instance, insert the generated `.env.local` keys, and wire the local Dexie mutations with Supabase remote sync logic.
