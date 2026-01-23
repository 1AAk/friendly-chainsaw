# Security Baseline

- **Secrets**
  - Never commit keys or tokens.
  - Vite env vars must use the `VITE_` prefix and are treated as public.

- **Content**
  - Use mock or demo data only.
  - Do not embed real API keys in UI examples.

- **Publishing**
  - Verify no `.env` or temp files are committed.
  - Keep `.gitignore` and `.dockerignore` up to date.

If backend or external APIs are added later, extend this file with concrete rules.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
