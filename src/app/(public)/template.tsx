import { PageTransition } from "@/components/layout/page-transition";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
