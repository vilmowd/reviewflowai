export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function randomSuffix(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length);
}
