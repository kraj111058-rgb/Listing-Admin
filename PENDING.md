# PENDING.md — Pending Tasks, Cross-Module Integrations & Architecture Rules

This file is the single reference tracking all pending tasks, cross-module connections between **Listing-Admin** and **Listing-Web**, and critical architecture rules to remember.

---

## 🧠 0. Critical Architecture Rules & Conventions (Always Remember)

Whenever working on any feature across **Listing-Admin** or **Listing-Web**, strictly adhere to these rules:

1. **SelectOption Standard**:
   - Every select option must strictly follow `{ value: string; label: string }`.
   - `value` MUST always be the record's UUID `id` (e.g. `cat.id`, `st.id`, `c.id`) when connecting to relational database foreign keys. Never pass `name` as `value`.
2. **Zero Dead Code**:
   - Immediately delete legacy mock arrays, dummy lists, and unused interfaces from `dummyData.ts` as soon as Supabase query hook is wired.
3. **Zero Visual Regression**:
   - Preserve 100% of Tailwind classes, layouts, badges, animations, and typography when swapping mock data with live Supabase data.
4. **No Client-side Counting**:
   - Never fetch all records to calculate lengths in JS. Use Supabase relational queries:
     ```typescript
     .select("*, child_table(count)", { count: "exact" })
     ```
     Or count queries with `{ count: "exact", head: true }`.
5. **Search Query Sanitization**:
   - Always sanitize search terms before passing to PostgREST `.or(...)`:
     ```typescript
     const clean = query.replace(/[,()]/g, "").trim();
     ```
6. **No Dead File Uploads (Storage Rule)**:
   - Files / images must only be uploaded to Supabase Storage on form submit, **never** on file picker input change.
   - Always auto-delete old/replaced images on edit, and remove attached images when deleting a record.
7. **TypeScript Verification**:
   - Run typecheck before declaring any task complete:
     ```bash
     node ./node_modules/typescript/bin/tsc --noEmit --incremental false
     ```
8. **Documentation Rule (Never Skip)**:
   - Whenever a new table, column, RLS policy, storage bucket, or trigger is created, **immediately update `docs-supabase/DATABASE_SCHEMA.md`**.

---

## ✅ Completed Modules Status

| Module | Supabase Table | Listing-Admin | Listing-Web | Live Features |
| :--- | :--- | :--- | :--- | :--- |
| **1. Users** | `public.users` | ✅ Full CRUD | ✅ Live Auth Flow | Auth trigger, Roles (`admin`, `user`), Email Confirm |
| **2. Blog Categories** | `public.blog_categories` | ✅ Full CRUD | ✅ Live | RLS, Slug unique |
| **3. Blog Posts** | `public.blog_posts` | ✅ Full CRUD | ✅ Live | Views counter RPC, `blog-media` bucket |
| **4. Contact Inquiries** | `public.contact_inquiries` | ✅ Full CRUD | ✅ Live submit | Realtime updates, Public insert |
| **5. Banner Inquiries** | `public.banner_ad_inquiries`| ✅ Full CRUD | ✅ Live submit | Anti-spam partial unique indexes |
| **6. Subscription Plans** | `public.subscription_plans` | ✅ Full CRUD | ✅ Wizard Step-5 | 5 seed plans, limit counters |
| **7. States & Cities** | `public.states`, `public.cities`| ✅ Full CRUD | ✅ Live Dropdowns | 36 States + 18 Cities, Cascading |
| **8. Listing Categories**| `public.categories` | ✅ Full CRUD | ✅ Live Dropdowns | `onelisty/categories/` bucket, Slugs |

---

## 📌 1. User Authentication Flow (Listing-Web) — ✅ COMPLETED

**Status: ✅ Live Supabase Auth with Resend SMTP & Strict Email Verification**

### Completed Checklist:
- [x] **`src/proxy.ts`** (Next.js Routing Proxy):
  - Protected all `(private)/dashboard/*` routes → redirects unauthenticated visitors to `/login?redirectTo=...`.
  - Redirects already logged-in users away from `/login` and `/register` to `/dashboard`.
  - Automatically refreshes Supabase auth session token on every request.
- [x] **`src/services/auth/auth.service.ts`**:
  - `signIn(email, password)` → `supabase.auth.signInWithPassword()` + active status check.
  - `signUp(name, email, phone, password)` → `supabase.auth.signUp()` + duplicate phone check.
  - `signOut()` → `supabase.auth.signOut()`.
  - `forgotPassword(email)` → `supabase.auth.resetPasswordForEmail()`.
  - `resetPassword(newPassword)` → `supabase.auth.updateUser()`.
  - `resendVerificationEmail(email)` → `supabase.auth.resend()`.
  - `getCurrentUser()` → session + `public.users` profile.
- [x] **`src/app/auth/callback/route.ts`**:
  - Server route exchanging one-time auth code for session cookie and redirecting to targeted page.
- [x] **`src/services/auth/hooks/use-current-user.ts`**:
  - TanStack Query hook with key `["auth", "current-user"]`.
- [x] **Auth Form Migrations**:
  - `login-form.tsx` → real `signIn()` + "Email not confirmed" alert banner with Resend button.
  - `register-form.tsx` → real `signUp()` + "Check Your Email" card with Resend button.
  - `forgot-password-form.tsx` → real `forgotPassword()`.
  - `reset-password-form.tsx` → real `resetPassword()`.
- [x] **Dashboard Header & Web Header**:
  - `dashboard-topbar.tsx`: replaced hardcoded "Rahul Sharma" with real user name/email & wired real Sign Out.
  - `header.tsx`: dynamically renders "Dashboard" button when authenticated, or "Login" / "Register" when logged out.
- [ ] **Optional / Future**:
  - Google OAuth (`Continue with Google`) via `supabase.auth.signInWithOAuth({ provider: 'google' })`.

---

## 📌 2. Cross-Module Connections for Listings Module (`public.listings`)

When Module 8 (`public.listings`) is created:

### A. Database Layer (`08-listings.sql`):
- [ ] **Foreign Keys**:
  - `listings.category_id -> public.categories(id)` (ON DELETE RESTRICT or SET NULL)
  - `listings.state_id -> public.states(id)`
  - `listings.city_id -> public.cities(id)`
  - `listings.user_id -> public.users(id)` (Owner)
  - `listings.plan_id -> public.subscription_plans(id)`
- [ ] **Storage Bucket**:
  - `onelisty` bucket under folder `listings/` for listing photos, logo, and cover.

### B. Listing-Admin Updates:
- [ ] **Categories Table Relational Count (`listingCount`)**:
  - File: `Listing-Admin/src/services/category.service.ts` (`getCategories`)
  - Update query to:
    ```typescript
    .select("*, listings(count)", { count: "exact" })
    ```
  - Display live count in `CategoriesTable.tsx` under "Listing Count" column badge.
- [ ] **Cities Table Relational Count (`listings_count`)**:
  - File: `Listing-Admin/src/services/location.service.ts` (`getCities`)
  - Update query to:
    ```typescript
    .select("*, state:states!cities_state_id_fkey(*), listings(count)", { count: "exact" })
    ```
  - Display live count in `CitiesTable.tsx` under "Listing Count" column badge.
- [ ] **LocationStats Total Listings Counter**:
  - File: `Listing-Admin/src/services/location.service.ts` (`getLocationStats`)
  - Replace hardcoded `0` with server count query:
    ```typescript
    supabase.from("listings").select("*", { count: "exact", head: true })
    ```

### C. Listing-Web Updates:
- [ ] **Listing Wizard (`src/components/features/dashboard/listing-wizard/`)**:
  - `step-1-basic-info.tsx`: already sends `category_id` = `cat.id` (UUID).
  - `step-2-contact-location.tsx`: already sends `state_id` = `st.id` and `city_id` = `c.id` (UUID).
  - `step-5-choose-plan.tsx`: sends `plan_id` = `plan.id` (UUID).
  - Wizard form submission: insert complete listing payload into `public.listings`.
- [ ] **Live Listings Pages**:
  - `src/components/features/listings/listings-content.tsx` & `listings-sidebar.tsx`: replace mock data with live listings service.
  - `src/components/features/categories/categories-grid.tsx`: show live `{cat.listings_count}` from relational count.
  - `src/components/features/home/browse-city.tsx`: show live `{city.listings_count}`.
  - `src/app/(private)/dashboard/my-listings/page.tsx`: show user's own listings filtered by `user_id = auth.uid()`.

---

## 📌 3. Upcoming Admin Modules (Future Roadmap)

- [ ] **Module 8: Listings Core** (`src/pages/listings/Listings.tsx`, `ListingDetails.tsx`)
- [ ] **Module 9: Services & Products** (`src/pages/services-products/ServicesProducts.tsx`)
- [ ] **Module 10: Services & Products Inquiries** (`src/pages/inquiries/ServicesProductsInquiries.tsx`)
- [ ] **Module 11: Listing FAQs** (`src/pages/faqs/ListingFaqs.tsx`)
- [ ] **Module 12: Customer Reviews Management**
- [ ] **Module 13: Advertisements Management** (`src/pages/advertisements/Advertisements.tsx`)
- [ ] **Module 14: Dashboard Live Analytics** (replace mock cards with live Supabase aggregation counts)

---

## 📌 4. DATABASE_SCHEMA.md Update Queue

Whenever tables are created, append to `docs-supabase/DATABASE_SCHEMA.md`:
- [ ] Table 10: `public.listings`
- [ ] Table 11: `public.listing_services`
- [ ] Table 12: `public.listing_faqs`
- [ ] Table 13: `public.listing_inquiries`
- [ ] Table 14: `public.listing_reviews`
- [ ] Table 15: `public.advertisements`
