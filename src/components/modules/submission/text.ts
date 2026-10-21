/**
 * Presentation helpers for the long-form text a submission carries.
 *
 * `description` is pasted/generated multi-line text, `feedback` is a mentor's
 * prose. Both are stored as a single string, so the views split them into
 * renderable pieces rather than dumping one opaque blob on screen.
 */

/** Split a description into bullet items, stripping any leading `-`, `*` or `•`. */
export const toBulletPoints = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);

/**
 * Split feedback into paragraphs on blank lines. Single line breaks are kept
 * inside a paragraph so the author's wrapping is preserved (render with
 * `whitespace-pre-line`), while every paragraph is a separate block element so
 * they stack vertically instead of overlapping.
 */
export const toParagraphs = (text: string): string[] =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
