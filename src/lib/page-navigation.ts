const publicPath =
  /^\/(?:about|skills|contact)\/?$|^\/(?:projects|experience|notes)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?\/?$/;

export function pageTransitionDestination(
  href: string,
  currentHref: string,
): string | null {
  try {
    const current = new URL(currentHref);
    const destination = new URL(href, current);
    const normalizedCurrent = current.pathname.replace(/\/$/, "") || "/";
    const normalizedDestination =
      destination.pathname.replace(/\/$/, "") || "/";

    if (
      !["http:", "https:"].includes(destination.protocol) ||
      destination.origin !== current.origin ||
      normalizedDestination === normalizedCurrent ||
      (normalizedDestination !== "/" && !publicPath.test(destination.pathname))
    ) {
      return null;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return null;
  }
}
