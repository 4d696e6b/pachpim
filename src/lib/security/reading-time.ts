export interface ReadingTime {
  minutes: number;
  words: number;
  text: string;
}

export function calculateReadingTime(
  markdown: string,
  wordsPerMinute = 200,
): ReadingTime {
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) {
    throw new Error("wordsPerMinute must be a positive number.");
  }

  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .trim();
  const words = plainText ? plainText.split(/\s+/u).length : 0;
  const minutes =
    words === 0 ? 0 : Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    words,
    text: `${minutes} min read`,
  };
}
