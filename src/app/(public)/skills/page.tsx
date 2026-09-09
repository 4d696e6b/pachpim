import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SkillHolders } from "@/components/shared/skill-holders";
import { Button } from "@/components/ui/button";
import { getPublicContent, siteIdentity } from "@/lib/server/public-content";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPublicContent();
  return {
    title: "Skills",
    description: siteIdentity(profile).description,
    alternates: { canonical: "/skills" },
  };
}

export default async function SkillsPage() {
  const { skills } = await getPublicContent();
  const extraSkills = skills.slice(6);

  return (
    <section className="section container">
      <Button asChild size="sm" variant="ghost">
        <Link href="/">
          <ArrowLeft className="size-4" /> Home
        </Link>
      </Button>
      <p className="eyebrow mt-8">Skills</p>
      <h1 className="display mt-6 max-w-4xl">More skills</h1>
      <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
        Additional skills beyond the first six on the home page.
      </p>
      <div className="mt-12 max-w-xl">
        {extraSkills.length ? (
          <SkillHolders skills={extraSkills} />
        ) : (
          <p className="text-muted-foreground text-sm">
            All current skills are already listed on the home page.
          </p>
        )}
      </div>
    </section>
  );
}
