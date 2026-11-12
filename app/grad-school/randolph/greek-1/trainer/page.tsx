import type { Metadata } from "next";

import { StaticFrame } from "../../../../static-frame";

export const metadata: Metadata = {
  title: "H&Q Greek trainer",
  description: "Flashcards, verb and noun drills, and a vocabulary quiz for Hansen & Quinn.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: null,
};

// Behind the /grad-school passcode (proxy.ts), as is the static page it frames.
export default function GreekTrainerPage() {
  return (
    <StaticFrame
      src="/grad-school/randolph/greek-1/trainer/index.html"
      title="H&Q Greek trainer"
    />
  );
}
