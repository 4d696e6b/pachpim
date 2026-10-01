import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SocialLinks } from "@/components/shared/social-links";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/features/messages/contact-form";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  return {
    title: "Contact",
    description: siteIdentity(profile).description,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const { profile } = await getPublicContent();

  return (
    <section className="section container">
      <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal direction="left">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title mt-6">
            Let&apos;s build something useful.
          </h1>
          <p className="text-muted-foreground mt-7 max-w-xl text-lg leading-8">
            I am open to internships, freelance projects, and thoughtful
            collaborations. Tell me what you are working on, what you need, and
            your ideal timeline.
          </p>
          <div className="mt-10 grid gap-3">
            {profile.email ? (
              <a
                className="hover:text-accent flex items-center gap-3 text-sm"
                href={`mailto:${profile.email}`}
              >
                <Mail className="size-4" /> {profile.email}
              </a>
            ) : null}
            <SocialLinks links={profile.socialLinks} variant="list" />
          </div>
        </Reveal>
        <Reveal className="self-start" delay={0.1} direction="right">
          <Card className="contact-card">
            <CardContent className="p-6 sm:p-9">
              <ContactForm />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
