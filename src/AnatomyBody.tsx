import { BACK_MUSCLES, FRONT_MUSCLES, type MuscleDef } from 'body-muscles'
import { muscleById, type BodySide, type Muscle } from './data'

const anatomyToMuscle: Record<string, string> = {
  'shoulder-front-left': 'deltoid-anterior',
  'shoulder-front-right': 'deltoid-anterior',
  'shoulder-side-left': 'deltoid-lateral',
  'shoulder-side-right': 'deltoid-lateral',
  'biceps-left': 'biceps-long',
  'biceps-right': 'biceps-long',
  'forearm-left': 'forearm-flexors',
  'forearm-right': 'forearm-flexors',
  'chest-upper-left': 'chest-upper',
  'chest-upper-right': 'chest-upper',
  'chest-lower-left': 'chest-lower',
  'chest-lower-right': 'chest-lower',
  'abs-upper-left': 'abs-upper',
  'abs-upper-right': 'abs-upper',
  'abs-lower-left': 'abs-lower',
  'abs-lower-right': 'abs-lower',
  'obliques-left': 'obliques',
  'obliques-right': 'obliques',
  'quads-left': 'quad-rectus',
  'quads-right': 'quad-rectus',
  'traps-upper-left': 'upper-traps',
  'traps-upper-right': 'upper-traps',
  'traps-mid-left': 'mid-traps',
  'traps-mid-right': 'mid-traps',
  'traps-lower-left': 'lower-traps',
  'traps-lower-right': 'lower-traps',
  'lats-upper-left': 'lats',
  'lats-upper-right': 'lats',
  'lats-mid-left': 'lats',
  'lats-mid-right': 'lats',
  'lats-lower-left': 'lats',
  'lats-lower-right': 'lats',
  'deltoid-rear-left': 'deltoid-posterior',
  'deltoid-rear-right': 'deltoid-posterior',
  'triceps-long-left': 'triceps-long',
  'triceps-long-right': 'triceps-long',
  'triceps-lateral-left': 'triceps-lateral',
  'triceps-lateral-right': 'triceps-lateral',
  'forearm-flexors-left': 'forearm-flexors',
  'forearm-flexors-right': 'forearm-flexors',
  'forearm-extensors-left': 'forearm-extensors',
  'forearm-extensors-right': 'forearm-extensors',
  'spine': 'erectors',
  'lower-back-erectors-left': 'erectors',
  'lower-back-erectors-right': 'erectors',
  'gluteus-medius-left': 'glute-med',
  'gluteus-medius-right': 'glute-med',
  'gluteus-maximus-left': 'glute-max',
  'gluteus-maximus-right': 'glute-max',
  'calves-gastroc-medial-left': 'calf-medial',
  'calves-gastroc-medial-right': 'calf-medial',
  'calves-gastroc-lateral-left': 'calf-lateral',
  'calves-gastroc-lateral-right': 'calf-lateral',
  'calves-soleus-left': 'soleus',
  'calves-soleus-right': 'soleus',
  'hamstrings-lateral-left': 'ham-biceps',
  'hamstrings-lateral-right': 'ham-biceps',
  'hamstrings-medial-left': 'ham-semitendinosus',
  'hamstrings-medial-right': 'ham-semitendinosus',
}

const regionsForSide = (side: BodySide): readonly MuscleDef[] =>
  side === 'front' ? FRONT_MUSCLES : BACK_MUSCLES

export const anatomyRegionCount = (side: BodySide) => regionsForSide(side).length

export function AnatomyBody({
  side,
  visibleMuscles,
  selectedMuscleId,
  onSelect,
}: {
  side: BodySide
  visibleMuscles: Muscle[]
  selectedMuscleId: string
  onSelect: (muscle: Muscle) => void
}) {
  const visibleIds = new Set(visibleMuscles.map((muscle) => muscle.id))
  const regions = regionsForSide(side)
  const viewBox = side === 'front' ? '0 0 35 93' : '37 0 35 93'

  const selectRegion = (region: MuscleDef) => {
    const mappedId = anatomyToMuscle[region.id]
    if (!mappedId || !visibleIds.has(mappedId)) return
    const muscle = muscleById.get(mappedId)
    if (muscle) onSelect(muscle)
  }

  return (
    <div className="body-stage">
      <div className="orientation">
        <span>{side === 'front' ? 'Anterior' : 'Posterior'}</span>
        <small>{side === 'front' ? 'Front' : 'Back'} view</small>
      </div>

      <div className="anatomy-figure">
        <svg viewBox={viewBox} className="body-svg" role="img" aria-label={`${side} muscular anatomy map`}>
          <defs>
            <filter id="muscle-glow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="0.45" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="muscle-tone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c65a4f" />
              <stop offset="0.52" stopColor="#9b3f39" />
              <stop offset="1" stopColor="#6f282a" />
            </linearGradient>
          </defs>

          <g className="anatomy-shadow" aria-hidden="true">
            {regions.map((region) => <path key={`shadow-${region.id}`} d={region.path} />)}
          </g>

          <g className="anatomy-regions">
            {regions.map((region) => {
              const mappedId = anatomyToMuscle[region.id]
              const interactive = Boolean(mappedId && visibleIds.has(mappedId))
              const selected = interactive && mappedId === selectedMuscleId
              const mappedMuscle = mappedId ? muscleById.get(mappedId) : undefined
              const label = mappedMuscle ? `${region.name}: ${mappedMuscle.name}` : region.name

              return (
                <path
                  key={region.id}
                  d={region.path}
                  className={`anatomy-region${interactive ? ' interactive' : ''}${selected ? ' selected' : ''}`}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={interactive ? label : undefined}
                  aria-hidden={interactive ? undefined : true}
                  onClick={interactive ? () => selectRegion(region) : undefined}
                  onKeyDown={interactive ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectRegion(region)
                    }
                  } : undefined}
                >
                  <title>{label}</title>
                </path>
              )
            })}
          </g>
        </svg>
      </div>

      <div className="anatomy-key" aria-hidden="true">
        <span><i className="key-selected" />Selected</span>
        <span><i className="key-muscle" />Muscle tissue</span>
      </div>
      <div className="diagram-hint"><span className="pulse-dot" /> Select a muscle region</div>
    </div>
  )
}
