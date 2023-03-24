/**
 * Returns a copy of the input string with the first letter capitalized
 * @param text String to be capitalized
 */
export default function setFirstLetterCapital(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}