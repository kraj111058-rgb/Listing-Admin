# AGENTS.md — AI Agent Guidelines for Listing-Admin

This file provides critical guidance and operational rules for AI assistants (Antigravity, Claude Code, Cursor, Copilot) working in this repository.

---

## 1. Single Source of Truth

Before creating new modules, modifying existing features, or writing database queries, you **MUST** read and strictly follow:
👉 **[`AI-CODING-RULEBOOK.md`](./AI-CODING-RULEBOOK.md)**

It defines the exact architectural patterns, Supabase query standards, TanStack Query hooks conventions, form workflows, and zero-dead-code rules established and verified in this codebase.

---

## 2. Essential Commands

```bash
# Start development server
npm run dev

# Run TypeScript type check (Run this before declaring any task complete)
node ./node_modules/typescript/bin/tsc --noEmit

# Run Vite production build (Verify complete bundle build)
node ./node_modules/vite/bin/vite.js build

# Run ESLint
npm run lint
```

---

## 3. Communication & User Workflow Guidelines

1. **User Communication Language**: Respond to the user in **Gujarati** unless requested otherwise.
2. **Permission Boundary**: Always explain planned modifications and get user confirmation before touching or editing project files (*"mne pucha vagar kai nay karto"*).
3. **Verification**: Always run `tsc --noEmit` and Vite build check to verify that no TypeScript errors or broken imports are introduced.

---

## 4. Architectural Quick Reference

```
Page (src/pages/)
  └── Feature Component (src/components/features/<module>/)
        └── Custom Hook (src/hooks/queries/)
              └── Service Layer (src/services/)
                    └── Supabase Client (src/lib/supabase.ts)
                          └── PostgreSQL Database / Supabase Storage
```

### Golden Rules:
- **No Client-side Counting**: Use Supabase relational queries (`.select("*, child(count)", { count: "exact" })`).
- **No Dead File Uploads**: Upload images to Supabase Storage strictly on form submit, never on file picker change.
- **Auto Clean Storage**: Delete replaced/removed images on edit and attached images on delete.
- **No Manual Loading Flags**: Derive `isPending` directly from TanStack Query mutations.
- **No Nested Try/Catch in Components**: Let custom hooks handle toasts and use `onSuccess` for callbacks.
- **Search Sanitization**: Sanitize search strings with `.replace(/[,()]/g, "").trim()` before passing to PostgREST `.or(...)`.
- **Duplicate Error Handling**: Catch Postgres code `23505` in services and format user-friendly messages for title and slug.
- **Clean Modal Resets**: Reset form fields on open (`if (item) reset(item) else reset(defaults)`).
- **Zero Console.log**: Remove all debugging statements before completing tasks.
