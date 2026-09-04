import { createContext, FormEvent, lazy, Suspense, useContext, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Dumbbell,
  History,
  Home,
  Info,
  Layers3,
  Languages,
  Search,
  ShieldAlert,
  Target,
  Trash2,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  exerciseById,
  exercises,
  exercisesForMuscle,
  muscleById,
  muscles,
  program,
  targetsForFamily,
  type BodySide,
  type Exercise,
  type Muscle,
} from './data'
import { AnatomyBody } from './AnatomyBody'
import {
  localizeExercise,
  localizeLevel,
  localizeMuscle,
  localizeProgram,
  localizeRest,
  translate,
  type Language,
  type TranslationKey,
} from './i18n'

const ProgressCharts = lazy(() => import('./ProgressCharts'))

type Tab = 'explore' | 'program' | 'progress' | 'history'
type Unit = 'kg' | 'lb'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, values?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('Language context is unavailable')
  return value
}

type LogEntry = {
  id: string
  exerciseId: string
  date: string
  weightKg: number
  reps: number
  sets: number
  note?: string
}

type ToastState = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

const navItems: { id: Tab; icon: LucideIcon }[] = [
  { id: 'explore', icon: Home },
  { id: 'program', icon: CalendarDays },
  { id: 'progress', icon: BarChart3 },
  { id: 'history', icon: History },
]

const kgToLb = (kg: number) => kg * 2.20462
const displayWeight = (kg: number, unit: Unit) => unit === 'kg' ? kg : kgToLb(kg)
const round = (value: number, places = 1) => Number(value.toFixed(places))

const targetTitle = (muscle: Muscle) => muscle.part.startsWith('Whole ') ? muscle.name : muscle.part
const targetKindLabel = (muscle: Muscle, language: Language) => translate(language, ({
  head: 'target.head',
  fibers: 'target.fibers',
  region: 'target.region',
  muscle: 'target.muscle',
})[muscle.partKind] as TranslationKey)

const localDateTimeValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}

const weekKey = () => {
  const date = new Date()
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  return date.toISOString().slice(0, 10)
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [language, setLanguage] = useState<Language>(() => readStorage('musclemap:language', 'en'))
  const [tab, setTab] = useState<Tab>('explore')
  const [side, setSide] = useState<BodySide>('front')
  const [selectedMuscleId, setSelectedMuscleId] = useState('chest-upper')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [logExercise, setLogExercise] = useState<Exercise | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>(() => readStorage('musclemap:logs:v2', readStorage('musclemap:logs', [])))
  const [completed, setCompleted] = useState<string[]>(() => readStorage('musclemap:program:v2', []))
  const [unit, setUnit] = useState<Unit>(() => readStorage('musclemap:unit', 'kg'))
  const [confirmReset, setConfirmReset] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const t = (key: TranslationKey, values?: Record<string, string | number>) => translate(language, key, values)

  useEffect(() => localStorage.setItem('musclemap:language', JSON.stringify(language)), [language])
  useEffect(() => localStorage.setItem('musclemap:logs:v2', JSON.stringify(logs)), [logs])
  useEffect(() => localStorage.setItem('musclemap:program:v2', JSON.stringify(completed)), [completed])
  useEffect(() => localStorage.setItem('musclemap:unit', JSON.stringify(unit)), [unit])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const openMuscle = (muscle: Muscle) => {
    setSide(muscle.side)
    setSelectedMuscleId(muscle.id)
  }

  const changeSide = (nextSide: BodySide) => {
    setSide(nextSide)
    setSelectedMuscleId((currentId) => {
      const current = muscleById.get(currentId)
      if (current?.side === nextSide) return currentId
      return muscles.find((muscle) => muscle.side === nextSide)?.id ?? currentId
    })
  }

  const openExercise = (item: Exercise) => setSelectedExercise(item)

  const saveLog = (entry: LogEntry) => {
    setLogs((current) => [...current, entry])
    setLogExercise(null)
    const exercise = exerciseById.get(entry.exerciseId)
    setToast({ message: t('toast.saved', { exercise: exercise ? localizeExercise(exercise, language).name : t('exercise.fallback') }) })
  }

  const deleteLog = (id: string) => {
    const removed = logs.find((entry) => entry.id === id)
    if (!removed) return
    setLogs((current) => current.filter((entry) => entry.id !== id))
    setToast({
      message: t('toast.removed'),
      actionLabel: t('toast.undo'),
      onAction: () => {
        setLogs((current) => [...current, removed])
        setToast(null)
      },
    })
  }

  const toggleProgramItem = (itemId: string) => {
    const key = `${weekKey()}:${itemId}`
    setCompleted((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  }

  const clearData = () => {
    setLogs([])
    setCompleted([])
    setConfirmReset(false)
    setToast({ message: t('toast.cleared') })
  }

  const copy = {
    eyebrow: t(`tab.${tab}.eyebrow` as TranslationKey),
    title: t(`tab.${tab}.title` as TranslationKey),
    description: t(`tab.${tab}.description` as TranslationKey),
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
    <div className="app-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar tab={tab} setTab={setTab} />
      <div className="app-main">
        <header className="topbar">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <div className="topbar-actions">
            <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} aria-label={t('language.switch')}>
              <Languages size={18} /><span>{t('language.next')}</span>
            </button>
            <div className="brand-mark" aria-label="MuscleMap"><Activity size={22} /><span>MM</span></div>
          </div>
        </header>

        <main className="page-content">
          {tab === 'explore' && (
            <ExploreScreen
              side={side}
              setSide={changeSide}
              selectedMuscleId={selectedMuscleId}
              openMuscle={openMuscle}
              openExercise={openExercise}
            />
          )}
          {tab === 'program' && (
            <ProgramScreen
              completed={completed}
              toggleItem={toggleProgramItem}
              openExercise={openExercise}
            />
          )}
          {tab === 'progress' && (
            <ProgressScreen logs={logs} unit={unit} setUnit={setUnit} onExplore={() => setTab('explore')} />
          )}
          {tab === 'history' && (
            <HistoryScreen
              logs={logs}
              unit={unit}
              deleteLog={deleteLog}
              onClear={() => setConfirmReset(true)}
              onExplore={() => setTab('explore')}
            />
          )}
        </main>
      </div>

      <MobileNav tab={tab} setTab={setTab} />

      {selectedExercise && (
        <ExerciseDialog
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onLog={() => {
            setLogExercise(selectedExercise)
            setSelectedExercise(null)
          }}
        />
      )}
      {logExercise && (
        <LogDialog
          exercise={logExercise}
          logs={logs}
          initialUnit={unit}
          onClose={() => setLogExercise(null)}
          onSave={saveLog}
        />
      )}
      {confirmReset && (
        <ConfirmDialog
          onCancel={() => setConfirmReset(false)}
          onConfirm={clearData}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
          {toast.actionLabel && <button onClick={toast.onAction}>{toast.actionLabel}</button>}
        </div>
      )}
    </div>
    </LanguageContext.Provider>
  )
}

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const { t } = useLanguage()
  return (
    <aside className="sidebar">
      <div className="wordmark"><span><Activity size={20} /></span><strong>MuscleMap</strong></div>
      <nav aria-label={t('nav.label')}>
        {navItems.map(({ id, icon: Icon }) => (
          <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(id)}>
            <Icon size={19} /><span>{t(`nav.${id}` as TranslationKey)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-note"><Info size={16} /><p>{t('safety.note')}</p></div>
    </aside>
  )
}

function MobileNav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const { t } = useLanguage()
  return (
    <nav className="mobile-nav" aria-label={t('nav.label')}>
      {navItems.map(({ id, icon: Icon }) => (
        <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
          <Icon size={20} /><span>{t(`nav.${id}` as TranslationKey)}</span>
        </button>
      ))}
    </nav>
  )
}

function ExploreScreen({
  side,
  setSide,
  selectedMuscleId,
  openMuscle,
  openExercise,
}: {
  side: BodySide
  setSide: (side: BodySide) => void
  selectedMuscleId: string
  openMuscle: (muscle: Muscle) => void
  openExercise: (exercise: Exercise) => void
}) {
  const { language, t } = useLanguage()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false)
  const groups = ['All', ...Array.from(new Set(muscles.filter((muscle) => muscle.side === side).map((muscle) => muscle.group)))]
  const selected = muscleById.get(selectedMuscleId) ?? muscles[0]
  const selectedText = localizeMuscle(selected, language)
  const familyTargets = targetsForFamily(selected.family)
  const groupLabel = (item: string) => {
    if (item === 'All') return t('filter.all')
    const representative = muscles.find((muscle) => muscle.group === item)
    return representative ? localizeMuscle(representative, language).group : item
  }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    const muscleMatches = muscles
      .filter((item) => {
        const localized = localizeMuscle(item, language)
        return `${item.name} ${item.group} ${item.family} ${item.part} ${localized.name} ${localized.group} ${localized.family} ${localized.part}`.toLowerCase().includes(normalized)
      })
      .slice(0, 4)
      .map((item) => {
        const localized = localizeMuscle(item, language)
        return { kind: 'muscle' as const, id: item.id, title: `${localized.family} · ${targetTitle(localized)}`, meta: `${localized.group} · ${targetKindLabel(localized, language)}` }
      })
    const exerciseMatches = exercises
      .filter((item) => {
        const localized = localizeExercise(item, language)
        return `${item.name} ${item.equipment} ${localized.name} ${localized.equipment}`.toLowerCase().includes(normalized)
      })
      .slice(0, 4)
      .map((item) => {
        const localized = localizeExercise(item, language)
        return { kind: 'exercise' as const, id: item.id, title: localized.name, meta: localized.equipment }
      })
    return [...muscleMatches, ...exerciseMatches].slice(0, 6)
  }, [query, language])

  const visible = muscles.filter((muscle) => muscle.side === side && (group === 'All' || muscle.group === group))

  const changeBodySide = (nextSide: BodySide) => {
    const nextGroup = group === 'All' || muscles.some((muscle) => muscle.side === nextSide && muscle.group === group)
      ? group
      : 'All'
    setGroup(nextGroup)
    const nextMuscle = muscles.find((muscle) => muscle.side === nextSide && (nextGroup === 'All' || muscle.group === nextGroup))
    if (nextMuscle) openMuscle(nextMuscle)
    else setSide(nextSide)
  }

  const changeGroup = (nextGroup: string) => {
    setGroup(nextGroup)
    const nextMuscle = muscles.find((muscle) => muscle.side === side && (nextGroup === 'All' || muscle.group === nextGroup))
    if (nextMuscle) openMuscle(nextMuscle)
  }

  return (
    <div className="explore-layout">
      <section className="explorer-card">
        <div className="search-wrap">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.label')}
          />
          {query && <button className="clear-search" onClick={() => setQuery('')} aria-label={t('search.clear')}><X size={17} /></button>}
          {query && (
            <div className="search-results">
              {results.length ? results.map((result) => (
                <button key={`${result.kind}:${result.id}`} onClick={() => {
                  if (result.kind === 'muscle') {
                    setGroup('All')
                    openMuscle(muscleById.get(result.id)!)
                  }
                  else openExercise(exerciseById.get(result.id)!)
                  setQuery('')
                }}>
                  <span className="result-icon">{result.kind === 'muscle' ? <Target size={17} /> : <Dumbbell size={17} />}</span>
                  <span><strong>{result.title}</strong><small>{result.meta}</small></span>
                  <ChevronRight size={17} />
                </button>
              )) : <div className="no-results">{t('search.empty')}</div>}
            </div>
          )}
        </div>

        <div className="explorer-toolbar">
          <div className="segmented" aria-label={t('body.view')}>
            <button className={side === 'front' ? 'selected' : ''} onClick={() => changeBodySide('front')}>{t('body.front')}</button>
            <button className={side === 'back' ? 'selected' : ''} onClick={() => changeBodySide('back')}>{t('body.back')}</button>
          </div>
          <div className="view-label"><Layers3 size={16} /> {t('body.targetCount', { count: visible.length })}</div>
        </div>

        <div className="group-filter" aria-label={t('filter.label')}>
          {groups.map((item) => <button key={item} className={group === item ? 'selected' : ''} onClick={() => changeGroup(item)}>{groupLabel(item)}</button>)}
        </div>

        <ExactTargetPicker
          selected={selected}
          targets={familyTargets}
          openMuscle={openMuscle}
          variant="mobile-bar"
        />

        <AnatomyBody
          side={side}
          visibleMuscles={visible}
          selectedMuscleId={selectedMuscleId}
          onSelect={openMuscle}
          language={language}
          mobileFooter={(
            <button
              className="mobile-muscle-summary"
              onClick={() => setMobileDetailsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileDetailsOpen}
            >
              <span className="mobile-summary-copy">
                <small>{selectedText.family} · {targetKindLabel(selectedText, language)}</small>
                <strong>{targetTitle(selectedText)}</strong>
              </span>
              <span className="mobile-summary-action">{t('details.exercises')} <ChevronRight size={18} /></span>
            </button>
          )}
        />
      </section>

      <aside className="muscle-panel desktop-muscle-panel">
        <MuscleDetails selected={selected} openMuscle={openMuscle} openExercise={openExercise} />
      </aside>

      {mobileDetailsOpen && (
        <DialogFrame onClose={() => setMobileDetailsOpen(false)} className="muscle-drawer">
          <div className="drawer-handle" aria-hidden="true" />
          <div className="drawer-topline">
            <span>{t('details.title')}</span>
            <button className="icon-button" onClick={() => setMobileDetailsOpen(false)} aria-label={t('details.close')}><X size={20} /></button>
          </div>
          <MuscleDetails
            selected={selected}
            openMuscle={openMuscle}
            openExercise={(exercise) => {
              setMobileDetailsOpen(false)
              openExercise(exercise)
            }}
          />
        </DialogFrame>
      )}
    </div>
  )
}

function MuscleDetails({
  selected,
  openMuscle,
  openExercise,
}: {
  selected: Muscle
  openMuscle: (muscle: Muscle) => void
  openExercise: (exercise: Exercise) => void
}) {
  const { language, t } = useLanguage()
  const selectedText = localizeMuscle(selected, language)
  const muscleExercises = exercisesForMuscle(selected.id)
  const relatedTargets = targetsForFamily(selected.family)

  return (
    <>
      <div className="panel-kicker"><span>{selectedText.family}</span><span>{targetKindLabel(selectedText, language)}</span></div>
      <h2>{targetTitle(selectedText)}</h2>
      {targetTitle(selectedText) !== selectedText.name && <p className="anatomical-name">{selectedText.name}</p>}
      <p className="function-copy">{selectedText.function}</p>

      <ExactTargetPicker selected={selected} targets={relatedTargets} openMuscle={openMuscle} variant="panel" />
      <p className="targeting-note"><Info size={15} /> {t('target.note')}</p>

      <div className="panel-rule" />
      <div className="section-heading"><span>{t('details.exercises')}</span><small>{t('details.matched', { count: muscleExercises.length })}</small></div>
      <div className="exercise-list">
        {muscleExercises.map((item, index) => {
          const localized = localizeExercise(item, language)
          return (
            <button key={item.id} onClick={() => openExercise(item)}>
              <span className="exercise-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="exercise-copy"><strong>{localized.name}</strong><small>{localized.equipment} · {localizeLevel(item.level, language)}</small></span>
              <ChevronRight size={18} />
            </button>
          )
        })}
      </div>
      <div className="panel-tip"><Target size={17} /><span>{t('details.compare')}</span></div>
    </>
  )
}

function ExactTargetPicker({
  selected,
  targets,
  openMuscle,
  variant,
}: {
  selected: Muscle
  targets: Muscle[]
  openMuscle: (muscle: Muscle) => void
  variant: 'mobile-bar' | 'panel'
}) {
  const { language, t } = useLanguage()
  const selectedText = localizeMuscle(selected, language)
  return (
    <section className={`exact-target-picker ${variant}`} aria-label={t('target.choose', { family: selectedText.family })}>
      <div className="exact-target-heading">
        <span><Target size={15} /> {t('target.exact')}</span>
        <strong>{selectedText.family}</strong>
      </div>
      <div className="exact-target-options">
        {targets.map((muscle) => {
          const active = muscle.id === selected.id
          const count = exercisesForMuscle(muscle.id).length
          const localized = localizeMuscle(muscle, language)
          return (
            <button
              key={muscle.id}
              className={active ? 'selected' : ''}
              aria-pressed={active}
              onClick={() => openMuscle(muscle)}
            >
              <span className="target-choice-copy">
                <small>{targetKindLabel(localized, language)}</small>
                <strong>{targetTitle(localized)}</strong>
              </span>
              <span className="target-exercise-count">{count}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ProgramScreen({
  completed,
  toggleItem,
  openExercise,
}: {
  completed: string[]
  toggleItem: (id: string) => void
  openExercise: (exercise: Exercise) => void
}) {
  const { language, t } = useLanguage()
  const allItems = program.flatMap((day) => day.items)
  const currentWeek = weekKey()
  const completedCount = allItems.filter((item) => completed.includes(`${currentWeek}:${item.id}`)).length
  const percent = Math.round((completedCount / allItems.length) * 100)

  return (
    <div className="program-layout">
      <section className="week-overview">
        <div className="week-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{percent}%</strong><span>{t('program.thisWeek')}</span></div>
        </div>
        <div>
          <div className="eyebrow">{t('program.completion')}</div>
          <h2>{t('program.count', { done: completedCount, total: allItems.length })}</h2>
          <p>{t('program.advice')}</p>
        </div>
      </section>

      <div className="program-grid">
        {program.map((day) => {
          const localizedDay = localizeProgram(day, language)
          const dayDone = day.items.filter((item) => completed.includes(`${currentWeek}:${item.id}`)).length
          return (
            <section className="program-card" key={day.id}>
              <div className="program-card-head">
                <div className="day-badge">{localizedDay.label.replace(language === 'ar' ? 'اليوم ' : 'Day ', '')}</div>
                <div><div className="eyebrow">{localizedDay.label}</div><h2>{localizedDay.title}</h2><p>{localizedDay.focus}</p></div>
                <div className="day-meta"><Clock3 size={15} /> {localizedDay.duration}<span>{dayDone}/{day.items.length}</span></div>
              </div>
              <div className="program-items">
                {day.items.map((item) => {
                  const movement = exerciseById.get(item.exerciseId)!
                  const localizedMovement = localizeExercise(movement, language)
                  const isDone = completed.includes(`${currentWeek}:${item.id}`)
                  return (
                    <div className={isDone ? 'program-item done' : 'program-item'} key={item.id}>
                      <button className="check-button" onClick={() => toggleItem(item.id)} aria-label={`${isDone ? t('program.incomplete') : t('program.complete')}: ${localizedMovement.name}`}>
                        {isDone ? <Check size={16} /> : <Circle size={16} />}
                      </button>
                      <button className="program-link" onClick={() => openExercise(movement)}>
                        <span><strong>{localizedMovement.name}</strong><small>{item.prescription} · {localizeRest(item.rest, language)} {t('program.rest')}</small></span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function ProgressScreen({
  logs,
  unit,
  setUnit,
  onExplore,
}: {
  logs: LogEntry[]
  unit: Unit
  setUnit: (unit: Unit) => void
  onExplore: () => void
}) {
  const { language, t } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const exerciseIds = Array.from(new Set(logs.map((log) => log.exerciseId)))
  const [selectedId, setSelectedId] = useState(exerciseIds[0] ?? '')

  useEffect(() => {
    if (!exerciseIds.includes(selectedId)) setSelectedId(exerciseIds[0] ?? '')
  }, [exerciseIds, selectedId])

  const selectedLogs = logs
    .filter((entry) => entry.exerciseId === selectedId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = useMemo(() => {
    const byDay = new Map<string, { date: string; weight: number; volume: number }>()
    selectedLogs.forEach((entry) => {
      const key = entry.date.slice(0, 10)
      const label = new Date(entry.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
      const current = byDay.get(key) ?? { date: label, weight: 0, volume: 0 }
      current.weight = Math.max(current.weight, displayWeight(entry.weightKg, unit))
      current.volume += displayWeight(entry.weightKg, unit) * entry.reps * entry.sets
      byDay.set(key, current)
    })
    return Array.from(byDay.values()).map((item) => ({ ...item, weight: round(item.weight), volume: Math.round(item.volume) }))
  }, [selectedLogs, unit, locale])

  if (!logs.length) {
    return <EmptyState icon={TrendingUp} title={t('progress.emptyTitle')} text={t('progress.emptyText')} action={t('progress.explore')} onAction={onExplore} />
  }

  const bestWeight = Math.max(...selectedLogs.map((entry) => displayWeight(entry.weightKg, unit)))
  const totalVolume = selectedLogs.reduce((sum, entry) => sum + displayWeight(entry.weightKg, unit) * entry.reps * entry.sets, 0)
  const totalSets = selectedLogs.reduce((sum, entry) => sum + entry.sets, 0)

  return (
    <div className="progress-layout">
      <div className="progress-controls">
        <label>
          {t('progress.exercise')}
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {exerciseIds.map((id) => {
              const exercise = exerciseById.get(id)
              return <option key={id} value={id}>{exercise ? localizeExercise(exercise, language).name : t('exercise.fallback')}</option>
            })}
          </select>
        </label>
        <div className="unit-toggle" aria-label={t('progress.unit')}>
          <button className={unit === 'kg' ? 'selected' : ''} onClick={() => setUnit('kg')}>kg</button>
          <button className={unit === 'lb' ? 'selected' : ''} onClick={() => setUnit('lb')}>lb</button>
        </div>
      </div>

      <div className="metric-grid">
        <Metric icon={Dumbbell} label={t('progress.best')} value={`${round(bestWeight)} ${unit}`} />
        <Metric icon={Layers3} label={t('progress.volume')} value={`${Math.round(totalVolume).toLocaleString(locale)} ${unit}`} />
        <Metric icon={CheckCircle2} label={t('progress.sets')} value={String(totalSets)} />
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <ProgressCharts data={chartData} unit={unit} language={language} />
      </Suspense>
    </div>
  )
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="metric-card"><span><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div></div>
}

function ChartSkeleton() {
  const { t } = useLanguage()
  return <div className="chart-skeleton" aria-label={t('progress.loading')}><span /><span /><span /></div>
}

function HistoryScreen({
  logs,
  unit,
  deleteLog,
  onClear,
  onExplore,
}: {
  logs: LogEntry[]
  unit: Unit
  deleteLog: (id: string) => void
  onClear: () => void
  onExplore: () => void
}) {
  const { language, t } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [query, setQuery] = useState('')
  const filtered = logs
    .filter((entry) => {
      const exercise = exerciseById.get(entry.exerciseId)
      if (!exercise) return false
      return `${exercise.name} ${localizeExercise(exercise, language).name}`.toLowerCase().includes(query.toLowerCase())
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((groups, entry) => {
    const key = new Date(entry.date).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
    groups[key] = [...(groups[key] ?? []), entry]
    return groups
  }, {})

  if (!logs.length) {
    return <EmptyState icon={History} title={t('history.emptyTitle')} text={t('history.emptyText')} action={t('history.find')} onAction={onExplore} />
  }

  return (
    <div className="history-layout">
      <div className="history-toolbar">
        <label className="history-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('history.filter')} /></label>
        <button className="danger-ghost" onClick={onClear}><Trash2 size={16} /> {t('history.clear')}</button>
      </div>

      {!filtered.length ? (
        <div className="inline-empty">{t('history.noMatch', { query })}</div>
      ) : Object.entries(grouped).map(([date, entries]) => (
        <section className="history-group" key={date}>
          <div className="history-date"><span>{date}</span><small>{entries.length} {entries.length === 1 ? t('history.entry') : t('history.entries')}</small></div>
          <div className="history-list">
            {entries.map((entry) => {
              const movement = exerciseById.get(entry.exerciseId)
              const muscle = movement ? muscleById.get(movement.primaryMuscleId) : null
              const localizedMovement = movement ? localizeExercise(movement, language) : null
              const localizedMuscle = muscle ? localizeMuscle(muscle, language) : null
              const weight = round(displayWeight(entry.weightKg, unit))
              const volume = Math.round(weight * entry.reps * entry.sets)
              return (
                <article className="history-row" key={entry.id}>
                  <div className="history-icon"><Dumbbell size={18} /></div>
                  <div className="history-copy"><strong>{localizedMovement?.name ?? t('exercise.fallback')}</strong><small>{localizedMuscle?.name ?? t('history.muscle')} · {new Date(entry.date).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}</small>{entry.note && <p>{entry.note}</p>}</div>
                  <div className="history-numbers"><strong>{weight} {unit}</strong><small>{entry.sets} × {entry.reps} · {volume.toLocaleString(locale)} {t('history.volumeShort')}</small></div>
                  <button className="delete-row" onClick={() => deleteLog(entry.id)} aria-label={t('history.delete', { exercise: localizedMovement?.name ?? t('exercise.fallback') })}><Trash2 size={17} /></button>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function EmptyState({ icon: Icon, title, text, action, onAction }: { icon: LucideIcon; title: string; text: string; action: string; onAction: () => void }) {
  return (
    <div className="empty-state">
      <span><Icon size={28} /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary-button" onClick={onAction}>{action}<ChevronRight size={18} /></button>
    </div>
  )
}

function DialogFrame({ children, onClose, className = '' }: { children: React.ReactNode; onClose: () => void; className?: string }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`dialog ${className}`} role="dialog" aria-modal="true">{children}</section></div>
}

function ExerciseDialog({ exercise, onClose, onLog }: { exercise: Exercise; onClose: () => void; onLog: () => void }) {
  const { language, t } = useLanguage()
  const muscle = muscleById.get(exercise.primaryMuscleId)!
  const localizedExercise = localizeExercise(exercise, language)
  const localizedMuscle = localizeMuscle(muscle, language)
  return (
    <DialogFrame onClose={onClose} className="exercise-dialog">
      <div className="dialog-topline">
        <button className="icon-button" onClick={onClose} aria-label={t('exercise.close')}><ArrowLeft size={20} /></button>
        <span>{t('exercise.guide')}</span>
        <button className="icon-button" onClick={onClose} aria-label={t('exercise.close')}><X size={20} /></button>
      </div>
      <div className="exercise-hero">
        <div className="exercise-symbol"><Dumbbell size={34} /></div>
        <div><div className="eyebrow">{localizedMuscle.group} · {localizeLevel(exercise.level, language)}</div><h2>{localizedExercise.name}</h2><p>{localizedExercise.equipment}</p></div>
      </div>
      <div className="target-card"><Target size={19} /><div><small>{t('exercise.primaryTarget')}</small><strong>{localizedMuscle.family} · {targetTitle(localizedMuscle)}</strong></div><p>{localizedMuscle.function}</p></div>
      <div className="guide-grid">
        <div>
          <div className="section-heading"><span>{t('exercise.how')}</span></div>
          <ol className="cue-list">
            {localizedExercise.cues.map((cue, index) => <li key={cue}><span>{index + 1}</span><p>{cue}</p></li>)}
          </ol>
        </div>
        <div>
          <div className="section-heading"><span>{t('exercise.mistakes')}</span></div>
          <ul className="mistake-list">
            {localizedExercise.mistakes.map((mistake) => <li key={mistake}><ShieldAlert size={17} /><span>{mistake}</span></li>)}
          </ul>
        </div>
      </div>
      <button className="primary-button full" onClick={onLog}><BookOpen size={18} /> {t('exercise.log')}</button>
    </DialogFrame>
  )
}

function LogDialog({
  exercise,
  logs,
  initialUnit,
  onClose,
  onSave,
}: {
  exercise: Exercise
  logs: LogEntry[]
  initialUnit: Unit
  onClose: () => void
  onSave: (entry: LogEntry) => void
}) {
  const { language, t } = useLanguage()
  const localizedExercise = localizeExercise(exercise, language)
  const latest = logs.filter((entry) => entry.exerciseId === exercise.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  const [unit, setUnit] = useState<Unit>(initialUnit)
  const [weight, setWeight] = useState(latest ? String(round(displayWeight(latest.weightKg, initialUnit))) : '')
  const [reps, setReps] = useState(latest ? String(latest.reps) : '10')
  const [sets, setSets] = useState(latest ? String(latest.sets) : '3')
  const [date, setDate] = useState(localDateTimeValue())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const changeUnit = (next: Unit) => {
    const current = Number(weight)
    if (current > 0) setWeight(String(round(next === 'lb' && unit === 'kg' ? kgToLb(current) : next === 'kg' && unit === 'lb' ? current / 2.20462 : current)))
    setUnit(next)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const numericWeight = Number(weight)
    const numericReps = Number(reps)
    const numericSets = Number(sets)
    if (!(numericWeight > 0) || !(numericReps > 0) || !(numericSets > 0) || !Number.isInteger(numericReps) || !Number.isInteger(numericSets)) {
      setError(t('log.error'))
      return
    }
    onSave({
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      date: new Date(date).toISOString(),
      weightKg: unit === 'lb' ? numericWeight / 2.20462 : numericWeight,
      reps: numericReps,
      sets: numericSets,
      note: note.trim() || undefined,
    })
  }

  return (
    <DialogFrame onClose={onClose} className="log-dialog">
      <div className="dialog-topline compact"><div><div className="eyebrow">{t('log.quick')}</div><h2>{localizedExercise.name}</h2></div><button className="icon-button" onClick={onClose} aria-label={t('log.close')}><X size={20} /></button></div>
      {latest && <div className="last-session"><History size={17} /><span>{t('log.last')}: {round(displayWeight(latest.weightKg, unit))} {unit} · {latest.sets} × {latest.reps}</span></div>}
      <form onSubmit={submit}>
        <div className="unit-toggle wide" aria-label={t('log.unit')}>
          <button type="button" className={unit === 'kg' ? 'selected' : ''} onClick={() => changeUnit('kg')}>{t('log.kilograms')}</button>
          <button type="button" className={unit === 'lb' ? 'selected' : ''} onClick={() => changeUnit('lb')}>{t('log.pounds')}</button>
        </div>
        <div className="number-grid">
          <label>{t('log.weight')} ({unit})<input autoFocus inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="0" /></label>
          <label>{t('log.reps')}<input inputMode="numeric" value={reps} onChange={(event) => setReps(event.target.value)} /></label>
          <label>{t('log.sets')}<input inputMode="numeric" value={sets} onChange={(event) => setSets(event.target.value)} /></label>
        </div>
        <label className="field-label">{t('log.date')}<input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="field-label">{t('log.note')} <span>{t('log.optional')}</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t('log.notePlaceholder')} rows={2} /></label>
        {error && <div className="form-error"><ShieldAlert size={16} /> {error}</div>}
        <button className="primary-button full" type="submit"><Check size={18} /> {t('log.save')}</button>
      </form>
    </DialogFrame>
  )
}

function ConfirmDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const { t } = useLanguage()
  return (
    <DialogFrame onClose={onCancel} className="confirm-dialog">
      <span className="danger-symbol"><Trash2 size={24} /></span>
      <h2>{t('confirm.title')}</h2>
      <p>{t('confirm.text')}</p>
      <div className="confirm-actions"><button className="secondary-button" onClick={onCancel}>{t('confirm.cancel')}</button><button className="danger-button" onClick={onConfirm}>{t('confirm.clear')}</button></div>
    </DialogFrame>
  )
}

export default App
