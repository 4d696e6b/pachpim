import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicContent } from "@/lib/server/public-content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getPublicContent();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        latestUpdate={profile.latestUpdate}
        name={profile.name}
        socialLinks={profile.socialLinks}
        tagline={profile.professionalTitle}
      />
    </div>
  );
}
