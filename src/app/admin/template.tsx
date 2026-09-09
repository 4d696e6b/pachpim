import { PageTransition } from "@/components/layout/page-transition";

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
