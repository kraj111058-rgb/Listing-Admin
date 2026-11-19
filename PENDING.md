# PENDING.md — Pending Tasks & Cross-Module Integrations

This file tracks all pending cross-module integrations, future tasks, and module migration checklists for **OneListy Admin Panel**.

---

## 📌 1. States & City Module (`public.states`, `public.cities`)

### 🔗 Listings Module Migration Integration:
When the `listings` table is created and migrated to Supabase:
- [ ] **Foreign Key Relationships**:
  - `listings.city_id -> cities.id`
  - `listings.state_id -> states.id`
- [ ] **Cities Table Relational Listing Count (`listings_count`)**:
  - File: `src/services/location.service.ts` (`getCities`)
  - Update query to include relational count:
    ```typescript
    .select("*, state:states!cities_state_id_fkey(*), listings(count)", { count: "exact" })
    ```
  - Display live count in `CitiesTable.tsx` under the "Listing Count" column badge.
- [ ] **LocationStats Total Listings Counter (`totalListings`)**:
  - File: `src/services/location.service.ts` (`getLocationStats`)
  - Replace hardcoded `0` with live server-side count:
    ```typescript
    supabase.from("listings").select("*", { count: "exact", head: true })
    ```

---

## 🚀 2. Upcoming Modules (Pending Migration from Mock Data)

- [ ] **Listing Categories Module** (`src/pages/category/Category.tsx`)
- [ ] **Listings Core Module** (`src/pages/listings/Listings.tsx`, `ListingDetails.tsx`)
- [ ] **Services & Products** (`src/pages/services-products/ServicesProducts.tsx`)
- [ ] **Services & Products Inquiries** (`src/pages/inquiries/ServicesProductsInquiries.tsx`)
- [ ] **Listing FAQs** (`src/pages/faqs/ListingFaqs.tsx`)
- [ ] **Advertisements Management** (`src/pages/advertisements/Advertisements.tsx`)
- [ ] **Dashboard Real Data Analytics** (`src/pages/dashboard/Dashboard.tsx`)
