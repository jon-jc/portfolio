/**
 * Single source of truth for identity, links and SEO copy.
 * Anything that appears in more than one place lives here.
 */

export const site = {
  name: "Jonathan Cho",
  initials: "JC",
  role: "Software Engineer",
  location: "Lacey, WA",
  email: "jonathancho.jc@gmail.com",
  phone: "(626) 393-0910",
  url: "https://jon-jc.vercel.app",
  tagline: "Data systems, GIS, and the interfaces that make them useful.",
  description:
    "Software engineer with three years building React and TypeScript applications end to end — from relational schema design and REST APIs through the dashboards people make decisions in.",
  availability: "Open to data & AI platform roles",
  links: {
    github: "https://github.com/jon-jc",
    linkedin: "https://linkedin.com/in/jon-jc",
    email: "mailto:jonathancho.jc@gmail.com",
  },
} as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type NavItem = (typeof navItems)[number];
