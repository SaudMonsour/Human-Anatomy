import { FormEvent, lazy, Suspense, useEffect, useMemo, useState } from 'react'
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

const ProgressCharts = lazy(() => import('./ProgressCharts'))

type Tab = 'explore' | 'program' | 'progress' | 'history'
type Unit = 'kg' | 'lb'

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

const navItems: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'explore', label: 'Explore', icon: Home },
  { id: 'program', label: 'Program', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
]

const tabCopy: Record<Tab, { eyebrow: string; title: string; description: string }> = {
  explore: { eyebrow: 'Anatomy explorer', title: 'Train the right tissue', description: 'Select a muscle, choose its exact head or part, then find the right exercise.' },
  program: { eyebrow: 'Four-day split', title: 'A balanced week', description: 'A practical upper–lower plan with explicit technique links.' },
  progress: { eyebrow: 'Performance', title: 'See what is improving', description: 'Compare working weight and volume exercise by exercise.' },
  history: { eyebrow: 'Training log', title: 'Your completed work', description: 'Review, search, or correct every recorded set.' },
}

const kgToLb = (kg: number) => kg * 2.20462
const displayWeight = (kg: number, unit: Unit) => unit === 'kg' ? kg : kgToLb(kg)
const round = (value: number, places = 1) => Number(value.toFixed(places))

const targetTitle = (muscle: Muscle) => muscle.part.startsWith('Whole ') ? muscle.name : muscle.part
const targetKindLabel = (muscle: Muscle) => ({
  head: 'Head',
  fibers: 'Fiber region',
  region: 'Region',
  muscle: 'Muscle',
})[muscle.partKind]

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

  useEffect(() => localStorage.setItem('musclemap:logs:v2', JSON.stringify(logs)), [logs])
  useEffect(() => localStorage.setItem('musclemap:program:v2', JSON.stringify(completed)), [completed])
  useEffect(() => localStorage.setItem('musclemap:unit', JSON.stringify(unit)), [unit])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

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
    setToast({ message: `${exerciseById.get(entry.exerciseId)?.name ?? 'Exercise'} saved` })
  }

  const deleteLog = (id: string) => {
    const removed = logs.find((entry) => entry.id === id)
    if (!removed) return
    setLogs((current) => current.filter((entry) => entry.id !== id))
    setToast({
      message: 'Log entry removed',
      actionLabel: 'Undo',
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
    setToast({ message: 'Training data cleared' })
  }

  const copy = tabCopy[tab]

  return (
    <div className="app-shell">
      <Sidebar tab={tab} setTab={setTab} />
      <div className="app-main">
        <header className="topbar">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <div className="brand-mark" aria-label="MuscleMap"><Activity size={22} /><span>MM</span></div>
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
  )
}

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return (
    <aside className="sidebar">
      <div className="wordmark"><span><Activity size={20} /></span><strong>MuscleMap</strong></div>
      <nav aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={tab === id ? 'nav-item active' : 'nav-item'} onClick={() => setTab(id)}>
            <Icon size={19} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-note"><Info size={16} /><p>Training guidance, not medical diagnosis. Stop if an exercise causes pain.</p></div>
    </aside>
  )
}

function MobileNav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
          <Icon size={20} /><span>{label}</span>
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
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false)
  const groups = ['All', ...Array.from(new Set(muscles.filter((muscle) => muscle.side === side).map((muscle) => muscle.group)))]
  const selected = muscleById.get(selectedMuscleId) ?? muscles[0]
  const familyTargets = targetsForFamily(selected.family)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    const muscleMatches = muscles
      .filter((item) => `${item.name} ${item.group} ${item.family} ${item.part}`.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((item) => ({ kind: 'muscle' as const, id: item.id, title: `${item.family} · ${targetTitle(item)}`, meta: `${item.group} · ${targetKindLabel(item)}` }))
    const exerciseMatches = exercises
      .filter((item) => `${item.name} ${item.equipment}`.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((item) => ({ kind: 'exercise' as const, id: item.id, title: item.name, meta: item.equipment }))
    return [...muscleMatches, ...exerciseMatches].slice(0, 6)
  }, [query])

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
            placeholder="Search a muscle or exercise"
            aria-label="Search muscles and exercises"
          />
          {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}
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
              )) : <div className="no-results">No matching muscles or exercises.</div>}
            </div>
          )}
        </div>

        <div className="explorer-toolbar">
          <div className="segmented" aria-label="Body view">
            <button className={side === 'front' ? 'selected' : ''} onClick={() => changeBodySide('front')}>Front</button>
            <button className={side === 'back' ? 'selected' : ''} onClick={() => changeBodySide('back')}>Back</button>
          </div>
          <div className="view-label"><Layers3 size={16} /> {visible.length} training targets</div>
        </div>

        <div className="group-filter" aria-label="Filter muscle groups">
          {groups.map((item) => <button key={item} className={group === item ? 'selected' : ''} onClick={() => changeGroup(item)}>{item}</button>)}
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
          mobileFooter={(
            <button
              className="mobile-muscle-summary"
              onClick={() => setMobileDetailsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileDetailsOpen}
            >
              <span className="mobile-summary-copy">
                <small>{selected.family} · {targetKindLabel(selected)}</small>
                <strong>{targetTitle(selected)}</strong>
              </span>
              <span className="mobile-summary-action">Exercises <ChevronRight size={18} /></span>
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
            <span>Muscle details</span>
            <button className="icon-button" onClick={() => setMobileDetailsOpen(false)} aria-label="Close muscle details"><X size={20} /></button>
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
  const muscleExercises = exercisesForMuscle(selected.id)
  const relatedTargets = targetsForFamily(selected.family)

  return (
    <>
      <div className="panel-kicker"><span>{selected.family}</span><span>{targetKindLabel(selected)}</span></div>
      <h2>{targetTitle(selected)}</h2>
      {targetTitle(selected) !== selected.name && <p className="anatomical-name">{selected.name}</p>}
      <p className="function-copy">{selected.function}</p>

      <ExactTargetPicker selected={selected} targets={relatedTargets} openMuscle={openMuscle} variant="panel" />
      <p className="targeting-note"><Info size={15} /> Exercises emphasize this target; they do not completely isolate it.</p>

      <div className="panel-rule" />
      <div className="section-heading"><span>Exercises</span><small>{muscleExercises.length} matched</small></div>
      <div className="exercise-list">
        {muscleExercises.map((item, index) => (
          <button key={item.id} onClick={() => openExercise(item)}>
            <span className="exercise-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="exercise-copy"><strong>{item.name}</strong><small>{item.equipment} · {item.level}</small></span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
      <div className="panel-tip"><Target size={17} /><span>Select another highlighted region to compare its role and exercise options.</span></div>
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
  return (
    <section className={`exact-target-picker ${variant}`} aria-label={`Choose a specific target within ${selected.family}`}>
      <div className="exact-target-heading">
        <span><Target size={15} /> Exact target</span>
        <strong>{selected.family}</strong>
      </div>
      <div className="exact-target-options">
        {targets.map((muscle) => {
          const active = muscle.id === selected.id
          const count = exercisesForMuscle(muscle.id).length
          return (
            <button
              key={muscle.id}
              className={active ? 'selected' : ''}
              aria-pressed={active}
              onClick={() => openMuscle(muscle)}
            >
              <span className="target-choice-copy">
                <small>{targetKindLabel(muscle)}</small>
                <strong>{targetTitle(muscle)}</strong>
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
  const allItems = program.flatMap((day) => day.items)
  const currentWeek = weekKey()
  const completedCount = allItems.filter((item) => completed.includes(`${currentWeek}:${item.id}`)).length
  const percent = Math.round((completedCount / allItems.length) * 100)

  return (
    <div className="program-layout">
      <section className="week-overview">
        <div className="week-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{percent}%</strong><span>this week</span></div>
        </div>
        <div>
          <div className="eyebrow">Weekly completion</div>
          <h2>{completedCount} of {allItems.length} exercises</h2>
          <p>Aim for steady, repeatable sessions. Leave at least one rest day between lower-body workouts.</p>
        </div>
      </section>

      <div className="program-grid">
        {program.map((day) => {
          const dayDone = day.items.filter((item) => completed.includes(`${currentWeek}:${item.id}`)).length
          return (
            <section className="program-card" key={day.id}>
              <div className="program-card-head">
                <div className="day-badge">{day.label.replace('Day ', '')}</div>
                <div><div className="eyebrow">{day.label}</div><h2>{day.title}</h2><p>{day.focus}</p></div>
                <div className="day-meta"><Clock3 size={15} /> {day.duration}<span>{dayDone}/{day.items.length}</span></div>
              </div>
              <div className="program-items">
                {day.items.map((item) => {
                  const movement = exerciseById.get(item.exerciseId)!
                  const isDone = completed.includes(`${currentWeek}:${item.id}`)
                  return (
                    <div className={isDone ? 'program-item done' : 'program-item'} key={item.id}>
                      <button className="check-button" onClick={() => toggleItem(item.id)} aria-label={`${isDone ? 'Mark incomplete' : 'Mark complete'}: ${movement.name}`}>
                        {isDone ? <Check size={16} /> : <Circle size={16} />}
                      </button>
                      <button className="program-link" onClick={() => openExercise(movement)}>
                        <span><strong>{movement.name}</strong><small>{item.prescription} · {item.rest} rest</small></span>
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
      const label = new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const current = byDay.get(key) ?? { date: label, weight: 0, volume: 0 }
      current.weight = Math.max(current.weight, displayWeight(entry.weightKg, unit))
      current.volume += displayWeight(entry.weightKg, unit) * entry.reps * entry.sets
      byDay.set(key, current)
    })
    return Array.from(byDay.values()).map((item) => ({ ...item, weight: round(item.weight), volume: Math.round(item.volume) }))
  }, [selectedLogs, unit])

  if (!logs.length) {
    return <EmptyState icon={TrendingUp} title="Your trends start with one log" text="Choose an exercise, record your working weight, and MuscleMap will build the chart." action="Explore exercises" onAction={onExplore} />
  }

  const bestWeight = Math.max(...selectedLogs.map((entry) => displayWeight(entry.weightKg, unit)))
  const totalVolume = selectedLogs.reduce((sum, entry) => sum + displayWeight(entry.weightKg, unit) * entry.reps * entry.sets, 0)
  const totalSets = selectedLogs.reduce((sum, entry) => sum + entry.sets, 0)

  return (
    <div className="progress-layout">
      <div className="progress-controls">
        <label>
          Exercise
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {exerciseIds.map((id) => <option key={id} value={id}>{exerciseById.get(id)?.name ?? 'Exercise'}</option>)}
          </select>
        </label>
        <div className="unit-toggle" aria-label="Display unit">
          <button className={unit === 'kg' ? 'selected' : ''} onClick={() => setUnit('kg')}>kg</button>
          <button className={unit === 'lb' ? 'selected' : ''} onClick={() => setUnit('lb')}>lb</button>
        </div>
      </div>

      <div className="metric-grid">
        <Metric icon={Dumbbell} label="Best weight" value={`${round(bestWeight)} ${unit}`} />
        <Metric icon={Layers3} label="Total volume" value={`${Math.round(totalVolume).toLocaleString()} ${unit}`} />
        <Metric icon={CheckCircle2} label="Working sets" value={String(totalSets)} />
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <ProgressCharts data={chartData} unit={unit} />
      </Suspense>
    </div>
  )
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="metric-card"><span><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div></div>
}

function ChartSkeleton() {
  return <div className="chart-skeleton" aria-label="Loading charts"><span /><span /><span /></div>
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
  const [query, setQuery] = useState('')
  const filtered = logs
    .filter((entry) => (exerciseById.get(entry.exerciseId)?.name ?? '').toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((groups, entry) => {
    const key = new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    groups[key] = [...(groups[key] ?? []), entry]
    return groups
  }, {})

  if (!logs.length) {
    return <EmptyState icon={History} title="Nothing logged yet" text="Your sets will appear here with their weight, reps, volume, and training date." action="Find an exercise" onAction={onExplore} />
  }

  return (
    <div className="history-layout">
      <div className="history-toolbar">
        <label className="history-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter exercise history" /></label>
        <button className="danger-ghost" onClick={onClear}><Trash2 size={16} /> Clear data</button>
      </div>

      {!filtered.length ? (
        <div className="inline-empty">No exercise names match “{query}”.</div>
      ) : Object.entries(grouped).map(([date, entries]) => (
        <section className="history-group" key={date}>
          <div className="history-date"><span>{date}</span><small>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</small></div>
          <div className="history-list">
            {entries.map((entry) => {
              const movement = exerciseById.get(entry.exerciseId)
              const muscle = movement ? muscleById.get(movement.primaryMuscleId) : null
              const weight = round(displayWeight(entry.weightKg, unit))
              const volume = Math.round(weight * entry.reps * entry.sets)
              return (
                <article className="history-row" key={entry.id}>
                  <div className="history-icon"><Dumbbell size={18} /></div>
                  <div className="history-copy"><strong>{movement?.name ?? 'Exercise'}</strong><small>{muscle?.name ?? 'Muscle'} · {new Date(entry.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</small>{entry.note && <p>{entry.note}</p>}</div>
                  <div className="history-numbers"><strong>{weight} {unit}</strong><small>{entry.sets} × {entry.reps} · {volume.toLocaleString()} vol</small></div>
                  <button className="delete-row" onClick={() => deleteLog(entry.id)} aria-label={`Delete ${movement?.name ?? 'exercise'} entry`}><Trash2 size={17} /></button>
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
  const muscle = muscleById.get(exercise.primaryMuscleId)!
  return (
    <DialogFrame onClose={onClose} className="exercise-dialog">
      <div className="dialog-topline">
        <button className="icon-button" onClick={onClose} aria-label="Close exercise"><ArrowLeft size={20} /></button>
        <span>Exercise guide</span>
        <button className="icon-button" onClick={onClose} aria-label="Close exercise"><X size={20} /></button>
      </div>
      <div className="exercise-hero">
        <div className="exercise-symbol"><Dumbbell size={34} /></div>
        <div><div className="eyebrow">{muscle.group} · {exercise.level}</div><h2>{exercise.name}</h2><p>{exercise.equipment}</p></div>
      </div>
      <div className="target-card"><Target size={19} /><div><small>Primary target</small><strong>{muscle.family} · {targetTitle(muscle)}</strong></div><p>{muscle.function}</p></div>
      <div className="guide-grid">
        <div>
          <div className="section-heading"><span>How to perform it</span></div>
          <ol className="cue-list">
            {exercise.cues.map((cue, index) => <li key={cue}><span>{index + 1}</span><p>{cue}</p></li>)}
          </ol>
        </div>
        <div>
          <div className="section-heading"><span>Common mistakes</span></div>
          <ul className="mistake-list">
            {exercise.mistakes.map((mistake) => <li key={mistake}><ShieldAlert size={17} /><span>{mistake}</span></li>)}
          </ul>
        </div>
      </div>
      <button className="primary-button full" onClick={onLog}><BookOpen size={18} /> Log this exercise</button>
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
      setError('Enter a valid weight and whole numbers for reps and sets.')
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
      <div className="dialog-topline compact"><div><div className="eyebrow">Quick log</div><h2>{exercise.name}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close log form"><X size={20} /></button></div>
      {latest && <div className="last-session"><History size={17} /><span>Last time: {round(displayWeight(latest.weightKg, unit))} {unit} · {latest.sets} × {latest.reps}</span></div>}
      <form onSubmit={submit}>
        <div className="unit-toggle wide" aria-label="Weight unit">
          <button type="button" className={unit === 'kg' ? 'selected' : ''} onClick={() => changeUnit('kg')}>Kilograms</button>
          <button type="button" className={unit === 'lb' ? 'selected' : ''} onClick={() => changeUnit('lb')}>Pounds</button>
        </div>
        <div className="number-grid">
          <label>Weight ({unit})<input autoFocus inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="0" /></label>
          <label>Reps<input inputMode="numeric" value={reps} onChange={(event) => setReps(event.target.value)} /></label>
          <label>Sets<input inputMode="numeric" value={sets} onChange={(event) => setSets(event.target.value)} /></label>
        </div>
        <label className="field-label">Date and time<input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="field-label">Note <span>optional</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tempo, form, or how the set felt" rows={2} /></label>
        {error && <div className="form-error"><ShieldAlert size={16} /> {error}</div>}
        <button className="primary-button full" type="submit"><Check size={18} /> Save workout</button>
      </form>
    </DialogFrame>
  )
}

function ConfirmDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <DialogFrame onClose={onCancel} className="confirm-dialog">
      <span className="danger-symbol"><Trash2 size={24} /></span>
      <h2>Clear all training data?</h2>
      <p>This removes workout history and weekly completion from this device. It cannot be undone.</p>
      <div className="confirm-actions"><button className="secondary-button" onClick={onCancel}>Cancel</button><button className="danger-button" onClick={onConfirm}>Clear data</button></div>
    </DialogFrame>
  )
}

export default App
