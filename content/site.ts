/**
 * Everything the home page says lives here. Only facts that could be checked
 * against Austin's own repos, the App Store, and his Substack are filled in.
 *
 * Fields set to `null` are TODOs: the page skips them rather than showing
 * placeholder text. Grep for "TODO(austin)" to find them.
 */

export type ProjectLink = { label: string; href: string };

export type Project = {
  name: string;
  status: string;
  stack: string;
  summary: string;
  links: ProjectLink[];
};

export const site = {
  name: "Austin Connor",
  title: "Austin Connor · Software engineer",
  description:
    "Austin Connor is a software engineer who builds and ships his own products, writes essays at Dead Reckoning, and studies Ancient Greek.",
  roles: ["Software engineer", "Essayist", "Student of Greek"],

  intro: [
    "I'm a software engineer. I build my own products and I ship them: native iOS apps, the web apps and AI pipelines behind them, and the tooling that lets one person run all of it.",
    "I also write. Dead Reckoning is my Substack, where I take on politics, economics, and constitutional questions, argued from the primary sources and stated plainly.",
    "And I'm learning Ancient Greek, starting from the alphabet.",
  ],

  // TODO(austin): city / where you're based, if you want it on the site.
  location: null as string | null,

  projects: [
    {
      name: "Gainplate",
      status: "On the App Store",
      stack: "iOS · SwiftUI",
      summary:
        "A protein-first meal picker for people who lift. Set your bodyweight once and it picks a day of meals that hits your protein target, then turns the ingredients into a grocery order at the store you already use. No accounts, no ads.",
      links: [
        {
          label: "App Store",
          href: "https://apps.apple.com/us/app/gainplate/id6796057395",
        },
        { label: "gainplate.app", href: "https://gainplate.app" },
      ],
    },
    {
      name: "Clipfire",
      status: "In development",
      stack: "Next.js · iOS · AI pipeline",
      summary:
        "Turns long-form video into clips ready for Reels, Shorts, and TikTok, picked and scored by AI. The point is to publish without ever opening an editor.",
      links: [
        { label: "Web app", href: "https://polemicyst.vercel.app" },
        {
          label: "Source",
          href: "https://github.com/austinconnor1836/polemicyst.com",
        },
      ],
    },
    {
      name: "Pulse",
      status: "In development",
      stack: "iOS · Android · Kotlin Multiplatform",
      summary:
        "A city guide that ranks what's worth doing right now instead of listing everything there is to do. Native on both platforms with a shared Kotlin core. New York first.",
      links: [
        { label: "Source", href: "https://github.com/austinconnor1836/pulse" },
      ],
    },
  ] satisfies Project[],

  writing: {
    name: "Dead Reckoning",
    href: "https://polemicyst.substack.com",
    blurb:
      "Essays on politics, economics, and the Constitution. Published on Substack under the name Polemicyst.",
  },

  learning:
    "Ancient Greek, through Randolph College's online modular course (Hansen & Quinn), with Athenaze on the side.",

  contact: {
    github: {
      label: "github.com/austinconnor1836",
      href: "https://github.com/austinconnor1836",
    },
    // TODO(austin): a public email address. None appears in your public repos
    // or on the Substack, so none is listed.
    email: null as string | null,
  },

  sourceUrl: "https://github.com/austinconnor1836/austinconnor.com",
} as const;
