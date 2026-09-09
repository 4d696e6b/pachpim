import { ArrowRight, Award, Mail, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkillHolders } from "@/components/shared/skill-holders";
import { siteConfig } from "@/config/site";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublicContent } from "@/lib/server/public-content";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const { profile, projects, notes, skills, timeline, achievements } =
    await getPublicContent();
  const selectedProjects = projects
    .filter((project) => project.featured)
    .slice(0, 2);
  const experiences = timeline.filter((item) => item.type === "experience");
  const experiencePreview = experiences.slice(0, 4);
  const hasMoreExperience =
    experiences.length > 4 ||
    timeline.some((item) => item.type === "education");

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.professionalTitle,
            url: siteConfig.url,
            sameAs: profile.socialLinks.map((link) => link.url),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${profile.name} — Portfolio`,
            url: siteConfig.url,
          },
        ]}
      />
      <section className="container grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-20 lg:grid-cols-[1.2fr_.8fr]">
        <Reveal>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="size-3.5" /> {profile.availability}
          </p>
          <h1 className="display mt-6 max-w-4xl">
            {profile.professionalTitle}
          </h1>
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
          </div>
          <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
            <MapPin className="size-4" /> {profile.location}
          </p>
        </Reveal>
        <Reveal className="relative mx-auto w-full max-w-md" delay={0.12}>
          <div className="bg-accent/10 absolute -inset-8 -z-10 rounded-full blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border bg-[linear-gradient(145deg,var(--muted),color-mix(in_srgb,var(--accent)_16%,var(--background)))] shadow-2xl">
            {profile.profilePhotoUrl ? (
              <Image
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
            <div className="bg-background/75 absolute right-5 bottom-5 left-5 rounded-2xl border border-white/20 p-4 backdrop-blur-xl">
              <p className="font-medium">{profile.name}</p>
              {profile.professionalTitle ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  {profile.professionalTitle}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </section>

      {projects.length ? (
        <section className="section bg-muted/35 border-y">
          <div className="container">
            <SectionHeading
              description={profile.shortIntroduction}
              eyebrow="Selected work"
              title="Projects"
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {(selectedProjects.length
                ? selectedProjects
                : projects.slice(0, 2)
              ).map((project, index) => (
                <Reveal delay={index * 0.08} key={project.id}>
                  <ProjectCard priority={index === 0} project={project} />
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
        <section className="section container grid gap-16 lg:grid-cols-2">
          {skills.length ? (
            <div>
              <SectionHeading eyebrow="Capabilities" title="Skills" />
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
        <div className="bg-foreground text-background overflow-hidden rounded-[2.5rem] p-8 sm:p-14">
          {profile.availability ? (
            <p className="text-accent text-sm font-semibold">
              {profile.availability}
            </p>
          ) : null}
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {profile.name
              ? `Get in touch with ${profile.name}`
              : "Get in touch"}
          </h2>
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
