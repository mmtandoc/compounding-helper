export const capitalize = (str: string, allWords = false): string => {
  const pattern = allWords ? /(\b[a-z](?!\s))/g : /(\b[a-z])/

  return str.replace(pattern, (s) => s.toUpperCase())
}
