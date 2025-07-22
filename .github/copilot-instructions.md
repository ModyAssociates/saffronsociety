# Policy: No Test or Dummy Data
Never use test data, dummy data, or hardcoded mock data in any part of the codebase. All data must be sourced from the real backend/API or actual production data sources as per project architecture. The only exception is the use of designated production fallback assets (such as `/assets/logo_big.png` for images) when required for error handling or missing data.

- Do not use placeholder product info, fake products, or demo color swatches.
- Do not use mock data imports in any frontend or backend code.
- Remove or refactor any code that references local mock data, except for legacy fallback logic that is being actively replaced.
- If a fallback is required, use only production assets or error handling as specified in project documentation.

**This policy must be reflected in all future code reviews and PRs.**
# Copilot Instructions for saffronsociety
You are working on Saffron Society, a React + Vite + Tailwind t-shirt e-commerce SPA deployed to Netlify.
Use functional React 19 components, Tailwind 4 utility classes, and Framer-Motion for subtle UI motion.
Backend calls are Netlify Functions (Node 18), which proxy the Printify v1 REST API using fetch and environment variables PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID.
Keep everything ESM, no CommonJS imports.

## Project Overview
- **Type:** Full-stack T-shirt ecommerce app
- **Frontend:** React (TypeScript, Vite, Tailwind CSS, Framer Motion)
- **Backend/API:** Netlify Functions (Node.js, Printify API proxy)
- **Data Source:** Printify API (real products/colors/images)


## Key Architecture & Data Flow
- **Frontend** (`project/src/`):
  - Main entry: `main.tsx`, app shell in `App.tsx`
  - Pages in `pages/`, components in `components/`, context in `context/`
  - Product data is loaded via `fetchPrintifyProducts` in `services/printify.ts`, which calls the Netlify function
  - Color swatches and images are rendered in `ProductCard.tsx` and `ProductDetails.tsx`
- **API Layer**:
  - Netlify function: `netlify/functions/printify-products.js` fetches product data from Printify, extracts color and image info, and returns a normalized payload
  - Environment variables for Printify API token/shop are set in `netlify.toml` and injected by Netlify dev


## Key Guidelines
1. Make sure to evaluate the components you're creating, and whether they need 'use client'
2. Images should contain meaningful alt text unless they are purely for decoration. If they are for decoration only, a null (empty) alt text should be provided (alt="") so that the images are ignored by the screen reader.
3. Follow Next.js best practices for data fetching, routing, and rendering
4. Use proper error handling and loading states
5. Optimize components and pages for performance

## Developer Workflows
- **Start Dev Environment:**
  - `npx netlify dev` from repo root (serves frontend and functions, injects env vars)
  - Vite dev server runs on port 5174 (see `netlify.toml` for port config)
- **Build:**
  - `npm run build` in `project/` (Vite build)
- **API Debugging:**
  - Edit `printify-products.js` to log/inspect Printify API responses
  - Use browser console logs in `ProductCard.tsx` and `printify.ts` for image/color debugging
- **Image Handling:**
  - Product images may be string URLs or objects with a `src` property; always normalize to string before rendering
  - Fallback to a local placeholder image (`assets/logo_big.png`) if image fails to load
- **Color Swatches:**
  - Colors are extracted as hex codes from Printify API and passed through to frontend
  - Color mapping for names/hex in `printify.ts` (see `COLOR_NAME_TO_HEX`)

## Project-Specific Patterns
- **API fallback:** If the Printify API fails, only use production fallback assets (such as `/assets/logo_big.png` for images). Do not use or add any mock product data or demo content.
- **Component conventions:**
  - Use Framer Motion for animations
  - Use Tailwind for all styling
  - Use context for cart state
- **Environment:**
  - All Printify secrets are managed via `netlify.toml` and injected by Netlify CLI

## Key Files/Directories
- `project/src/services/printify.ts` — Product fetching, color mapping
- `netlify/functions/printify-products.js` — API proxy/function
- `project/src/components/product/ProductCard.tsx` — Product card UI, image/color logic

- `netlify.toml` — Netlify/Printify config

## Example: Adding a New Product Source
- Add a new Netlify function in `netlify/functions/`
- Update `services/printify.ts` to fetch/normalize new data


---

If you update conventions or add new workflows, please update this file.
