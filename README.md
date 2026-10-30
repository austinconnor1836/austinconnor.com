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
