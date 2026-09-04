import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const i18nSource = fs.readFileSync(new URL('../src/i18n.ts', import.meta.url), 'utf8')
const exerciseTranslationsSource = fs.readFileSync(new URL('../src/exerciseTranslationsAr.ts', import.meta.url), 'utf8')
const exerciseIds = new Set([...source.matchAll(/exercise\('([^']+)'/g)].map((match) => match[1]))
const musclesSection = source.split('export const muscles')[1].split('export const program')[0]
const muscleIds = [...musclesSection.matchAll(/\{ id: '([^']+)'/g)].map((match) => match[1])
const structuredTargets = [...musclesSection.matchAll(/\{ id: '([^']+)'[^\n]+family: '([^']+)'[^\n]+part: '([^']+)'[^\n]+partKind: '(head|fibers|region|muscle)'/g)]
const targetIds = [...source.matchAll(/exercise\([^\n]+, '([^']+)', '(?:Beginner|Intermediate)'/g)].map((match) => match[1])
const programExerciseIds = [...source.matchAll(/exerciseId: '([^']+)'/g)].map((match) => match[1])

const missingMuscles = muscleIds.filter((id) => !targetIds.includes(id))
const missingProgramExercises = programExerciseIds.filter((id) => !exerciseIds.has(id))
const targetsMissingAnatomy = muscleIds.filter((id) => !structuredTargets.some((match) => match[1] === id))
const duplicateParts = structuredTargets
  .map((match) => `${match[2]}::${match[3]}`)
  .filter((key, index, entries) => entries.indexOf(key) !== index)

const arabicMusclesSection = i18nSource.split('const arabicMuscles')[1].split('const equipmentAr')[0]
const translatedMuscleIds = new Set(
  [...arabicMusclesSection.matchAll(/^\s*(?:'([^']+)'|([A-Za-z][\w-]*)):\s*\{/gm)]
    .map((match) => match[1] ?? match[2]),
)
const translatedExerciseIds = new Set(
  [...exerciseTranslationsSource.matchAll(/^\s*'([^']+)':\s*\{/gm)].map((match) => match[1]),
)
const missingArabicMuscles = muscleIds.filter((id) => !translatedMuscleIds.has(id))
const missingArabicExercises = [...exerciseIds].filter((id) => !translatedExerciseIds.has(id))
const unknownArabicMuscles = [...translatedMuscleIds].filter((id) => !muscleIds.includes(id))
const unknownArabicExercises = [...translatedExerciseIds].filter((id) => !exerciseIds.has(id))

if (missingMuscles.length || missingProgramExercises.length || targetsMissingAnatomy.length || duplicateParts.length || missingArabicMuscles.length || missingArabicExercises.length || unknownArabicMuscles.length || unknownArabicExercises.length) {
  console.error({ missingMuscles, missingProgramExercises, targetsMissingAnatomy, duplicateParts, missingArabicMuscles, missingArabicExercises, unknownArabicMuscles, unknownArabicExercises })
  process.exit(1)
}

console.log(`${muscleIds.length} muscle regions, ${exerciseIds.size} exercises, and ${programExerciseIds.length} program movements are linked correctly with complete Arabic coverage.`)
