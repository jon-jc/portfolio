import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { featuredProjects } from "@/lib/data";

export function Work() {
  return (
    <Section
      id="work"
      index="02"
      eyebrow="Selected work"
      title={
        <>
          Five systems, built end to end —{" "}
          <span className="text-ink-faint">schema through interface.</span>
        </>
      }
      lede="Each of these started at the data model and finished at something a person can actually use. Four are deployed and open source; the fifth runs entirely on your own hardware by design."
    >
      <div className="flex flex-col gap-5 sm:gap-6">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} distance={28}>
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
