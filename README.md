# austinconnor.com

Austin Connor's personal site. Next.js (App Router) + TypeScript, fully static, deployed on Vercel.

The 2023 Create React App + three.js version lives in git history before the `nextjs-rebuild` merge.

## Develop

```sh
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Where things live

| What | Where |
| --- | --- |
| Home page copy, projects, links | `content/site.ts` (fields set to `null` are TODOs and are hidden) |
| Greek questions (copied from Obsidian) | `content/grad-school/randolph/greek-1/questions.md` |
| Next meeting date / bundle / topics | `content/grad-school/randolph/greek-1/meeting.json` |
| "Last updated" date | `content/grad-school/randolph/greek-1/questions.meta.json` (written by the sync script) |

## Greek questions page

`/grad-school/randolph/greek-1` lists the questions for Prof. Cohen. It isn't linked from the site and carries `noindex`.
Each paragraph in the Obsidian note becomes one numbered question.

To publish the latest note:

```sh
npm run sync:greek          # copies the note; if it changed, commits + pushes to main
npm run sync:greek -- --dry # shows the diff, pushes nothing
```

The script pushes straight to `main` on purpose. It only ever touches the two content files above, and it works
in a temporary worktree, so your current branch and uncommitted changes are left alone. Vercel redeploys on the push.

Each week, edit `meeting.json` for the next meeting (commit it through a normal PR, or alongside a sync).

## Passcode gate for /grad-school/*

Everything under `/grad-school/` is locked by `proxy.ts` (Next 16's request interception file), which runs on every
request to those paths before any prerendered page is served. Logic lives in `lib/grad-school-auth.ts`.

- The passcode is the `GRAD_SCHOOL_PASSCODE` env var (Vercel → Settings → Environment Variables, Production + Preview).
  If it's missing, the pages stay locked. Austin's copy is in `~/.config/austinconnor/grad-school-passcode`.
- Share link: `https://austinconnor-com.vercel.app/grad-school/randolph/greek-1?key=<passcode>`. A correct `key` sets
  a 90-day httpOnly cookie and redirects to the same URL without `key`. A wrong one goes to `/unlock`.
- Without the cookie, visitors land on `/unlock?next=<path>`, a one-field form (case and surrounding spaces ignored).
- The cookie holds an HMAC of the passcode, not the passcode. To revoke every link and cookie, change the env var and
  redeploy.
- Local dev: `GRAD_SCHOOL_PASSCODE=... npm run dev`. The cookie is `Secure`, which browsers accept on `localhost`.
