export type RichBodyView = 'front' | 'back'
export type RichGender = 'male' | 'female'
export type RichMuscleSide = 'left' | 'right' | null

export type RichMuscleGroup =
  | 'chest'
  | 'lats'
  | 'upper_back'
  | 'lower_back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'obliques'
  | (string & {})

export type RichMuscleOffset = { x: number; y: number }

export type RichMuscleDefinition = {
  id: string
  name: string
  group: RichMuscleGroup
  gender: RichGender
  side: RichMuscleSide
  view: RichBodyView
  d: string
  offset?: RichMuscleOffset
}

