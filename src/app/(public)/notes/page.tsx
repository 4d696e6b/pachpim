import { permanentRedirect } from "next/navigation";
export default function LegacyNotesPage() {
  permanentRedirect("/experience");
}
