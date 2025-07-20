export function replaceSpacesWithUnderscore(istring: string): string {
      return istring.replace(/\s+/g, '_');
}

export function slugify(input: string): string {
      return input.trim()
            .toLowerCase()
            .replace(/\s+/g, '-');
}
