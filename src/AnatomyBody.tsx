import { useRef, type ReactNode, type TouchEvent } from 'react'
import { muscleById, type BodySide, type Muscle } from './data'
import { RICH_BACK_MUSCLES } from './richAnatomyBack'
import { RICH_FRONT_MUSCLES } from './richAnatomyFront'
import type { RichMuscleDefinition } from './richAnatomyTypes'
import { localizeMuscle, translate, type Language } from './i18n'

const PX2MM = 25.4 / 96
const VIEWBOX_WIDTH = 361.15625
const VIEWBOX_HEIGHT = 541.86667

// The illustration and its masks are distributed by js-rich-body-highlighter.
// Using its versioned CDN assets keeps the image crisp without inflating the app bundle.
const BODY_IMAGES: Record<BodySide, string> = {
  front: 'https://cdn.jsdelivr.net/npm/js-rich-body-highlighter@0.1.1/dist/bodies/male-front-dark.webp',
  back: 'https://cdn.jsdelivr.net/npm/js-rich-body-highlighter@0.1.1/dist/bodies/male-back-dark.webp',
}
const richMusclesForSide = (side: BodySide) =>
  (side === 'front' ? RICH_FRONT_MUSCLES : RICH_BACK_MUSCLES).filter((muscle) => muscle.gender === 'male')

const appTargetsForRegion = (region: RichMuscleDefinition, side: BodySide): string[] => {
  switch (region.group) {
    case 'chest': return ['chest-upper', 'chest-lower']
    case 'shoulders': return side === 'back' ? ['deltoid-posterior'] : ['deltoid-anterior', 'deltoid-lateral']
    case 'biceps': return ['biceps-long', 'biceps-short', 'brachialis']
    case 'triceps': return ['triceps-long', 'triceps-lateral', 'triceps-medial']
    case 'forearms': return side === 'back' ? ['forearm-extensors'] : ['forearm-flexors']
    case 'abs': return ['abs-upper', 'abs-lower']
    case 'obliques': return ['obliques']
    case 'upper_back': return ['upper-traps', 'mid-traps', 'lower-traps', 'rhomboids']
    case 'lats': return ['lats']
    case 'lower_back': return ['erectors']
    case 'glutes': return ['glute-max', 'glute-med']
    case 'quads': return ['quad-rectus', 'quad-lateral', 'quad-medial', 'quad-intermedius']
    case 'hamstrings': return ['ham-biceps', 'ham-semitendinosus', 'ham-semimembranosus']
    case 'calves': return ['calf-medial', 'calf-lateral', 'soleus']
    default: return []
  }
}

const transformFor = (offset: RichMuscleDefinition['offset']) => {
  if (!offset || (!offset.x && !offset.y)) return undefined
  return `translate(${offset.x * PX2MM} ${offset.y * PX2MM})`
}

export function AnatomyBody({
  side,
  visibleMuscles,
  selectedMuscleId,
  onSelect,
  onSwipeSide,
  language,
  mobileFooter,
}: {
  side: BodySide
  visibleMuscles: Muscle[]
  selectedMuscleId: string
  onSelect: (muscle: Muscle) => void
  onSwipeSide?: (side: BodySide) => void
  language: Language
  mobileFooter?: ReactNode
}) {
  const visibleIds = new Set(visibleMuscles.map((muscle) => muscle.id))
  const regions = richMusclesForSide(side)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const startSwipe = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  const finishSwipe = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null
    if (!start || !touch || !onSwipeSide) return
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) >= 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      event.preventDefault()
      onSwipeSide(side === 'front' ? 'back' : 'front')
    }
  }

  return (
    <div className="body-stage" onTouchStart={startSwipe} onTouchEnd={finishSwipe}>
      <div className="orientation">
        <span>{translate(language, side === 'front' ? 'body.anterior' : 'body.posterior')}</span>
        <small>{translate(language, side === 'front' ? 'body.front' : 'body.back')} · {translate(language, 'body.superficial')}</small>
      </div>

      <div className="anatomy-figure">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="body-svg"
          role="img"
          aria-label={translate(language, 'body.aria', { side: translate(language, side === 'front' ? 'body.front' : 'body.back') })}
          preserveAspectRatio="xMidYMid meet"
        >
          <image
            href={BODY_IMAGES[side]}
            x="0"
            y="0"
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
            className="body-render"
            aria-hidden="true"
          />
          <g className="rich-muscle-layer">
            {regions.map((region) => {
              const candidates = appTargetsForRegion(region, side)
              const activeTargets = candidates.filter((id) => visibleIds.has(id))
              const selected = activeTargets.includes(selectedMuscleId)
              const interactive = activeTargets.length > 0
              const targetId = selectedMuscleId && activeTargets.includes(selectedMuscleId)
                ? selectedMuscleId
                : activeTargets[0]
              const sourceMuscle = targetId ? muscleById.get(targetId) : undefined
              const mappedMuscle = sourceMuscle ? localizeMuscle(sourceMuscle, language) : undefined
              const label = mappedMuscle
                ? translate(language, activeTargets.length === 1 ? 'body.currentTargetOne' : 'body.currentTarget', {
                    region: mappedMuscle.group,
                    count: activeTargets.length,
                    part: mappedMuscle.part,
                  })
                : region.name

              return (
                <path
                  key={region.id}
                  d={region.d}
                  transform={transformFor(region.offset)}
                  className={`rich-muscle${interactive ? ' interactive' : ''}${selected ? ' selected' : ''}`}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={interactive ? label : undefined}
                  aria-hidden={interactive ? undefined : true}
                  onClick={interactive && targetId ? () => {
                    const muscle = muscleById.get(targetId)
                    if (muscle) onSelect(muscle)
                  } : undefined}
                  onKeyDown={interactive && targetId ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      const muscle = muscleById.get(targetId)
                      if (muscle) onSelect(muscle)
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
        <span><i className="key-selected" />{translate(language, 'body.selected')}</span>
        <span><i className="key-muscle" />{translate(language, 'body.overlay')}</span>
      </div>
      <div className="diagram-hint"><span className="pulse-dot" /> {translate(language, 'body.hint')}</div>
      {mobileFooter}
    </div>
  )
}
