import type { Metadata } from "next";

import { StaticFrame } from "../static-frame";

export const metadata: Metadata = {
  title: "Go Trainer",
  description: "An endless, difficulty-graded baduk (Go) puzzle trainer.",
};

export default function GoPage() {
  return <StaticFrame src="/go/index.html" title="Go Trainer" />;
}
