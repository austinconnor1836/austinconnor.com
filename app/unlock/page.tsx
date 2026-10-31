import type { Metadata } from "next";
import { Suspense } from "react";

import { DEFAULT_NEXT, safeNext } from "@/lib/grad-school-auth";
import styles from "./unlock.module.css";

export const metadata: Metadata = {
  title: { absolute: "Passcode required" },
  description: "This page is private.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: null,
};

export default function UnlockPage({ searchParams }: PageProps<"/unlock">) {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Private page</p>
        <h1 className={styles.title}>Enter the passcode</h1>
        <p className={styles.lede}>
          This page is shared by link. If you were sent one, the passcode is the part after{" "}
          <code className={styles.code}>?key=</code>.
        </p>
        <Suspense fallback={<UnlockForm next={DEFAULT_NEXT} error={false} />}>
          <UnlockFormFromParams searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function UnlockFormFromParams({ searchParams }: Pick<PageProps<"/unlock">, "searchParams">) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return <UnlockForm next={safeNext(first(params.next))} error={first(params.error) === "1"} />;
}

function UnlockForm({ next, error }: { next: string; error: boolean }) {
  return (
    <form className={styles.form} method="post" action="/unlock/verify">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="passcode" className={styles.label}>
        Passcode
      </label>
      <input
        id="passcode"
        name="passcode"
        type="password"
        className={styles.input}
        autoComplete="current-password"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
        autoFocus
        aria-invalid={error || undefined}
        aria-describedby={error ? "passcode-error" : undefined}
      />
      {error ? (
        <p id="passcode-error" className={styles.error} role="alert">
          That passcode isn&rsquo;t right. Check it and try again.
        </p>
      ) : null}
      <button type="submit" className={styles.button}>
        Unlock
      </button>
    </form>
  );
}
