"use client";

import { useEffect, useId, useRef, useState } from "react";

import { site } from "@/content/site";
import styles from "./nav.module.css";

type NavLink = { label: string; href: string; external?: boolean; note?: string };

// Internal routes first, then the off-site things the home page already points to.
// `/go` is a static page served by a rewrite, so every entry is a plain anchor.
const LINKS: NavLink[] = [
  { label: "Home", href: "/", note: "About Austin" },
  { label: "Go Trainer", href: "/go", note: "Baduk puzzles" },
  {
    label: "Greek questions",
    href: "/grad-school/randolph/greek-1",
    note: "Randolph · Hansen & Quinn",
  },
  {
    label: "Dead Reckoning",
    href: site.writing.href,
    external: true,
    note: "Essays on Substack",
  },
  { label: "Gainplate", href: "https://gainplate.app", external: true, note: "iOS app" },
  { label: "GitHub", href: site.contact.github.href, external: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Keep the closed panel out of the tab order. Set as a DOM property (not a JSX attr)
  // so React never serializes it to an empty-string boolean attribute.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  // While open: Escape closes, the page behind can't scroll, and focus moves in.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className={`${styles.bars} ${open ? styles.barsOpen : ""}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.toggleLabel}>Menu</span>
      </button>

      <div
        className={`${styles.backdrop} ${open ? styles.open : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        ref={panelRef}
        id={panelId}
        className={`${styles.panel} ${open ? styles.open : ""}`}
        aria-label="Site navigation"
      >
        <p className={styles.panelHead}>{site.name}</p>
        <ul className={styles.links}>
          {LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                className={styles.link}
                href={link.href}
                onClick={() => setOpen(false)}
                {...(link.external && { target: "_blank", rel: "noreferrer noopener" })}
              >
                <span className={styles.linkLabel}>
                  {link.label}
                  {link.external && (
                    <span className={styles.ext} aria-hidden="true">
                      ↗
                    </span>
                  )}
                </span>
                {link.note && <span className={styles.linkNote}>{link.note}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
