# Policy: No Test or Dummy Data

As of July 22, 2025, this project must never use test data, dummy data, or hardcoded mock data in any part of the codebase. All data must be sourced from real backend/API or actual production data sources as per project architecture. The only exception is the use of designated production fallback assets (such as `/assets/logo_big.png` for images) when required for error handling or missing data.

- Do not use placeholder product info, fake products, or demo color swatches.
- Do not use mock data imports in any frontend or backend code.
- Remove or refactor any code that references local mock data, except for legacy fallback logic that is being actively replaced.
- If a fallback is required, use only production assets or error handling as specified in project documentation.

**This policy must be reflected in all future code reviews and PRs.**
