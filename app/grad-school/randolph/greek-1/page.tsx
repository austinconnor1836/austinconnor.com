import type { Metadata } from "next";

import {
  formatLongDate,
  getGreekQuestionSections,
  getLastUpdated,
  getMeeting,
} from "@/lib/greek-questions";
import styles from "./greek.module.css";

const meeting = getMeeting();

export const metadata: Metadata = {
  title: { absolute: `Questions for ${meeting.professor}` },
  description: `${meeting.student}'s questions for ${meeting.nextMeeting} · ${meeting.course}`,
  robots: { index: false, follow: false, nocache: true },
  openGraph: null,
};

export default function GreekQuestionsPage() {
  const sections = getGreekQuestionSections();
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const updated = getLastUpdated();

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>{meeting.course}</p>
      <h1 className={styles.title}>
        Questions for {meeting.professor}{" "}
        <span lang="grc" className={styles.greek}>
          ἐρωτήματα
        </span>
      </h1>
      <p className={styles.meta}>
        From <strong>{meeting.student}</strong> · next meeting{" "}
        <strong>{meeting.nextMeeting}</strong>
      </p>
      <p className={styles.meta}>
        {meeting.bundle}: {meeting.topics}
      </p>
      <hr className={styles.rule} />

      {total > 0 ? (
        sections.map((section, si) => (
          <section key={si} className={styles.section}>
            {section.heading && <h2 className={styles.sectionHeading}>{section.heading}</h2>}
            {/* Headed sections (e.g. "Unit 2 G2E Sentences") reference exercise
                numbers themselves, so they aren't renumbered. */}
            <ol className={section.heading ? `${styles.list} ${styles.unnumbered}` : styles.list}>
              {section.items.map((q, i) => (
                <li key={i} className={styles.q}>
                  <p className={styles.qText}>{q}</p>
                </li>
              ))}
            </ol>
          </section>
        ))
      ) : (
        <p className={styles.empty}>No questions yet. Check back before the meeting.</p>
      )}

      <p className={styles.foot}>
        {total} {total === 1 ? "question" : "questions"} · last updated{" "}
        <time dateTime={updated}>{formatLongDate(updated)}</time>
      </p>
    </main>
  );
}
