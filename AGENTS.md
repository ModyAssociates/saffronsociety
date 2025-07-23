# AGENTS.md

## Overview
This document provides guidance for AI coding agents and human contributors working on the Saffron Society project. It covers where to work, how to contribute, style and migration guidelines, and how to validate and present changes.

---

## 1. Key Files & Folders
- **Frontend:** `project/src/`
  - **Pages:** `project/src/pages/`
  - **Components:** `project/src/components/`
  - **Context:** `project/src/context/`
  - **Services:** `project/src/services/`
  - **Utils:** `project/src/utils/`
  - **Assets:** `project/src/assets/`
- **API/Backend:** `netlify/functions/`
- **Configuration:**
  - `project/package.json`, `project/vite.config.ts`, `netlify.toml`, `.env`
  - `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`
- **Docs & Policies:** `README.md`, `NO_TEST_DATA_POLICY.md`, `SETUP.md`, `AUTHENTICATION_SETUP.md`

---

## 2. Contribution & Style Guidelines
- **React:** Use functional components, React 18+ patterns, and hooks.
- **Styling:** Use Tailwind CSS utility classes. No inline styles unless necessary.
- **Animation:** Use Framer Motion for UI motion.
- **Data:** Never use test, mock, or dummy data. All data must come from the real backend/API (see `NO_TEST_DATA_POLICY.md`).
- **TypeScript:** Use strict typing. Prefer interfaces/types for props and API responses.
- **Imports:** Use ESM imports only (no CommonJS).
- **Error Handling:** Always provide user feedback for errors and loading states.
- **Accessibility:** All images must have meaningful alt text or `alt=""` if decorative.
- **Docs:** Update or create documentation for new workflows, conventions, or major changes.

---

## 3. Migration & Refactoring
- **Legacy to Modern:**
  - Migrate any class components to functional components.
  - Move any inline or CSS file-based styles to Tailwind utility classes.
  - Replace any remaining mock data with real API calls.
- **API Layer:**
  - All product data must flow through Netlify Functions and the Printify API.
  - If adding new data sources, update `netlify/functions/` and `project/src/services/` accordingly.

---

## 4. Validating Changes
- **Lint:**
  - Run `npm run lint` in both root and `project/`.
- **Build:**
  - Run `npm run build` in `project/` to ensure the app builds cleanly.
- **Dev Server:**
  - Use `npx netlify dev` to run the full stack locally.
- **Manual Testing:**
  - Test all user flows (auth, product browsing, cart, checkout, account management).
- **No Test Data:**
  - Ensure no mock/test data is present in any code or commit.

---

## 5. Agent Workflow & PR Guidelines
- **Context Gathering:**
  - Explore relevant files and folders before making changes.
  - Use semantic and grep search to find related code and documentation.
- **Documentation:**
  - Update or create relevant docs (`README.md`, `SETUP.md`, etc.) when workflows or conventions change.
- **PR Formatting:**
  - Clearly describe what was changed and why.
  - Reference related files, functions, and policies.
  - Note any migrations, refactors, or breaking changes.
- **Code Presentation:**
  - Use concise, well-formatted diffs and code blocks.
  - Avoid repeating unchanged code in PRs; focus on what was added/removed/modified.

---

## 6. Special Policies
- **No Test Data:** See `NO_TEST_DATA_POLICY.md` for strict rules.
- **Environment Variables:** Never commit secrets. Use `.env` and `.env.example` for configuration.
- **Accessibility:** Follow best practices for accessible UI.

---

For any questions, see `README.md` or ask a project maintainer.
