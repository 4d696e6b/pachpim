import { describe, expect, it } from "vitest";

import { pageTransitionDestination } from "@/lib/page-navigation";

const current = "https://pacharapol.dev/projects?sort=latest";

describe("pageTransitionDestination", () => {
  it("accepts public route changes and preserves query and fragment", () => {
    expect(
      pageTransitionDestination(
        "/experience/launching-rsetup?from=home#post",
        current,
      ),
    ).toBe("/experience/launching-rsetup?from=home#post");
    expect(pageTransitionDestination("/", current)).toBe("/");
    expect(pageTransitionDestination("/about", current)).toBe("/about");
  });

  it("leaves same-path query and hash changes to normal navigation", () => {
    expect(pageTransitionDestination("#selected-work", current)).toBeNull();
    expect(pageTransitionDestination("?sort=oldest", current)).toBeNull();
    expect(pageTransitionDestination("/projects/", current)).toBeNull();
  });

  it("does not intercept external origins, admin routes, or downloadable files", () => {
    for (const href of [
      "https://example.com/about",
      "//example.com/projects",
      "/admin/projects",
      "/login",
      "/resume/pacharapol-pimpa-resume.pdf",
      "/projects/cover.png",
      "/api/media/image/file",
      "javascript:alert(1)",
    ]) {
      expect(pageTransitionDestination(href, current)).toBeNull();
    }
  });
});
