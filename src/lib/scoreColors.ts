// Matches AniList's tiers exactly:
// > 74 green, > 59 orange, else red.
export function scoreColorClass(score: number): string {
  if (score > 74) return 'text-[#7BD555]'
  if (score > 59) return 'text-[#F79A63]'
  return 'text-[#E85D75]'
}
