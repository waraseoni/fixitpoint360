<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Version Control

## Branches
- `main` — production/stable only. Vercel auto-deploys from this branch.
- `develop` — integration branch for ongoing work. New features branch from `develop`
  and are merged back via pull request.
- Feature branches: `feature/<slug>`, fix branches: `fix/<slug>`.

## Commit messages (Conventional Commits)
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — tooling/maintenance (no production change)
- `docs:` — documentation only
- `refactor:` — code change with no behavior change
- `style:` — formatting, no logic change
- `test:` — adding/fixing tests
- `perf:` — performance improvement

Format: `<type>(<scope>): <summary>` e.g. `feat(documents): add print view`.
Keep the summary under 72 chars, imperative mood, no trailing period.

## Releases
- Bump `version` in `package.json` and add a `## [x.y.z]` entry in `CHANGELOG.md` on every release.
- Tag releases as `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) and push tags:
  `git push origin main --tags`

## Verification before commit
- Run `npm run lint` and `npm run typecheck` before committing.
- Never commit `.env*` files, secrets, or backup archives (`*.7z`, `*.zip`).
