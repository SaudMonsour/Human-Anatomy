import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const exerciseIds = new Set([...source.matchAll(/exercise\('([^']+)'/g)].map((match) => match[1]))
const musclesSection = source.split('export const muscles')[1].split('export const program')[0]
const muscleIds = [...musclesSection.matchAll(/\{ id: '([^']+)'/g)].map((match) => match[1])
const targetIds = [...source.matchAll(/exercise\([^\n]+, '([^']+)', '(?:Beginner|Intermediate)'/g)].map((match) => match[1])
const programExerciseIds = [...source.matchAll(/exerciseId: '([^']+)'/g)].map((match) => match[1])

const missingMuscles = muscleIds.filter((id) => !targetIds.includes(id))
const missingProgramExercises = programExerciseIds.filter((id) => !exerciseIds.has(id))

if (missingMuscles.length || missingProgramExercises.length) {
  console.error({ missingMuscles, missingProgramExercises })
  process.exit(1)
}

console.log(`${muscleIds.length} muscle regions, ${exerciseIds.size} exercises, and ${programExerciseIds.length} program movements are linked correctly.`)
