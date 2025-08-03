//make first letter of each word uppercase
export function Capitalize(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}
