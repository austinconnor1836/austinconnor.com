import type { MetadataRoute } from "next";

// The Greek questions page is excluded with a noindex meta tag, not here:
// a robots.txt Disallow would stop crawlers from ever seeing that tag.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
