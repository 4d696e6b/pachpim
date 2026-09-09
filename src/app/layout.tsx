import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_rethrow } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import {
  emptyProfile,
  getPublicContent,
  siteIdentity,
} from "@/lib/server/public-content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let identity = siteIdentity(emptyProfile);

  try {
    const { profile } = await getPublicContent();
    identity = siteIdentity(profile);
  } catch (error) {
    unstable_rethrow(error);
  }

  const title = identity.title
    ? `${identity.name} — ${identity.title}`
    : identity.name;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s — ${identity.name}`,
    },
    applicationName: identity.name,
    description: identity.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: identity.name,
      description: identity.description,
      url: siteConfig.url,
      siteName: identity.name,
    },
    twitter: {
      card: "summary_large_image",
      title: identity.name,
      description: identity.description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
