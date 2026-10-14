# Public site

Node.js 20.9 or newer, and pnpm 10. The panel should proxy this domain to the Node process. `pnpm start` listens on the `PORT` environment variable, or port 3000 when `PORT` is not set.

```bash
cd /path/to/valterix-furniture
pnpm install --frozen-lockfile
cp .env.example .env.production
pnpm build
PORT=3000 pnpm start
```

`.env.production` stays on the server. It is not in Git. After a later `git pull`, run `pnpm install --frozen-lockfile`, `pnpm build`, and restart the Node process. Change `.env.production` only when the API address changes, then build again.
