# Listing-Admin — AI Coding Rulebook & Architectural Standard

> **Single Source of Truth** for architectural patterns, coding standards, Supabase API communication, TanStack Query management, and file conventions in this project.
> Any AI assistant or developer working on new or existing modules **MUST** strictly follow these rules to ensure zero dead code, consistent structure, robust error handling, and optimal performance.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Layered Architecture & Data Flow](#2-layered-architecture--data-flow)
3. [Directory Structure & Barrel Exports](#3-directory-structure--barrel-exports)
4. [Service Layer & Supabase API Rules](#4-service-layer--supabase-api-rules)
5. [TanStack Query (Hooks) Pattern](#5-tanstack-query-hooks-pattern)
6. [Types & Schema Validation](#6-types--schema-validation)
7. [Component & UI Rules (Zero Unused / Dead Code)](#7-component--ui-rules-zero-unused--dead-code)
8. [Supabase Storage & File Upload Pattern](#8-supabase-storage--file-upload-pattern)
9. [What NOT to Do (Strict DON'Ts)](#9-what-not-to-do-strict-donts)
10. [What to Do (Strict DOs)](#10-what-to-do-strict-dos)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite |
| **Language** | TypeScript (Strict mode enabled) |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS + `clsx` / `tailwind-merge` (`cn` helper) |
| **Component Primitives** | Base UI (`@base-ui/react`) + `cva` |
| **Icons** | Lucide React |
| **Backend & DB** | Supabase (PostgreSQL, Storage, Auth) |
| **Server State & Cache** | TanStack Query v5 (`@tanstack/react-query`) |
| **Form Handling** | React Hook Form |
| **Validation** | Zod (`@hookform/resolvers/zod`) |
| **Notifications** | Sonner (`toast`) |

---

## 2. Layered Architecture & Data Flow

Every feature module must strictly follow this unidirectional data flow:

```
Page (src/pages/)
  └── Feature Component (src/components/features/<module>/)
        └── Custom Query / Mutation Hook (src/hooks/queries/)
              └── Service Layer (src/services/)
                    └── Supabase Client (src/lib/supabase.ts)
                          └── PostgreSQL Database / Supabase Storage
```

### Core Responsibilities:
1. **Pages (`src/pages/`)**: Thin router pages. Responsible only for layout composition, page headers, breadcrumbs, and rendering feature components. Never contains heavy business logic or raw API calls.
2. **Feature Components (`src/components/features/`)**: Responsible for UI, tables, modals, filters, user interactions, and delegating actions to hooks.
3. **Custom Hooks (`src/hooks/queries/`)**: Owns server state, query keys, caching rules (`staleTime`), mutation calls, cache invalidation, and toast notifications.
4. **Service Layer (`src/services/`)**: Owns raw Supabase queries, server-side pagination, search string sanitization, relational joins, payload formatting, and Postgres error code translation.
5. **Types & Schemas (`src/types/`, `src/schemas/`)**: Source of truth for entity shapes, form schemas, API query parameters, and paginated responses.

---

## 3. Directory Structure & Barrel Exports

```
src/
├── components/
│   ├── common/                # Shared reusable components (DataTable, AlertModal, PopoverMenu, etc.)
│   ├── features/              # Feature-specific components
│   │   ├── blog/              # Blog feature components (BlogTable, BlogCategoryTable, Modals)
│   │   └── <new-feature>/     # Any new feature components
│   └── ui/                    # Base design primitives (button, badge, switch, tabs, etc.)
├── enums/                     # Central enum definitions (status enums, roles)
├── hooks/
│   ├── queries/               # TanStack Query custom hooks per domain (useBlogs.ts, useAuth.ts)
│   └── useDebounce.ts         # Shared utility hooks
├── lib/
│   ├── supabase.ts            # Supabase client & SUPABASE_CONSTANTS
│   └── utils.ts               # Formatting, slug generators, cn()
├── pages/                     # Routed pages (e.g. blog/BlogListPage.tsx, blog/BlogForm.tsx)
├── schemas/                   # Zod schemas for forms and validations
├── services/                  # Supabase service layer files (*.service.ts)
└── types/                     # TypeScript definitions (*.types.ts)
```

### Barrel Export Rules:
Every directory (`src/services/`, `src/hooks/queries/`, `src/types/`, `src/schemas/`) must maintain a clean `index.ts` file that re-exports all domain members:
```typescript
// src/services/index.ts
export * from "./blog.service"
export * from "./auth.service"
export * from "./storage.service"
```
Components should import from the top-level barrel paths (e.g. `import { blogService } from "@/services"` or `import { useBlogs } from "@/hooks/queries"`).

---

## 4. Service Layer & Supabase API Rules

All database communication lives strictly in `src/services/<domain>.service.ts`.

### 1. Server-Side Pagination, Filtering & Search
* Always compute server-side range:
  ```typescript
  const from = (page - 1) * pageLimit
  const to = from + pageLimit - 1
  ```
* **PostgREST Search Sanitization**: Always sanitize search strings to remove characters that break PostgREST `.or(...)` filter syntax (commas, parentheses):
  ```typescript
  if (search) {
    const cleanSearch = search.replace(/[,()]/g, "").trim()
    if (cleanSearch) {
      query = query.or(`title.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%`)
    }
  }
  ```
* Calculate `totalPages = Math.ceil(total / pageLimit)` and return a standardized `PaginatedResponse<T>`.

### 2. Zero Client-Side Aggregation (Use Relational Counts)
* **NEVER** fetch an entire table on the client just to count child rows.
* Always query child counts via Supabase relations directly in the parent query:
  ```typescript
  // Example: Getting categories with their live blog count
  let query = supabase
    .from(SUPABASE_CONSTANTS.DB_TABLES.BLOGS_CATEGORY)
    .select("*, blogs(count)", { count: "exact" })
  ```

### 3. Fast Dashboard Stats via `{ count: "exact", head: true }`
* For dashboard counters (e.g., Total, Published, Draft, Inactive), use `Promise.all` with `{ count: "exact", head: true }`.
* This returns the count from Postgres headers **without downloading table row payloads**, resulting in instant load times and minimal bandwidth usage.
  ```typescript
  const [totalRes, activeRes] = await Promise.all([
    supabase.from(TABLE).select("*", { count: "exact", head: true }),
    supabase.from(TABLE).select("*", { count: "exact", head: true }).eq("status", "Active"),
  ])
  ```

### 4. Foreign Key Joins
* Always use foreign key expansion in queries when related parent/category data is needed for display:
  ```typescript
  .select(`*, category:category_id (*)`)
  ```

### 5. Postgres Error Code 23505 Translation
* Unique constraint violations in Postgres return error code `"23505"`.
* Always provide a domain-specific error translation method in the service:
  ```typescript
  formatEntityError: (
    error: { code?: string; message: string; details?: string | null },
    payload?: { title?: string; slug?: string }
  ): Error => {
    if (error.code === "23505") {
      const raw = `${error.message} ${error.details || ""}`.toLowerCase()
      if (raw.includes("slug")) {
        return new Error(payload?.slug ? `Slug "${payload.slug}" already exists.` : "Slug already exists.")
      }
      if (raw.includes("title")) {
        return new Error(payload?.title ? `Title "${payload.title}" already exists.` : "Title already exists.")
      }
      return new Error("A record with this unique value already exists.")
    }
    return new Error(error.message)
  }
  ```
* Always invoke this formatter in `.create()` and `.update()` service methods:
  ```typescript
  if (error) throw entityService.formatEntityError(error, payload)
  ```

### 6. Timestamps & Enums
* Use central enums for status fields (e.g. `BlogStatus.PUBLISHED`, `BlogStatus.DRAFT`).
* Always pass `updated_at: new Date().toISOString()` on update calls.

---

## 5. TanStack Query (Hooks) Pattern

All React Query hooks live in `src/hooks/queries/use<Domain>.ts`.

### 1. Hierarchical Query Keys Object
Always define a central `*_QUERY_KEYS` object with `as const`:
```typescript
export const BLOG_QUERY_KEYS = {
  allBlogs: ["blogs"] as const,
  blogsList: (params?: BlogPostQueryParams) => ["blogs", "list", params] as const,
  blogStats: ["blogs", "stats"] as const,
  blogDetail: (id: string) => ["blogs", id] as const,
  allCategories: ["blog-categories"] as const,
  categoriesList: (params?: BlogCategoryQueryParams) => ["blog-categories", "list", params] as const,
  activeCategories: ["blog-categories", "active"] as const,
} as const
```

### 2. Cache Duration & Conditional Fetching
* Lists: `staleTime: 1000 * 60 * 2` (2 minutes).
* Dropdowns / Options: `staleTime: 1000 * 60 * 5` (5 minutes).
* Detail hooks **MUST** guard against empty IDs:
  ```typescript
  export const useBlogDetail = (id: string) => {
    return useQuery({
      queryKey: BLOG_QUERY_KEYS.blogDetail(id),
      queryFn: () => blogService.getBlogById(id),
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 5,
    })
  }
  ```

### 3. Mutual & Multi-Entity Cache Invalidation
* When creating, updating, or deleting an entity, invalidate all queries impacted by that change:
  ```typescript
  // When blog changes: invalidate blog list AND category list (because category's blog count changes!)
  onSuccess: () => {
    toast.success("Blog created successfully.")
    queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allBlogs })
    queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.allCategories })
  }
  ```
* When updating a single item, also invalidate its specific detail key:
  ```typescript
  queryClient.invalidateQueries({ queryKey: BLOG_QUERY_KEYS.blogDetail(id) })
  ```

### 4. Automatic Toast Notifications Inside Mutation Hooks
* Mutation hooks own their success and error notifications:
  * `onSuccess: () => { toast.success("...") }`
  * `onError: (error) => { toast.error(error.message) }`
* Do **NOT** duplicate `toast.success` or `toast.error` calls inside components.

---

## 6. Types & Schema Validation

### 1. Zod Schema as the Single Source of Truth
* All form schemas belong in `src/schemas/<domain>.schema.ts`.
* Infer form types directly using `z.infer<typeof schema>`:
  ```typescript
  export const blogCategorySchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    slug: z.string().trim().min(2, "Slug must be at least 2 characters"),
    status: z.enum(["Active", "Inactive"]),
  })
  export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>
  ```

### 2. Reuse Types with `Omit` and `Partial`
* Avoid redefining the same property fields in multiple interfaces.
* Derive payload types directly from the core entity type:
  ```typescript
  export type CreateBlogPostPayload = Omit<
    BlogPostData,
    "id" | "views" | "created_at" | "updated_at"
  >
  export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>
  ```

### 3. Standard Paginated Response
* Always extend or use `PaginatedResponse<T>` from `src/types/common.types.ts`:
  ```typescript
  export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageLimit: number
    totalPages: number
  }
  ```

---

## 7. Component & UI Rules (Zero Unused / Dead Code)

### 1. Reuse Common Components
Never write custom table wrappers, modals, or form inputs from scratch. Always reuse:
* `DataTable` (`@/components/common/DataTable`)
* `AlertModal` (`@/components/common/AlertModal`)
* `PopoverMenu` (`@/components/common/PopoverMenu`)
* `Modal` (`@/components/common/modal`)
* `InputWithLabel`, `SelectWithLabel`, `TextareaWithLabel`, `ImageUpload`

### 2. Search Debouncing & Page Reset
* Always debounce search inputs with `useDebounce(searchQuery, 400)` before passing to query hooks.
* Always reset `page` to `1` when search query or filter tab changes:
  ```typescript
  const debouncedSearch = useDebounce(searchQuery, 400)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])
  ```

### 3. Zero Redundant `useState` for Pending/Loading States
* **NEVER** declare manual loading states for mutations (e.g. `const [isLoading, setIsLoading] = useState(false)`).
* Always derive pending state directly from TanStack Query mutations:
  ```typescript
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog()
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog()
  const isPending = isCreating || isUpdating
  ```

### 4. Zero Nested `try / catch` in Components
* Mutation hooks already handle async rejection and trigger `onError` toasts.
* Do not wrap mutation calls in `try/catch` or use `console.error` inside component handlers.
* Handle post-success logic (like modal close, file cleanup, or redirection) cleanly inside the `onSuccess` callback:
  ```typescript
  deleteBlog(item.id, {
    onSuccess: () => {
      setDeleteModalItem(null)
    },
  })
  ```

### 5. Add / Edit Modal State Reset on Open
* Modals used for both "Create" and "Edit" must reset completely when toggled:
  ```typescript
  useEffect(() => {
    if (open) {
      if (item) {
        reset({ name: item.name, slug: item.slug, status: item.status })
      } else {
        reset({ name: "", slug: "", status: "Active" })
      }
    }
  }, [item, open, reset])
  ```

### 6. Navigation Rule
* `navigate(...)` must strictly happen in the `onSuccess` callback of a create or update mutation, never before completion.

### 7. DataTable Integration Standard
* Always pass `currentPage` (never `page`):
  ```typescript
  <DataTable
    columns={columns}
    data={items}
    isLoading={isLoading}
    currentPage={page}
    pageLimit={pageLimit}
    total={total}
    onPageChange={setPage}
    ...
  />
  ```
* **Dynamic Empty State**: Always differentiate between an empty dataset and a search/filter with zero matches using `hasActiveFilter`:
  ```typescript
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  emptyMessage={
    hasActiveFilter
      ? "No <items> found matching your criteria."
      : "No <items> found."
  }
  ```

### 8. Search Placeholder Exact Field Alignment
* The `searchPlaceholder` prop on `DataTable` must explicitly reflect the exact database fields searched in the service query (`query.or(...)`):
  ```typescript
  // Service searches: name, email, phone, subject, message
  searchPlaceholder="Search inquiries by name, email, phone, subject, or message..."
  ```
* Avoid generic or mismatched placeholders that mislead the user about what is searchable.

### 9. AlertModal Delete Safety & Loading State
* When using `AlertModal` for destructive actions, prevent premature dismissal while the mutation is in progress:
  ```typescript
  <AlertModal
    open={!!deleteModalItem}
    onOpenChange={(open) => {
      if (!isDeleting && !open) {
        setDeleteModalItem(null)
      }
    }}
    title="Delete <Item>?"
    description={`Are you sure you want to permanently delete "${deleteModalItem?.title}"? This action cannot be undone.`}
    confirmLabel={isDeleting ? "Deleting..." : "Delete <Item>"}
    confirmVariant="destructive"
    isLoading={isDeleting}
    onConfirm={handleConfirmDelete}
  />
  ```

---

## 8. Supabase Storage & File Upload Pattern

### 1. Upload ONLY on Form Submit
* **NEVER** upload files to Supabase Storage immediately when a user selects a file from the file picker.
* Keep the `File` object in local state (`useState<File | null>(null)`).
* Upload to Supabase Storage **ONLY** when the form is submitted:
  * If the user cancels or closes the browser, no orphan/unused files are left in storage.

### 2. Central Storage Folders
* Always use `SUPABASE_CONSTANTS.STORAGE.FOLDERS.*` instead of hardcoded strings:
  ```typescript
  await uploadFile({
    file: coverFile,
    folder: SUPABASE_CONSTANTS.STORAGE.FOLDERS.BLOG_COVERS,
  })
  ```

### 3. Storage Cleanup on Edit & Delete
* **On Edit**: If a user replaces an image or clears an existing image, collect the old image URL and delete it from Supabase Storage using `useRemoveFiles`:
  ```typescript
  if (isEdit && existingItem?.image && existingItem.image !== finalImageUrl) {
    filesToRemove.push(existingItem.image)
  }
  ```
* **On Delete**: When deleting a record, collect any attached image URLs and delete them from Supabase Storage after successful record deletion.

---

## 9. What NOT to Do (Strict DON'Ts)

1. **Don't fetch entire tables on the client to calculate counts** — use relational queries (`.select("*, child_table(count)", { count: "exact" })`).
2. **Don't download table rows for dashboard stats** — use `{ count: "exact", head: true }` in `Promise.all`.
3. **Don't use un-sanitized search queries in PostgREST** — always clean search strings (`replace(/[,()]/g, "").trim()`) before passing to `.or(...)`.
4. **Don't leave raw Postgres error codes visible to users** — catch error code `23505` in the service and return friendly messages for duplicate titles/slugs.
5. **Don't duplicate toast notifications** — let custom mutation hooks trigger `toast.success` and `toast.error`.
6. **Don't create redundant `useState(false)` for loading flags** — use `isPending` directly from mutation hooks.
7. **Don't wrap mutation calls in nested `try/catch` or use `console.error`** in components.
8. **Don't upload files on file selection** — hold `File` in state and upload strictly on submit.
9. **Don't leave orphan files in storage** — clean up replaced files on edit, and clean up attached files on delete.
10. **Don't hardcode table names, bucket names, or folder paths** — always use `SUPABASE_CONSTANTS`.
11. **Don't use `any` type** — strictly define and reuse TypeScript interfaces.
12. **Don't pass `page` to DataTable** — the active page prop is strictly `currentPage`.
13. **Don't use static `emptyMessage`** — distinguish between empty tables and filtered zero-matches with `hasActiveFilter`.
14. **Don't misalign search placeholders** — make sure placeholder text reflects the actual fields searched in `query.or(...)`.
15. **Don't leave `AlertModal` unguarded during deletion** — always check `!isDeleting` on dismiss.
16. **Don't leave `console.log` or dead/unused code in any file**.

---

## 10. What to Do (Strict DOs)

1. **Do follow the Layered Architecture**: `Page` ➔ `Feature Component` ➔ `Custom Hook` ➔ `Service` ➔ `Supabase`.
2. **Do export through barrel `index.ts` files** for clean, organized imports.
3. **Do debounce search inputs** with `useDebounce` and reset pagination to page 1 on search/filter changes.
4. **Do use `currentPage` and dynamic `emptyMessage` in DataTable**.
5. **Do align `searchPlaceholder` with exact backend searched fields**.
6. **Do guard `AlertModal` with `!isDeleting` and dynamic `confirmLabel`**.
7. **Do reset modal form state on open** to prevent edit data leaking into create modals.
8. **Do ensure database-level UNIQUE constraints** on fields like `slug` and `title` in Supabase.
9. **Do navigate only in `onSuccess`** callbacks.
10. **Do reuse existing common components** (`DataTable`, `AlertModal`, `PopoverMenu`, `InputWithLabel`).
11. **Do use TypeScript utility types** (`Omit`, `Partial`) to keep type definitions DRY.
