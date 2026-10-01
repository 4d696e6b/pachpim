import type { Metadata } from "next";
import { ArrowDownToLine } from "lucide-react";
import { CmsImage } from "@/components/shared/cms-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { SocialLinks } from "@/components/shared/social-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isImageAssetUrl } from "@/lib/media";
import { groupSkills } from "@/lib/skills";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";
import { isSafeUrl } from "@/lib/security";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  const identity = siteIdentity(profile);
  return {
    title: "About",
    description: identity.description,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const { profile, skills, timeline, certifications, achievements } =
    await getPublicContent();
  const groupedSkills = groupSkills(skills);
  const sidebar = (
    <Card>
      <CardContent className="pt-6">
        {profile.location ? (
          <>
            <p className="text-muted-foreground text-sm">Based in</p>
            <p className="mt-1 font-medium">{profile.location}</p>
          </>
        ) : null}
        {profile.availability ? (
          <>
            <p className="text-muted-foreground mt-5 text-sm">Availability</p>
            <p className="mt-1 font-medium">{profile.availability}</p>
          </>
        ) : null}
        {profile.resumeUrl &&
        isSafeUrl(profile.resumeUrl, { allowRelative: true }) ? (
          <Button asChild className="mt-6 w-full" variant="outline">
            <a
              href={profile.resumeUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              <ArrowDownToLine className="size-4" /> Download résumé
            </a>
          </Button>
        ) : null}
        <SocialLinks className="mt-6" links={profile.socialLinks} />
      </CardContent>
    </Card>
  );

  return (
    <>
      <section className="section container">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="page-title mt-6 max-w-4xl">
            Building useful systems with care and curiosity.
          </h1>
          {profile.professionalTitle ? (
            <p className="mt-5 font-medium">{profile.professionalTitle}</p>
          ) : null}
          <div
            className={
              profile.biography
                ? "mt-12 grid gap-10 lg:grid-cols-[1.2fr_.8fr]"
                : "mt-12 max-w-md"
            }
          >
            {profile.biography ? (
              <p className="text-muted-foreground max-w-3xl text-xl leading-9">
                {profile.biography}
              </p>
            ) : null}
            {sidebar}
          </div>
        </Reveal>
      </section>

      {skills.length || timeline.length ? (
        <section className="bg-muted/30 border-y">
          <div className="section container grid gap-16 lg:grid-cols-2">
            {skills.length ? (
              <div>
                <SectionHeading eyebrow="Skills" title="Toolkit" />
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  {groupedSkills.map(([category, items], index) => (
                    <Reveal delay={index * 0.05} key={category}>
                      <div className="skill-group">
                        <h3 className="font-semibold">{category}</h3>
                        <ul className="text-muted-foreground mt-4 grid gap-2 text-sm">
                          {items.map((skill) => (
                            <li key={skill.id}>{skill.name}</li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ) : null}
            {timeline.length ? (
              <div>
                <SectionHeading
                  eyebrow="Experience & education"
                  title="Background"
                />
                <div className="mt-10 border-l">
                  {timeline.map((item, index) => {
                    const isLearning = item.type === "education";
                    return (
                      <Reveal delay={index * 0.06} key={item.id}>
                        <article className="timeline-item relative pb-10 pl-8 last:pb-0">
                          <span
                            className={
                              isLearning
                                ? "ring-background absolute top-1 -left-1.5 size-3 rounded-full bg-amber-500 ring-4"
                                : "bg-accent ring-background absolute top-1 -left-1.5 size-3 rounded-full ring-4"
                            }
                          />
                          <p
                            className={
                              isLearning
                                ? "text-xs font-medium text-amber-600 dark:text-amber-400"
                                : "text-accent text-xs font-medium"
                            }
                          >
                            {isLearning ? "Learning · " : null}
                            {item.period}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {item.organization}
                          </p>
                          {item.description ? (
                            <p className="text-muted-foreground mt-3 text-sm leading-6">
                              {item.description}
                            </p>
                          ) : null}
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {certifications.length || achievements.length ? (
        <section className="section container">
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications & achievements"
          />
          {certifications.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {certifications.map((item) => {
                const credentialUrl =
                  item.url && isSafeUrl(item.url, { allowRelative: true })
                    ? item.url
                    : null;
                const imageUrl = [item.imageUrl, item.url].find(
                  (value) => value && isImageAssetUrl(value),
                );
                const card = (
                  <Card className="credential-card h-full overflow-hidden">
                    <div className="bg-muted relative aspect-4/3 overflow-hidden">
                      {imageUrl ? (
                        <CmsImage
                          alt={`${item.title} certificate`}
                          className="object-contain p-3"
                          fill
                          sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw"
                          src={imageUrl}
                        />
                      ) : (
                        <div className="text-muted-foreground/40 absolute inset-0 grid place-items-center text-sm font-medium tracking-wide uppercase">
                          Certificate
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {item.issuer}
                      </p>
                      <p className="text-accent mt-1 text-xs font-medium">
                        {item.date}
                      </p>
                    </CardContent>
                  </Card>
                );
                return credentialUrl ? (
                  <a
                    className="block transition hover:-translate-y-0.5"
                    href={credentialUrl}
                    key={item.id}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={item.id}>{card}</div>
                );
              })}
            </div>
          ) : null}
          {achievements.length ? (
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {achievements.map((item, index) => (
                <Reveal delay={index * 0.06} key={item.id}>
                  <Card className="achievement-card h-full">
                    <CardContent className="p-6">
                      <p className="eyebrow">Achievement</p>
                      <h3 className="mt-3 font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-6">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
