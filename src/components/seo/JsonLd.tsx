import { education, experience, featuredProjects, skillGroups } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * Structured data for the site.
 *
 * A Person graph tied to the projects, so a search engine can connect the
 * name to the work rather than inferring it from prose. Emitted as one graph
 * with internal @id references instead of several disconnected blobs, which
 * is what lets the ProfilePage point at the same Person the projects credit.
 */
export function JsonLd() {
  const personId = `${site.url}#person`;

  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      jobTitle: site.role,
      description: site.description,
      email: site.email,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lacey",
        addressRegion: "WA",
        addressCountry: "US",
      },
      sameAs: [site.links.github, site.links.linkedin],
      knowsAbout: skillGroups.flatMap((group) => group.items),
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: education.school,
      },
      worksFor: experience.map((role) => ({
        "@type": "Organization",
        name: role.company,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      url: site.url,
      name: `${site.name} — ${site.role}`,
      description: site.tagline,
      inLanguage: "en-US",
      publisher: { "@id": personId },
    },
    ...featuredProjects.map((project) => ({
      "@type": "SoftwareSourceCode",
      "@id": `${site.url}/work/${project.slug}#project`,
      name: project.name,
      description: project.summary,
      url: project.live ?? project.repo,
      codeRepository: project.repo,
      programmingLanguage: project.stack,
      author: { "@id": personId },
    })),
  ];

  return (
    <script
      type="application/ld+json"
      // Content is authored in this file, not user input; the only character
      // that can break out of a script element is escaped below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
