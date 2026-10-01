import { ArrowDownToLine, ArrowRight, Award, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { CmsImage } from "@/components/shared/cms-image";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
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
        <Reveal>
          <p className="eyebrow flex items-center gap-2">
            <span className="bg-accent size-2 rounded-full" />
            {profile.availability}
          </p>
          <h1 className="display mt-6 max-w-3xl text-balance">
            I build practical web products and real-time systems.
          </h1>
          <p className="mt-6 font-medium">
            {identity.name}
            {profile.professionalTitle
              ? ` · ${profile.professionalTitle}`
              : null}
          </p>
          <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
            {profile.shortIntroduction}
          </p>
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
          <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
            <MapPin className="size-4" /> {profile.location}
          </p>
        </Reveal>
        <Reveal className="relative mx-auto w-full max-w-md" delay={0.12}>
          <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-2xl border">
            {profile.profilePhotoUrl ? (
              <CmsImage
                alt={`${profile.name} portrait`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 80vw"
                src={profile.profilePhotoUrl}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-foreground/10 text-8xl font-semibold tracking-tighter">
                  {profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </section>

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
                {experiencePreview.map((item) => (
                  <div className="relative pb-8 pl-7 last:pb-0" key={item.id}>
                    <span className="border-background bg-accent absolute top-1.5 -left-1.5 size-3 rounded-full border-2" />
                    <p className="text-accent text-xs font-medium">
                      {item.period}
                    </p>
                    <h3 className="mt-2 font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.organization}
                    </p>
                  </div>
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
              {achievements.slice(0, 4).map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <Award className="text-accent size-5" />
                    <h3 className="mt-5 font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {notes.length ? (
        <section className="section container">
          <SectionHeading eyebrow="Latest notes" title="Notes" />
          <div className="mt-10 divide-y border-y">
            {notes.slice(0, 2).map((note) => (
              <Link
                className="group grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-center"
                href={`/notes/${note.slug}`}
                key={note.id}
              >
                <div>
                  <h3 className="group-hover:text-accent text-xl font-semibold">
                    {note.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {note.excerpt}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm">
                  {formatDate(note.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container pb-20 sm:pb-32">
        <div className="bg-foreground text-background overflow-hidden rounded-2xl p-8 sm:p-14">
          {profile.availability ? (
            <p className="text-accent text-sm font-semibold">
              {profile.availability}
            </p>
          ) : null}
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Have a project, internship, or collaboration in mind?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 opacity-70">
            Tell me what you are building and where I can help. I would be glad
            to hear about it.
          </p>
          <Button
            asChild
            className="bg-background text-foreground hover:bg-background/90 mt-8"
          >
            <Link href="/contact">Start a conversation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
