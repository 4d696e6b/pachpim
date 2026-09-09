import Image, { type ImageProps } from "next/image";

import { shouldBypassImageOptimizer } from "@/lib/media";

export function CmsImage({ src, unoptimized, ...props }: ImageProps) {
  const bypass =
    typeof src === "string" ? shouldBypassImageOptimizer(src) : false;

  return <Image {...props} src={src} unoptimized={unoptimized ?? bypass} />;
}
