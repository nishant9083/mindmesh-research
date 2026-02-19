export function stringToColor(
  str: string,
  { salt = 0 } = {}
) {
  // FNV-1a hash
  let hash = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619) >>> 0
  }

  hash = (hash + (salt >>> 0)) >>> 0

  // Golden ratio for good hue distribution
  const GOLDEN_RATIO = 0.61803398875

  // Map hash → [0,1)
  let h = (hash / 0xffffffff) % 1

  // Spread using golden ratio
  h = (h + GOLDEN_RATIO) % 1

  // Convert to degrees
  const hue = Math.floor(h * 360)

  // Fixed pleasant contrast range
  const saturation = 65 // %
  const lightness = 55 // %

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
