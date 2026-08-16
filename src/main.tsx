import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, ArrowLeft, BarChart3, CalendarDays, Check, ChevronRight, Dumbbell, History, Home, Play, RotateCcw, Target, TrendingUp, UserRound, X } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './styles.css'

type Exercise = { id: string; name: string; equipment: string; target: string; steps: string[] }
type Head = { id: string; muscle: string; name: string; note: string; side: 'front' | 'back'; path: string; exercises: Exercise[] }
type Log = { id: string; exerciseId: string; date: string; weightKg: number; reps: number; sets: number }

const E = (id:string,name:string,equipment:string,target:string,steps:string[]):Exercise=>({id,name,equipment,target,steps})
const exerciseSets: Record<string, [string,string,string,string,string[]]> = {
 'chest-upper':['incline-barbell-press','Incline Barbell Press','barbell','Upper / Clavicular Head',['Set a 30–45° bench angle.','Retract your shoulder blades and lower the bar to the upper chest.','Press up while keeping your wrists stacked over your elbows.']],
 'chest-lower':['decline-db-press','Decline Dumbbell Press','dumbbell','Lower / Sternal Head',['Set a slight decline and brace your feet.','Lower the dumbbells toward the lower chest.','Press up without letting the shoulders roll forward.']],
 'lats':['neutral-pulldown','Neutral-Grip Lat Pulldown','cable machine','Lats',['Pull your elbows toward your hips.','Pause when the bar reaches upper-chest height.','Control the return until your lats fully lengthen.']],
 'upper-traps':['barbell-shrug','Barbell Shrug','barbell','Upper Traps',['Stand tall with the bar at your thighs.','Elevate your shoulders straight up.','Pause briefly, then lower under control.']],
 'mid-traps':['chest-row','Chest-Supported Row','dumbbell/bench','Mid Traps',['Brace your chest against the bench.','Pull your elbows back and squeeze between the shoulder blades.','Lower slowly without losing tension.']],
 'lower-traps':['incline-y-raise','Incline Y Raise','dumbbell/bench','Lower Traps',['Lie prone on an incline bench.','Raise light dumbbells in a Y shape.','Pause, then lower slowly.']],
 'rhomboids':['cable-retraction','Cable Scapular Retraction','cable machine','Rhomboids',['Use light resistance with arms nearly straight.','Draw the shoulder blades together.','Return slowly without shrugging.']],
 'erectors':['back-extension','45-Degree Back Extension','bench/bodyweight','Erector Spinae',['Brace your trunk and hinge at the hips.','Extend until your torso is neutral.','Avoid hyperextending the spine.']],
 'deltoid-anterior':['seated-db-press','Seated Dumbbell Shoulder Press','dumbbell','Anterior Deltoid',['Set the bench upright and brace your core.','Press dumbbells overhead in a controlled path.','Lower until elbows are just below shoulder height.']],
 'deltoid-lateral':['db-lateral-raise','Dumbbell Lateral Raise','dumbbell','Lateral Deltoid',['Stand tall with soft elbows.','Raise the dumbbells out to shoulder height.','Lower slowly while keeping tension on the delts.']],
 'deltoid-posterior':['reverse-fly','Reverse Dumbbell Fly','dumbbell/bench','Posterior Deltoid',['Hinge forward with a neutral spine.','Sweep the arms outward without shrugging.','Return with control.']],
 'biceps-long':['incline-curl','Incline Dumbbell Curl','dumbbell/bench','Biceps Long Head',['Set an incline bench and let the arms hang back.','Curl without moving the elbows forward.','Lower fully under control.']],
 'biceps-short':['preacher-curl','Preacher Curl','barbell/machine','Biceps Short Head',['Place the upper arms firmly on the pad.','Curl toward the shoulders without lifting the elbows.','Lower until the arms are nearly straight.']],
 'brachialis':['hammer-curl','Hammer Curl','dumbbell','Brachialis',['Keep palms facing each other.','Curl with elbows close to your sides.','Lower slowly.']],
 'triceps-long':['overhead-rope','Overhead Rope Triceps Extension','cable machine','Triceps Long Head',['Face away from the cable and brace your core.','Extend the elbows while keeping them pointed forward.','Return under control into a deep stretch.']],
 'triceps-lateral':['rope-pushdown','Rope Triceps Pushdown','cable machine','Triceps Lateral Head',['Pin your elbows to your sides.','Push the rope down and slightly apart.','Return until the elbows are fully flexed.']],
 'triceps-medial':['close-grip-bench','Close-Grip Bench Press','barbell/bench','Triceps Medial Head',['Use a shoulder-width or slightly narrower grip.','Lower the bar with elbows controlled.','Press while keeping the bar path stable.']],
 'forearm-flexors':['wrist-curl','Seated Wrist Curl','barbell','Forearm Flexors',['Rest your forearms on a bench or thighs.','Let the wrists extend, then curl them upward.','Use a controlled range without bouncing.']],
 'forearm-extensors':['reverse-wrist-curl','Reverse Wrist Curl','barbell','Forearm Extensors',['Place forearms securely with palms down.','Extend the wrists upward.','Lower slowly to a comfortable stretch.']],
 'abs-upper':['cable-crunch','Cable Crunch','cable machine','Upper Rectus Abdominis',['Kneel facing the cable.','Curl your ribcage toward your pelvis.','Return without letting the hips do the work.']],
 'abs-lower':['hanging-knee-raise','Hanging Knee Raise','pull-up bar','Lower Rectus Abdominis',['Hang with a stable grip.','Posteriorly tilt the pelvis as you raise the knees.','Lower without swinging.']],
 'obliques':['cable-side-bend','Cable Side Bend','cable machine','Obliques',['Stand side-on to a low cable.','Bend toward the cable under control.','Return to neutral and repeat.']],
 'quad-rectus':['leg-extension','Leg Extension','machine','Rectus Femoris',['Align the knee with the machine pivot.','Extend the knees smoothly.','Pause near the top and lower slowly.']],
 'quad-lateral':['hack-squat','Hack Squat','machine','Vastus Lateralis',['Set feet around shoulder width.','Descend with knees tracking toes.','Drive through the whole foot to stand.']],
 'quad-medial':['heel-elevated-squat','Heel-Elevated Squat','barbell/bodyweight','Vastus Medialis',['Elevate the heels slightly.','Squat deep while keeping knees tracking over toes.','Stand by driving through the floor.']],
 'quad-intermedius':['leg-press','Leg Press','machine','Vastus Intermedius',['Set the seat so knees and hips are comfortable.','Lower the platform under control.','Press without locking the knees aggressively.']],
 'ham-biceps':['seated-leg-curl','Seated Leg Curl','machine','Biceps Femoris',['Align the knee with the pivot.','Curl the pad down while keeping hips planted.','Return slowly.']],
 'ham-semitendinosus':['lying-leg-curl','Lying Leg Curl','machine','Semitendinosus',['Brace your hips against the pad.','Curl the heels toward the glutes.','Lower slowly while keeping hips down.']],
 'ham-semimembranosus':['romanian-deadlift','Romanian Deadlift','barbell','Semimembranosus',['Hinge by pushing the hips back.','Keep the bar close to your legs.','Stand by extending the hips without leaning back.']],
 'glute-max':['hip-thrust','Barbell Hip Thrust','barbell/bench','Gluteus Maximus',['Place your upper back on a bench.','Drive through the feet and extend the hips.','Pause at full hip extension without over-arching.']],
 'glute-med':['cable-abduction','Cable Hip Abduction','cable machine','Gluteus Medius',['Stand tall holding support.','Move the working leg out to the side.','Return slowly without rotating the pelvis.']],
 'calf-medial':['standing-calf','Standing Calf Raise','calf machine','Gastrocnemius Medial Head',['Place the balls of your feet on the platform.','Rise through a full ankle range.','Pause at the top and lower deeply.']],
 'calf-lateral':['single-leg-calf','Single-Leg Calf Raise','bodyweight/dumbbell','Gastrocnemius Lateral Head',['Stand on one foot with support.','Drive through the big toe and rise high.','Lower slowly through the heel.']],
 'soleus':['seated-calf','Seated Calf Raise','calf machine','Soleus',['Sit with knees bent and feet on the platform.','Press through the forefoot to raise the heels.','Lower into a controlled stretch.']]
}

const heads: Head[] = [
 ['chest-upper','Chest','Upper / Clavicular Head','Upper chest fibers emphasize shoulder flexion and horizontal adduction.','front','M125 185 C140 160 160 160 175 185 L166 225 C151 235 139 235 125 225 Z'],
 ['chest-lower','Chest','Lower / Sternal Head','The sternal portion contributes strongly to horizontal pressing and adduction.','front','M125 225 C140 225 160 225 175 225 L180 275 C160 290 140 290 120 275 Z'],
 ['lats','Back','Lats','The latissimus dorsi extends and adducts the upper arm.','back','M105 190 C125 180 175 180 195 190 L180 330 C160 345 140 345 120 330 Z'],
 ['upper-traps','Back','Upper Traps','Upper trapezius elevates and upwardly rotates the scapula.','back','M128 125 L172 125 L190 185 L160 175 L140 175 L110 185 Z'],
 ['mid-traps','Back','Mid Traps','Middle trapezius fibers primarily retract the scapula.','back','M115 180 L185 180 L178 235 L122 235 Z'],
 ['lower-traps','Back','Lower Traps','Lower trapezius assists scapular depression and upward rotation.','back','M135 220 L165 220 L175 295 L125 295 Z'],
 ['rhomboids','Back','Rhomboids','Rhomboids retract and stabilize the scapulae.','back','M137 175 L163 175 L168 245 L132 245 Z'],
 ['erectors','Back','Erector Spinae','The spinal erectors maintain extension and resist trunk flexion.','back','M138 235 L162 235 L168 360 L132 360 Z'],
 ['deltoid-anterior','Shoulders','Anterior Head','Front deltoid fibers assist shoulder flexion and pressing.','front','M104 150 C112 130 132 140 140 160 L128 205 L102 190 Z M196 150 C188 130 168 140 160 160 L172 205 L198 190 Z'],
 ['deltoid-lateral','Shoulders','Lateral Head','Lateral deltoid is a major contributor to arm abduction.','front','M98 160 C80 160 80 195 105 205 L120 185 L110 155 Z M202 160 C220 160 220 195 195 205 L180 185 L190 155 Z'],
 ['deltoid-posterior','Shoulders','Posterior Head','Rear deltoid fibers contribute to horizontal abduction and extension.','back','M98 160 C80 160 80 195 105 205 L120 185 L110 155 Z M202 160 C220 160 220 195 195 205 L180 185 L190 155 Z'],
 ['biceps-long','Biceps','Long Head','The long head crosses the shoulder and contributes to elbow flexion.','front','M108 215 L128 205 L136 285 L112 290 Z M192 215 L172 205 L164 285 L188 290 Z'],
 ['biceps-short','Biceps','Short Head','The short head assists elbow flexion and forearm supination.','front','M128 205 L142 205 L148 285 L132 288 Z M172 205 L158 205 L152 285 L168 288 Z'],
 ['brachialis','Biceps','Brachialis','Brachialis is a powerful elbow flexor independent of forearm position.','front','M116 270 L136 265 L140 330 L120 335 Z M184 270 L164 265 L160 330 L180 335 Z'],
 ['triceps-long','Triceps','Long Head','The long head crosses the shoulder and strongly contributes to elbow extension.','back','M108 210 L130 205 L137 295 L112 300 Z M192 210 L170 205 L163 295 L188 300 Z'],
 ['triceps-lateral','Triceps','Lateral Head','The lateral head is highly active during forceful elbow extension.','back','M105 230 L122 220 L130 300 L108 305 Z M195 230 L178 220 L170 300 L192 305 Z'],
 ['triceps-medial','Triceps','Medial Head','The medial head contributes to elbow extension across ranges.','back','M122 260 L140 255 L143 315 L125 318 Z M178 260 L160 255 L157 315 L175 318 Z'],
 ['forearm-flexors','Forearms','Flexors','Forearm flexors control wrist and finger flexion and grip.','front','M112 300 L132 295 L126 380 L104 375 Z M188 300 L168 295 L174 380 L196 375 Z'],
 ['forearm-extensors','Forearms','Extensors','Forearm extensors stabilize and extend the wrist and fingers.','back','M112 300 L132 295 L126 380 L104 375 Z M188 300 L168 295 L174 380 L196 375 Z'],
 ['abs-upper','Abs','Upper Rectus Abdominis','The upper rectus fibers flex the trunk and compress the abdomen.','front','M138 230 L162 230 L166 285 L134 285 Z'],
 ['abs-lower','Abs','Lower Rectus Abdominis','Lower rectus fibers contribute to trunk flexion and pelvic control.','front','M134 285 L166 285 L168 345 L132 345 Z'],
 ['obliques','Abs','Obliques','The obliques rotate, laterally flex and stabilize the trunk.','front','M120 255 L138 270 L130 345 L110 320 Z M180 255 L162 270 L170 345 L190 320 Z'],
 ['quad-rectus','Quadriceps','Rectus Femoris','Rectus femoris crosses the hip and knee and extends the knee.','front','M130 345 L148 340 L150 455 L125 455 Z M170 345 L152 340 L150 455 L175 455 Z'],
 ['quad-lateral','Quadriceps','Vastus Lateralis','Vastus lateralis is a major lateral knee extensor.','front','M112 350 L132 345 L130 455 L108 445 Z M188 350 L168 345 L170 455 L192 445 Z'],
 ['quad-medial','Quadriceps','Vastus Medialis','Vastus medialis supports knee extension and medial patellar control.','front','M132 420 L150 410 L150 470 L128 468 Z M168 420 L150 410 L150 470 L172 468 Z'],
 ['quad-intermedius','Quadriceps','Vastus Intermedius','Vastus intermedius lies deep to rectus femoris and extends the knee.','front','M138 350 L162 350 L162 440 L138 440 Z'],
 ['ham-biceps','Hamstrings','Biceps Femoris','Biceps femoris contributes to knee flexion and hip extension.','back','M110 350 L135 345 L140 455 L115 455 Z M190 350 L165 345 L160 455 L185 455 Z'],
 ['ham-semitendinosus','Hamstrings','Semitendinosus','Semitendinosus flexes the knee and extends the hip.','back','M135 350 L148 345 L150 455 L132 455 Z M165 350 L152 345 L150 455 L168 455 Z'],
 ['ham-semimembranosus','Hamstrings','Semimembranosus','Semimembranosus is a medial hamstring supporting knee flexion and hip extension.','back','M125 360 L140 350 L145 455 L125 455 Z M175 360 L160 350 L155 455 L175 455 Z'],
 ['glute-max','Glutes','Gluteus Maximus','Gluteus maximus is the primary hip extensor and a powerful lower-body driver.','back','M110 325 C125 300 140 315 150 335 C160 315 175 300 190 325 L185 390 C165 405 135 405 115 390 Z'],
 ['glute-med','Glutes','Gluteus Medius','Gluteus medius stabilizes the pelvis and abducts the hip.','back','M105 300 C120 280 138 285 150 310 L135 350 L110 345 Z M195 300 C180 280 162 285 150 310 L165 350 L190 345 Z'],
 ['calf-medial','Calves','Gastrocnemius — Medial Head','The medial gastrocnemius contributes strongly to plantarflexion with the knee extended.','back','M125 450 L150 445 L150 555 L125 550 Z'],
 ['calf-lateral','Calves','Gastrocnemius — Lateral Head','The lateral gastrocnemius contributes to plantarflexion and knee stability.','back','M150 445 L175 450 L175 550 L150 555 Z'],
 ['soleus','Calves','Soleus','Soleus is a deep plantarflexor emphasized with a bent knee.','back','M130 500 L150 495 L150 575 L128 570 Z M150 495 L170 500 L172 570 L150 575 Z']
].map(([id,muscle,name,note,side,path])=>({id,muscle,name,note,side,path,exercises:[]} as Head))

for (const h of heads) {
  const base = exerciseSets[h.id]
  const [id,name,equipment,target,steps] = base
  h.exercises = [E(id,name,equipment,target,steps), E(`${id}-alt`, `Seated ${name.replace('Standing ','').replace('Incline ','')}`, equipment, target, steps), E(`${id}-tempo`, `${name} — Controlled Tempo`, equipment, target, steps)]
}

const program = [
 {day:'A',title:'Upper 1',items:[['Flat Bench Press','3 × 8–10'],['Barbell / Cable Row','3 × 8–10'],['Overhead Press','3 × 8–10'],['Lat Pulldown / Pull-up','3 × 8–10'],['Biceps Curl','2 × 10–12'],['Triceps Pushdown','2 × 10–12']]},
 {day:'B',title:'Lower 1',items:[['Back Squat','3 × 8–10'],['Romanian Deadlift','3 × 8–10'],['Leg Press','3 × 10–12'],['Standing Calf Raise','3 × 12–15'],['Plank / Hanging Leg Raise','3 × near-failure']]},
 {day:'C',title:'Upper 2',items:[['Incline DB Press','3 × 8–10'],['Seated Cable Row','3 × 8–10'],['Lateral Raise','3 × 12–15'],['Face Pull','3 × 12–15'],['Hammer Curl','2 × 10–12'],['Overhead Triceps Extension','2 × 10–12']]},
 {day:'D',title:'Lower 2',items:[['Leg Press / Light Deadlift','3 × 8–10'],['Walking Lunge','3 × 10–12 / leg'],['Leg Curl','3 × 10–12'],['Seated Calf Raise','3 × 12–15'],['Cable Crunch','3 × 12–15']]}]

const loadLogs = ():Log[] => { try{return JSON.parse(localStorage.getItem('musclemap:logs')||'[]')}catch{return []} }
const saveLogs = (logs:Log[]) => localStorage.setItem('musclemap:logs',JSON.stringify(logs))

function BodyDiagram({side,onSelect}:{side:'front'|'back';onSelect:(h:Head)=>void}) {
 const visible=heads.filter(h=>h.side===side)
 return <div className="body-wrap"><svg viewBox="0 0 300 600" className="body-svg" aria-label={`${side} anatomy diagram`}>
   <circle cx="150" cy="72" r="35" className="body-base"/><path d="M125 112 Q150 98 175 112 L205 170 L190 300 L175 345 L190 455 L175 575 L150 580 L125 575 L110 455 L125 345 L110 300 L95 170 Z" className="body-base"/>
   {visible.map((h,i)=><path key={h.id} d={h.path} className="muscle-path" tabIndex={0} onClick={()=>onSelect(h)} onKeyDown={e=>{if(e.key==='Enter')onSelect(h)}} aria-label={h.name} style={{animationDelay:`${i*12}ms`}}/>)}
 </svg><div className="diagram-tip"><Target size={14}/> Tap a highlighted region</div></div>
}

function App(){
 const [tab,setTab]=useState('home'); const [side,setSide]=useState<'front'|'back'>('front'); const [selected,setSelected]=useState<Head|null>(null); const [exercise,setExercise]=useState<Exercise|null>(null); const [logs,setLogs]=useState<Log[]>(loadLogs); const [logOpen,setLogOpen]=useState(false); const [weight,setWeight]=useState(''); const [reps,setReps]=useState('10'); const [sets,setSets]=useState('3'); const [unit,setUnit]=useState<'kg'|'lb'>('kg');
 useEffect(()=>saveLogs(logs),[logs])
 const addLog=()=>{const w=Number(weight)||0; const kg=unit==='lb'?w/2.20462:w; if(!exercise||!kg)return; const next={id:crypto.randomUUID(),exerciseId:exercise.id,date:new Date().toISOString(),weightKg:kg,reps:Number(reps)||0,sets:Number(sets)||1};setLogs(v=>[...v,next]);setLogOpen(false);setWeight('');}
 const goExercise=(e:Exercise)=>{setExercise(e);setSelected(null)}
 return <div className="app" dir="ltr">
   <header className="topbar"><div><div className="eyebrow">MUSCLEMAP</div><h1>{tab==='home'?'Train with precision':tab==='program'?'Your program':tab==='progress'?'Your progress':'Training history'}</h1></div><button className="icon-btn" onClick={()=>{setLogs([])}} title="Reset local data"><RotateCcw size={18}/></button></header>
   <main className="content">
    {tab==='home'&&<HomeScreen side={side} setSide={setSide} onSelect={setSelected}/>} 
    {tab==='program'&&<ProgramScreen onExercise={goExercise}/>} 
    {tab==='progress'&&<ProgressScreen logs={logs}/>} 
    {tab==='history'&&<HistoryScreen logs={logs}/>} 
   </main>
   <nav className="tabbar">{[['home',Home,'Home'],['program',CalendarDays,'Program'],['progress',BarChart3,'Progress'],['history',History,'History']].map(([id,Icon,label])=><button key={id as string} className={tab===id?'tab active':'tab'} onClick={()=>setTab(id as string)}><Icon size={20}/><span>{label as string}</span></button>)}</nav>
   {selected&&<div className="overlay" onClick={()=>setSelected(null)}><section className="sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><button className="close" onClick={()=>setSelected(null)}><X size={20}/></button><div className="eyebrow">{selected.muscle}</div><h2>{selected.name}</h2><p className="muted">{selected.note}</p><div className="section-label">PRIMARY EXERCISES</div>{selected.exercises.map(e=><button className="exercise-row" key={e.id} onClick={()=>goExercise(e)}><div><strong>{e.name}</strong><small>{e.equipment} · {e.target}</small></div><ChevronRight size={19}/></button>)}</section></div>}
   {exercise&&<div className="overlay"><section className="exercise-screen"><div className="exercise-top"><button className="icon-btn" onClick={()=>setExercise(null)}><ArrowLeft size={20}/></button><span>Exercise</span><button className="icon-btn" onClick={()=>setExercise(null)}><X size={20}/></button></div><div className="exercise-art"><Dumbbell size={42}/><div>FORM PREVIEW</div><Play size={18}/></div><div className="eyebrow">TARGET HEAD</div><h2>{exercise.target}</h2><h3>{exercise.name}</h3><p className="muted">Equipment: {exercise.equipment}</p><div className="steps">{exercise.steps.map((s,i)=><div key={s}><span>{i+1}</span><p>{s}</p></div>)}</div><button className="primary log-btn" onClick={()=>setLogOpen(true)}>Log This Set <ChevronRight size={19}/></button></section></div>}
   {logOpen&&exercise&&<div className="overlay"><section className="log-sheet"><div className="sheet-handle"/><div className="log-head"><div><div className="eyebrow">QUICK LOG</div><h2>{exercise.name}</h2></div><button className="icon-btn" onClick={()=>setLogOpen(false)}><X size={20}/></button></div><div className="unit-toggle"><button className={unit==='kg'?'selected':''} onClick={()=>setUnit('kg')}>kg</button><button className={unit==='lb'?'selected':''} onClick={()=>setUnit('lb')}>lb</button></div><div className="number-grid"><label>Weight<input inputMode="decimal" autoFocus value={weight} onChange={e=>setWeight(e.target.value)} placeholder="0"/></label><label>Reps<input inputMode="numeric" value={reps} onChange={e=>setReps(e.target.value)}/></label><label>Sets<input inputMode="numeric" value={sets} onChange={e=>setSets(e.target.value)}/></label></div><div className="date-line"><CalendarDays size={17}/> {new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</div><button className="primary" onClick={addLog}><Check size={19}/> Save Set</button></section></div>}
 </div>
}

function HomeScreen({side,setSide,onSelect}:{side:'front'|'back';setSide:(v:'front'|'back')=>void;onSelect:(h:Head)=>void}){return <><div className="segmented"><button className={side==='front'?'selected':''} onClick={()=>setSide('front')}>Front</button><button className={side==='back'?'selected':''} onClick={()=>setSide('back')}>Back</button></div><BodyDiagram side={side} onSelect={onSelect}/><div className="quick-cards"><div><Activity size={18}/><strong>{heads.length}</strong><span>muscle heads</span></div><div><Dumbbell size={18}/><strong>3+</strong><span>exercises each</span></div></div></>}
function ProgramScreen({onExercise}:{onExercise:(e:Exercise)=>void}){return <div className="stack">{program.map(d=><section className="program-card" key={d.day}><div className="day-badge">{d.day}</div><div className="program-title"><div><div className="eyebrow">DAY {d.day}</div><h2>{d.title}</h2></div><span>45–55 min</span></div>{d.items.map(([name,scheme])=><button className="program-row" key={name} onClick={()=>{const match=heads.flatMap(h=>h.exercises).find(e=>e.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])); if(match)onExercise(match)}}><div><strong>{name}</strong><small>{scheme}</small></div><ChevronRight size={18}/></button>)}</section>)}</div>}
function ProgressScreen({logs}:{logs:Log[]}){const groups=useMemo(()=>{const m=new Map<string,Log[]>();logs.forEach(l=>m.set(l.exerciseId,[...(m.get(l.exerciseId)||[]),l]));return [...m.entries()]},[logs]);const chart=groups[0]?.[1].map(l=>({date:new Date(l.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}),weight:+l.weightKg.toFixed(1),volume:+(l.weightKg*l.reps*l.sets).toFixed(0)}))||[];return <div className="stack"><div className="metric"><TrendingUp size={19}/><div><strong>{logs.length}</strong><span>logged sessions</span></div></div><section className="chart-card"><div className="section-label">TOP WORKING WEIGHT</div>{chart.length?<ResponsiveContainer width="100%" height={220}><LineChart data={chart}><XAxis dataKey="date" stroke="#71717a" fontSize={11}/><YAxis stroke="#71717a" fontSize={11}/><Tooltip contentStyle={{background:'#18181b',border:'1px solid #27272a',borderRadius:12}}/><Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer>:<Empty text="Log your first set to see strength trends."/>}</section><section className="chart-card"><div className="section-label">VOLUME OVER TIME</div>{chart.length?<ResponsiveContainer width="100%" height={220}><LineChart data={chart}><XAxis dataKey="date" stroke="#71717a" fontSize={11}/><YAxis stroke="#71717a" fontSize={11}/><Tooltip contentStyle={{background:'#18181b',border:'1px solid #27272a',borderRadius:12}}/><Line type="monotone" dataKey="volume" stroke="#60a5fa" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer>:<Empty text="Volume will appear after you log sets."/>}</section></div>}
function HistoryScreen({logs}:{logs:Log[]}){return <div className="stack">{logs.length===0?<Empty text="No sets logged yet. Your completed work will appear here."/>:[...logs].reverse().map(l=>{const e=heads.flatMap(h=>h.exercises).find(x=>x.id===l.exerciseId);return <div className="history-row" key={l.id}><div className="history-icon"><Dumbbell size={18}/></div><div><strong>{e?.name||'Exercise'}</strong><small>{new Date(l.date).toLocaleString()} · {l.reps} reps × {l.sets} sets</small></div><b>{l.weightKg.toFixed(1)} kg</b></div>})}</div>}
function Empty({text}:{text:string}){return <div className="empty"><History size={28}/><p>{text}</p></div>}

createRoot(document.getElementById('root')!).render(<App />)
