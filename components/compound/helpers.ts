export const shortcutSuffixMap = new Map([
  ["HC", "Hydrocordisone powder"],
  ["SA", "Salicylic acid"],
  ["CL", "Clindamycin powder"],
  ["MC", "Menthol & camphor"],
  ["ER", "Erythromycin powder"],
  ["MZ", "Miconazole crystals"],
  ["CZ", "Clotrimazole powder"],
  ["AA", "Half & half"],
])

export const getHwngShortcutString = (
  compoundId: number | undefined | null,
  shortcutVariations: { code: string; name: string }[] | undefined | null,
  shortcutSuffix: string | undefined | null,
) => {
  const variationCodes = shortcutVariations
    ? shortcutVariations.map((v) => v.code)
    : []
  return `#${compoundId ?? "ID"}${
    variationCodes.length > 0
      ? variationCodes.length === 1
        ? variationCodes.join("/")
        : `[${variationCodes.join("/")}]`
      : ""
  }${shortcutSuffix ? `-${shortcutSuffix}` : ""}`.toUpperCase()
}
