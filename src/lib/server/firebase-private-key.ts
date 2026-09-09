/**
 * Vercel and some dotenv loaders leave wrapping quotes, literal `\n`,
 * or a single-line PEM. OpenSSL 3 then throws ERR_OSSL_UNSUPPORTED.
 */
export function normalizeFirebasePrivateKey(raw: string): string {
  let key = raw.trim().replace(/^\uFEFF/, "");
  key = unwrapQuotes(key);
  key = key.replace(/\\n/g, "\n").replace(/\\r/g, "");
  key = unwrapQuotes(key.trim());
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  const begin = key.match(/-----BEGIN ([A-Z ]*PRIVATE KEY)-----/);
  const end = key.match(/-----END ([A-Z ]*PRIVATE KEY)-----/);
  if (!begin || !end || begin[1] !== end[1]) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY must be the PEM private_key from the Firebase service account JSON, including BEGIN/END lines. In Vercel, paste one line with \\n and no wrapping quotes.",
    );
  }

  const header = `-----BEGIN ${begin[1]}-----`;
  const footer = `-----END ${end[1]}-----`;
  const body = key
    .slice(key.indexOf(header) + header.length, key.lastIndexOf(footer))
    .replace(/\s+/g, "");

  if (!body) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing the key body.");
  }

  const wrapped = body.match(/.{1,64}/g)?.join("\n") ?? body;
  return `${header}\n${wrapped}\n${footer}\n`;
}

function unwrapQuotes(value: string): string {
  const quote = value[0];
  if (
    (quote === '"' || quote === "'") &&
    value.endsWith(quote) &&
    value.length >= 2
  ) {
    return value.slice(1, -1);
  }
  return value;
}
