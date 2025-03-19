export function replaceLastInstance(text: string, search: string, replacement: string): string {
   const lastIndex = text.lastIndexOf(search);
   if (lastIndex === -1) return text;

   return text.substring(0, lastIndex) + replacement + text.substring(lastIndex + search.length);
}
