import styles from "./static-frame.module.css";

// Static single-file apps live in public/ and render inside this frame, so the
// root layout (and its nav) wraps them like every other route.
export function StaticFrame({ src, title }: { src: string; title: string }) {
  return <iframe className={styles.frame} src={src} title={title} />;
}
