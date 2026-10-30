import { site } from "@/content/site";
import styles from "./home.module.css";

export default function Home() {
  const { contact } = site;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.name}>{site.name}</h1>
          <p className={styles.roles}>
            {site.roles.map((role, i) => (
              <span key={role}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                {role}
              </span>
            ))}
          </p>
          {site.location && <p className={styles.location}>{site.location}</p>}
          <div className={styles.meander} aria-hidden="true" />
        </header>

        <main id="main">
          <section aria-label="About" className={styles.intro}>
            {site.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section aria-labelledby="projects" className={styles.section}>
            <h2 id="projects" className={styles.label}>
              Projects
            </h2>
            <ul className={styles.projects}>
              {site.projects.map((project) => (
                <li key={project.name} className={styles.project}>
                  <div className={styles.projectHead}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <span className={styles.status}>{project.status}</span>
                  </div>
                  <p className={styles.stack}>{project.stack}</p>
                  <p className={styles.summary}>{project.summary}</p>
                  <ul className={styles.links}>
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className={styles.linkButton}>
                          {link.label}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="writing" className={styles.section}>
            <h2 id="writing" className={styles.label}>
              Writing
            </h2>
            <a href={site.writing.href} className={styles.writing}>
              <span className={styles.writingName}>{site.writing.name}</span>
              <span className={styles.writingBlurb}>{site.writing.blurb}</span>
              <span className={styles.writingCta}>
                Read on Substack <span aria-hidden="true">↗</span>
              </span>
            </a>
          </section>

          <section aria-labelledby="learning" className={styles.section}>
            <h2 id="learning" className={styles.label}>
              Currently learning
            </h2>
            <p className={styles.learning}>
              <span lang="grc" className={styles.greek}>
                μανθάνω
              </span>{" "}
              {site.learning}
            </p>
          </section>

          <section aria-labelledby="contact" className={styles.section}>
            <h2 id="contact" className={styles.label}>
              Contact
            </h2>
            <ul className={styles.contact}>
              <li>
                <a href={contact.github.href} className={styles.contactLink}>
                  <span className={styles.contactKind}>GitHub</span>
                  {contact.github.label}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                    <span className={styles.contactKind}>Email</span>
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href={site.writing.href} className={styles.contactLink}>
                  <span className={styles.contactKind}>Substack</span>
                  polemicyst.substack.com
                </a>
              </li>
            </ul>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>{site.name}</span>
          <a href={site.sourceUrl}>Source on GitHub</a>
        </footer>
      </div>
    </>
  );
}
