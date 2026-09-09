import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CmsImage } from "@/components/shared/cms-image";
import { isImageAssetUrl } from "@/lib/media";
import { isSafeUrl } from "@/lib/security";
import { slugify } from "@/lib/utils";

function safeUrl(url: string) {
  if (url.startsWith("#") || url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    return ["https:", "http:", "mailto:"].includes(parsed.protocol) ? url : "";
  } catch {
    return "";
  }
}

function safeImageUrl(url: string) {
  const input = url.trim();
  if (!isSafeUrl(input, { allowRelative: true })) return "";
  if (!isImageAssetUrl(input) && !input.startsWith("/api/media/")) return "";
  return input;
}

export function getTableOfContents(body: string) {
  return body
    .split("\n")
    .map((line) => /^(#{2,3})\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => ({
      level: match[1].length,
      title: match[2].replace(/[*_`]/g, ""),
      id: slugify(match[2].replace(/[*_`]/g, "")),
    }));
}

export function MarkdownContent({ body }: { body: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        allowedElements={[
          "h2",
          "h3",
          "p",
          "strong",
          "em",
          "a",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "hr",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "img",
        ]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugify(String(children))}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(String(children))}>{children}</h3>
          ),
          a: ({ href = "", children }) => (
            <a
              className="text-accent font-medium underline underline-offset-4"
              href={safeUrl(href)}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              target={href.startsWith("http") ? "_blank" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src = "", alt = "" }) => {
            const url = safeImageUrl(String(src));
            if (!url) return null;
            if (url.startsWith("/api/media/")) {
              return (
                <span className="note-photo relative my-8 block aspect-video overflow-hidden rounded-2xl border">
                  <CmsImage
                    alt={alt || "Note photo"}
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 720px, 100vw"
                    src={url}
                  />
                </span>
              );
            }
            return (
              // Remote HTTPS photos skip the optimizer.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={alt || "Note photo"}
                className="my-8 h-auto w-full rounded-2xl border"
                src={url}
              />
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={safeUrl}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
