import { ArrowDownToLine, ArrowRight, Award, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import {
  FloatingFrame,
  HeroVisual,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { Reveal } from "@/components/shared/reveal";
import { ProfileFlipCard } from "@/components/shared/profile-flip-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkillHolders } from "@/components/shared/skill-holders";
import { siteConfig } from "@/config/site";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";
import { isSafeUrl } from "@/lib/security";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const { profile, projects, notes, skills, timeline, achievements } =
    await getPublicContent();
  const identity = siteIdentity(profile);
  const selectedProjects = projects
    .filter((project) => project.featured)
    .slice(0, 2);
  const experiences = timeline.filter((item) => item.type === "experience");
  const experiencePreview = experiences.slice(0, 4);
  const hasMoreExperience =
    experiences.length > 4 ||
    timeline.some((item) => item.type === "education");
  const resumeUrl =
    profile.resumeUrl && isSafeUrl(profile.resumeUrl, { allowRelative: true })
      ? profile.resumeUrl
      : null;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: identity.name,
            jobTitle: profile.professionalTitle,
            url: siteConfig.url,
            sameAs: profile.socialLinks.map((link) => link.url),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: identity.name,
            url: siteConfig.url,
          },
        ]}
      />
      <section className="container grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_.85fr]">
        <Stagger className="relative" delay={0.05}>
          <StaggerItem>
            <p className="eyebrow flex items-center gap-2">
              <span className="availability-dot bg-accent size-2 rounded-full" />
              {profile.availability}
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="display mt-6 max-w-3xl text-balance">
              I build practical web products and real-time systems.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 font-medium">
              {identity.name}
              {profile.professionalTitle
                ? ` · ${profile.professionalTitle}`
                : null}
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
              {profile.shortIntroduction}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/projects">
                  View projects <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  <Mail className="size-4" /> Contact me
                </Link>
              </Button>
              {resumeUrl ? (
                <Button asChild size="lg" variant="ghost">
                  <a href={resumeUrl} rel="noreferrer noopener" target="_blank">
                    <ArrowDownToLine className="size-4" /> Résumé
                  </a>
                </Button>
              ) : null}
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
              <MapPin className="size-4" /> {profile.location}
            </p>
          </StaggerItem>
        </Stagger>
        <Reveal
          className="relative mx-auto w-full max-w-md"
          delay={0.18}
          direction="right"
        >
          <HeroVisual>
            <FloatingFrame className="portrait-frame bg-muted relative aspect-[4/5] overflow-hidden rounded-2xl border">
              <ProfileFlipCard
                availability={profile.availability}
                imageUrl={profile.profilePhotoUrl}
                location={profile.location}
                name={identity.name}
                role={profile.professionalTitle}
              />
            </FloatingFrame>
          </HeroVisual>
        </Reveal>
      </section>

      <div className="tech-rail border-y" aria-hidden>
        <div className="tech-rail-track py-3 font-mono text-xs tracking-[0.14em] uppercase">
          {[0, 1].map((copy) => (
            <div className="flex shrink-0 items-center gap-10 pr-10" key={copy}>
              {[
                "TypeScript",
                "Next.js",
                "React",
                "Firebase",
                "Node.js",
                "Real-time systems",
                "Accessible UI",
              ].map((item) => (
                <span
                  className="text-muted-foreground flex items-center gap-3"
                  key={`${copy}-${item}`}
                >
                  <span className="text-accent">◆</span> {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {projects.length ? (
        <section className="section bg-muted/35 border-y">
          <div className="container">
            <SectionHeading
              description="A closer look at the systems I have designed, built, and delivered for real people."
              eyebrow="Selected work"
              title="Work with a clear purpose"
            />
            <div
              className={
                selectedProjects.length === 1
                  ? "mt-12"
                  : "mt-12 grid gap-6 lg:grid-cols-2"
              }
            >
              {(selectedProjects.length
                ? selectedProjects
                : projects.slice(0, 2)
              ).map((project, index) => (
                <Reveal delay={index * 0.08} key={project.id}>
                  <ProjectCard
                    featured={selectedProjects.length === 1}
                    priority={index === 0}
                    project={project}
                  />
                </Reveal>
              ))}
            </div>
            <Button asChild className="mt-10" variant="outline">
              <Link href="/projects">
                Explore all projects <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}

      {skills.length || experiencePreview.length ? (
        <section className="section container grid gap-16 lg:grid-cols-2 lg:gap-20">
          {skills.length ? (
            <div>
              <SectionHeading
                description="The tools and practices I use to move from an idea to a dependable product."
                eyebrow="Capabilities"
                title="What I work with"
              />
              <SkillHolders skills={skills} />
            </div>
          ) : null}
          {experiencePreview.length ? (
            <div>
              <p className="eyebrow">Experience</p>
              <div className="mt-7 border-l">
                {experiencePreview.map((item, index) => (
                  <Reveal delay={index * 0.08} key={item.id}>
                    <div className="timeline-item relative pb-8 pl-7 last:pb-0">
                      <span className="timeline-dot border-background bg-accent absolute top-1.5 -left-1.5 size-3 rounded-full border-2" />
                      <p className="text-accent text-xs font-medium">
                        {item.period}
                      </p>
                      <h3 className="mt-2 font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {item.organization}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
              {hasMoreExperience ? (
                <Button asChild className="mt-6" variant="outline">
                  <Link href="/about">
                    More experience <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {achievements.length ? (
        <section className="bg-card border-y">
          <div className="section container grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <SectionHeading eyebrow="Achievements" title="Highlights" />
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.slice(0, 4).map((item, index) => (
                <Reveal delay={index * 0.08} key={item.id}>
                  <Card className="achievement-card h-full">
                    <CardContent className="pt-6">
                      <Award className="achievement-icon text-accent size-5 transition-transform duration-300" />
                      <h3 className="mt-5 font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-6">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {notes.length ? (
        <section className="section container">
          <SectionHeading eyebrow="Latest updates" title="Experience" />
          <div className="mt-10 divide-y border-y">
            {notes.slice(0, 2).map((note, index) => (
              <Reveal delay={index * 0.08} key={note.id}>
                <Link
                  className="note-row group grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-center"
                  href={`/experience/${note.slug}`}
                >
                  <div>
                    <h3 className="group-hover:text-accent text-xl font-semibold transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {note.excerpt}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm transition-transform group-hover:-translate-x-1">
                    {formatDate(note.publishedAt)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container pb-20 sm:pb-32">
        <Reveal>
          <div className="cta-panel bg-foreground text-background relative isolate overflow-hidden rounded-2xl p-8 sm:p-14">
            {profile.availability ? (
              <p className="text-accent text-sm font-semibold">
                {profile.availability}
              </p>
            ) : null}
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Have a project, internship, or collaboration in mind?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 opacity-70">
              Tell me what you are building and where I can help. I would be
              glad to hear about it.
            </p>
            <Button
              asChild
              className="bg-background text-foreground hover:bg-background/90 mt-8"
            >
              <Link href="/contact">Start a conversation</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
