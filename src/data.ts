export type BodySide = 'front' | 'back'
export type Level = 'Beginner' | 'Intermediate'

export type Exercise = {
  id: string
  name: string
  equipment: string
  primaryMuscleId: string
  level: Level
  cues: string[]
  mistakes: string[]
}

export type Muscle = {
  id: string
  group: string
  name: string
  function: string
  side: BodySide
  path: string
}

export type ProgramItem = {
  id: string
  exerciseId: string
  prescription: string
  rest: string
}

export type ProgramDay = {
  id: string
  label: string
  title: string
  focus: string
  duration: string
  items: ProgramItem[]
}

const exercise = (
  id: string,
  name: string,
  equipment: string,
  primaryMuscleId: string,
  level: Level,
  cues: string[],
  mistakes: string[],
): Exercise => ({ id, name, equipment, primaryMuscleId, level, cues, mistakes })

export const exercises: Exercise[] = [
  exercise('incline-db-press', 'Incline dumbbell press', 'Dumbbells + bench', 'chest-upper', 'Beginner', ['Set the bench to 30–45°.', 'Keep shoulder blades gently pulled back.', 'Lower to the upper chest, then press up and slightly inward.'], ['Flaring the elbows straight out', 'Using an angle that is too steep']),
  exercise('low-high-fly', 'Low-to-high cable fly', 'Cable station', 'chest-upper', 'Intermediate', ['Start with handles low and behind the hips.', 'Sweep the hands toward upper-chest height.', 'Keep a soft, fixed elbow bend.'], ['Turning the movement into a front raise', 'Letting the shoulders roll forward']),
  exercise('chest-dip', 'Chest-focused dip', 'Dip bars', 'chest-lower', 'Intermediate', ['Lean the torso slightly forward.', 'Let the elbows travel out at a comfortable angle.', 'Press the bars down without shrugging.'], ['Dropping below a pain-free range', 'Bouncing out of the bottom']),
  exercise('high-low-fly', 'High-to-low cable fly', 'Cable station', 'chest-lower', 'Beginner', ['Set the handles above shoulder height.', 'Bring the hands down toward the lower sternum.', 'Pause briefly as the chest shortens.'], ['Using momentum', 'Over-bending the elbows']),
  exercise('neutral-pulldown', 'Neutral-grip lat pulldown', 'Cable station', 'lats', 'Beginner', ['Set the ribs down and chest tall.', 'Drive the elbows toward the hips.', 'Control the return to a full stretch.'], ['Pulling behind the neck', 'Leaning far backward']),
  exercise('one-arm-lat-row', 'One-arm cable lat row', 'Cable station', 'lats', 'Intermediate', ['Reach forward without twisting.', 'Pull the elbow low and close to the body.', 'Pause at the hip before returning.'], ['Shrugging toward the ear', 'Rotating through the torso']),
  exercise('barbell-shrug', 'Barbell shrug', 'Barbell', 'upper-traps', 'Beginner', ['Stand tall with the bar at the thighs.', 'Lift the shoulders straight upward.', 'Pause, then lower slowly.'], ['Rolling the shoulders', 'Bending the elbows to move the bar']),
  exercise('farmer-carry', 'Farmer carry', 'Dumbbells or trap bar', 'upper-traps', 'Beginner', ['Stand tall with the ribs stacked over the pelvis.', 'Take short, controlled steps.', 'Keep the shoulders stable as the load pulls downward.'], ['Leaning side to side', 'Using a load that breaks posture']),
  exercise('chest-supported-row', 'Chest-supported row', 'Dumbbells + bench', 'mid-traps', 'Beginner', ['Brace the chest against the pad.', 'Pull the elbows back and slightly outward.', 'Squeeze between the shoulder blades.'], ['Lifting the chest off the pad', 'Shrugging during the pull']),
  exercise('prone-t-raise', 'Prone T raise', 'Light dumbbells + bench', 'mid-traps', 'Beginner', ['Lie face down on a low incline.', 'Lift the arms into a T with thumbs forward.', 'Use a small, controlled range.'], ['Choosing weights that are too heavy', 'Extending the lower back']),
  exercise('incline-y-raise', 'Incline Y raise', 'Light dumbbells + bench', 'lower-traps', 'Beginner', ['Set the arms in a wide Y.', 'Reach long as you lift.', 'Keep the neck relaxed.'], ['Shrugging toward the ears', 'Swinging the weights']),
  exercise('wall-slide', 'Forearm wall slide', 'Wall', 'lower-traps', 'Beginner', ['Press the forearms lightly into the wall.', 'Slide upward without flaring the ribs.', 'Reach at the top, then return slowly.'], ['Arching the lower back', 'Forcing a painful shoulder range']),
  exercise('seated-cable-row', 'Seated cable row', 'Cable station', 'rhomboids', 'Beginner', ['Keep the torso still.', 'Pull toward the lower ribs.', 'Finish by drawing the shoulder blades together.'], ['Leaning back to start each rep', 'Letting the shoulders dump forward']),
  exercise('band-pull-apart', 'Band pull-apart', 'Resistance band', 'rhomboids', 'Beginner', ['Hold the band at shoulder height.', 'Spread the hands while keeping the ribs down.', 'Return under control.'], ['Shrugging', 'Hyperextending the lower back']),
  exercise('back-extension', '45° back extension', 'Back-extension bench', 'erectors', 'Beginner', ['Hinge at the hips with a long spine.', 'Extend until the torso is neutral.', 'Keep the movement smooth.'], ['Hyperextending at the top', 'Rounding sharply under load']),
  exercise('bird-dog', 'Bird dog', 'Bodyweight', 'erectors', 'Beginner', ['Brace before moving.', 'Reach the opposite arm and leg long.', 'Keep the pelvis square to the floor.'], ['Rotating the hips', 'Rushing the movement']),
  exercise('seated-db-press', 'Seated dumbbell press', 'Dumbbells + bench', 'deltoid-anterior', 'Beginner', ['Brace the torso against the bench.', 'Press upward in a comfortable arc.', 'Lower until the elbows are just below shoulder level.'], ['Flaring the ribs', 'Forcing the dumbbells together']),
  exercise('half-kneeling-landmine', 'Half-kneeling landmine press', 'Barbell + landmine', 'deltoid-anterior', 'Beginner', ['Squeeze the glute on the kneeling side.', 'Press forward and upward.', 'Reach gently at the top.'], ['Leaning into the press', 'Losing rib position']),
  exercise('db-lateral-raise', 'Dumbbell lateral raise', 'Dumbbells', 'deltoid-lateral', 'Beginner', ['Keep a soft elbow bend.', 'Lead the arms out to the sides.', 'Stop near shoulder height and lower slowly.'], ['Swinging from the hips', 'Shrugging to finish the rep']),
  exercise('cable-lateral-raise', 'Cable lateral raise', 'Cable station', 'deltoid-lateral', 'Intermediate', ['Stand slightly away from the cable.', 'Lift in the plane of the shoulder blade.', 'Keep tension through the bottom.'], ['Twisting the torso', 'Using a jerking start']),
  exercise('reverse-fly', 'Reverse fly', 'Dumbbells + bench', 'deltoid-posterior', 'Beginner', ['Support the chest when possible.', 'Sweep the arms outward.', 'Keep the shoulders away from the ears.'], ['Turning it into a row', 'Using momentum']),
  exercise('rear-delt-row', 'Rear-delt row', 'Cable station', 'deltoid-posterior', 'Intermediate', ['Pull with elbows high and wide.', 'Keep the forearms aligned with the cable.', 'Pause briefly at the back.'], ['Shrugging', 'Overextending the shoulder']),
  exercise('incline-curl', 'Incline dumbbell curl', 'Dumbbells + bench', 'biceps-long', 'Beginner', ['Let the arms hang slightly behind the torso.', 'Keep the elbows still.', 'Lower to a full, controlled stretch.'], ['Moving the elbows forward', 'Lifting the shoulders']),
  exercise('bayesian-curl', 'Bayesian cable curl', 'Cable station', 'biceps-long', 'Intermediate', ['Stand just ahead of the cable.', 'Keep the upper arm behind the torso.', 'Curl without rotating the shoulder forward.'], ['Stepping too far from the stack', 'Shortening the bottom range']),
  exercise('preacher-curl', 'Preacher curl', 'Preacher bench', 'biceps-short', 'Beginner', ['Keep the upper arms on the pad.', 'Curl without lifting the elbows.', 'Stop just short of locking out.'], ['Bouncing at the bottom', 'Letting the wrists collapse']),
  exercise('spider-curl', 'Spider curl', 'Dumbbells + bench', 'biceps-short', 'Beginner', ['Lie chest-down on an incline.', 'Keep the upper arms vertical.', 'Squeeze at the top without swinging.'], ['Moving the shoulders', 'Using a shortened range']),
  exercise('hammer-curl', 'Hammer curl', 'Dumbbells', 'brachialis', 'Beginner', ['Keep the palms facing each other.', 'Pin the elbows near the sides.', 'Lower slowly.'], ['Swinging the torso', 'Letting the wrists bend']),
  exercise('reverse-curl', 'EZ-bar reverse curl', 'EZ bar', 'brachialis', 'Intermediate', ['Use a comfortable overhand grip.', 'Curl with the elbows quiet.', 'Control the eccentric.'], ['Choosing too much load', 'Allowing the wrists to droop']),
  exercise('overhead-rope-extension', 'Overhead rope extension', 'Cable station', 'triceps-long', 'Beginner', ['Brace the abdomen.', 'Point the elbows forward.', 'Extend fully without moving the upper arms.'], ['Flaring the ribs', 'Letting the elbows drift wide']),
  exercise('lying-triceps-extension', 'Lying triceps extension', 'EZ bar + bench', 'triceps-long', 'Intermediate', ['Angle the upper arms slightly back.', 'Lower behind the forehead.', 'Extend while keeping the elbows steady.'], ['Dropping the bar too quickly', 'Turning it into a press']),
  exercise('rope-pushdown', 'Rope pushdown', 'Cable station', 'triceps-lateral', 'Beginner', ['Keep the elbows at the sides.', 'Press down and gently separate the rope.', 'Return until the elbows are fully bent.'], ['Moving the shoulders', 'Leaning bodyweight onto the rope']),
  exercise('close-grip-push-up', 'Close-grip push-up', 'Bodyweight', 'triceps-lateral', 'Beginner', ['Place the hands just inside shoulder width.', 'Keep the body in one line.', 'Press the floor away.'], ['Flaring the elbows sharply', 'Letting the hips sag']),
  exercise('reverse-grip-pushdown', 'Reverse-grip pushdown', 'Cable station', 'triceps-medial', 'Intermediate', ['Use a light underhand grip.', 'Keep the elbows fixed.', 'Straighten the arms without bending the wrists.'], ['Using too much load', 'Pulling with the shoulders']),
  exercise('close-grip-bench', 'Close-grip bench press', 'Barbell + bench', 'triceps-medial', 'Intermediate', ['Use a shoulder-width grip.', 'Lower with controlled elbows.', 'Press while keeping the wrists stacked.'], ['Using an excessively narrow grip', 'Bouncing the bar']),
  exercise('wrist-curl', 'Seated wrist curl', 'Dumbbells', 'forearm-flexors', 'Beginner', ['Support the forearms on the thighs.', 'Let the wrists extend comfortably.', 'Curl the knuckles upward.'], ['Moving the elbows', 'Bouncing through the bottom']),
  exercise('loaded-carry', 'Heavy suitcase carry', 'Dumbbell or kettlebell', 'forearm-flexors', 'Beginner', ['Hold the load at one side.', 'Walk tall without leaning.', 'Keep a firm, even grip.'], ['Letting the load rest on the thigh', 'Rushing the steps']),
  exercise('reverse-wrist-curl', 'Reverse wrist curl', 'Dumbbells', 'forearm-extensors', 'Beginner', ['Support the forearms with palms down.', 'Lift the backs of the hands.', 'Lower through a comfortable range.'], ['Lifting the forearms', 'Using momentum']),
  exercise('rubber-band-extension', 'Finger band extension', 'Finger band', 'forearm-extensors', 'Beginner', ['Place the band around the fingertips.', 'Open the hand fully.', 'Return slowly without losing band tension.'], ['Snapping the fingers open', 'Using a band that limits range']),
  exercise('cable-crunch', 'Cable crunch', 'Cable station', 'abs-upper', 'Beginner', ['Keep the hips mostly still.', 'Curl the ribs toward the pelvis.', 'Exhale as the abdominals shorten.'], ['Pulling with the arms', 'Sitting the hips back']),
  exercise('stability-ball-crunch', 'Stability-ball crunch', 'Stability ball', 'abs-upper', 'Beginner', ['Support the lower back on the ball.', 'Start from a gentle abdominal stretch.', 'Curl the ribs toward the pelvis.'], ['Moving through the hips', 'Pulling on the neck']),
  exercise('hanging-knee-raise', 'Hanging knee raise', 'Pull-up bar', 'abs-lower', 'Intermediate', ['Begin from a quiet hang.', 'Tilt the pelvis backward as the knees rise.', 'Lower without swinging.'], ['Only flexing the hips', 'Using momentum']),
  exercise('reverse-crunch', 'Reverse crunch', 'Mat', 'abs-lower', 'Beginner', ['Press the lower back gently into the floor.', 'Roll the pelvis toward the ribs.', 'Lower with control.'], ['Throwing the legs overhead', 'Using a large swinging motion']),
  exercise('pallof-press', 'Pallof press', 'Cable station or band', 'obliques', 'Beginner', ['Stand side-on to the resistance.', 'Press the hands straight forward.', 'Resist rotation and breathe normally.'], ['Twisting toward the anchor', 'Leaning away from the cable']),
  exercise('side-plank', 'Side plank', 'Bodyweight', 'obliques', 'Beginner', ['Stack the elbow below the shoulder.', 'Lift the hips into a straight line.', 'Keep the ribs and pelvis stacked.'], ['Rolling the torso forward', 'Letting the hips drop']),
  exercise('leg-extension', 'Leg extension', 'Machine', 'quad-rectus', 'Beginner', ['Align the knee with the machine pivot.', 'Extend smoothly.', 'Pause briefly, then lower under control.'], ['Kicking the weight', 'Lifting the hips from the seat']),
  exercise('reverse-nordic', 'Reverse Nordic', 'Bodyweight', 'quad-rectus', 'Intermediate', ['Keep a straight line from knees to shoulders.', 'Lean backward from the knees.', 'Return by driving the feet into the floor.'], ['Bending at the hips', 'Forcing a painful knee range']),
  exercise('hack-squat', 'Hack squat', 'Hack-squat machine', 'quad-lateral', 'Beginner', ['Set the feet around shoulder width.', 'Descend with the knees tracking the toes.', 'Drive through the whole foot.'], ['Heels lifting', 'Knees collapsing inward']),
  exercise('narrow-leg-press', 'Narrow-stance leg press', 'Leg-press machine', 'quad-lateral', 'Beginner', ['Place the feet at a comfortable narrow width.', 'Lower until the pelvis is about to tuck.', 'Press without aggressively locking the knees.'], ['Using a range that rounds the lower back', 'Letting the knees cave']),
  exercise('heel-elevated-squat', 'Heel-elevated squat', 'Dumbbell or barbell', 'quad-medial', 'Beginner', ['Elevate the heels slightly.', 'Allow the knees to travel forward over the toes.', 'Stay balanced through the whole foot.'], ['Collapsing onto the inner foot', 'Rushing the bottom']),
  exercise('split-squat', 'Front-foot-elevated split squat', 'Dumbbells + low step', 'quad-medial', 'Intermediate', ['Use a stable split stance.', 'Let the front knee travel forward comfortably.', 'Drive up through the front foot.'], ['Pushing mostly from the back leg', 'Losing balance for extra depth']),
  exercise('leg-press', 'Leg press', 'Leg-press machine', 'quad-intermedius', 'Beginner', ['Set the seat for a controlled depth.', 'Track the knees over the toes.', 'Press through the mid-foot.'], ['Locking the knees forcefully', 'Allowing the pelvis to roll up']),
  exercise('front-squat', 'Front squat', 'Barbell', 'quad-intermedius', 'Intermediate', ['Keep the elbows high.', 'Sit between the hips while the knees travel forward.', 'Maintain pressure through the whole foot.'], ['Dropping the elbows', 'Shifting onto the toes']),
  exercise('seated-leg-curl', 'Seated leg curl', 'Machine', 'ham-biceps', 'Beginner', ['Align the knee with the machine pivot.', 'Keep the hips against the pad.', 'Curl down and return slowly.'], ['Lifting the hips', 'Dropping the weight stack']),
  exercise('single-leg-rdl', 'Single-leg Romanian deadlift', 'Dumbbell', 'ham-biceps', 'Intermediate', ['Keep a soft bend in the standing knee.', 'Reach the free leg backward as the torso tips.', 'Keep the hips square.'], ['Opening the hip', 'Rounding the back']),
  exercise('lying-leg-curl', 'Lying leg curl', 'Machine', 'ham-semitendinosus', 'Beginner', ['Brace the hips against the pad.', 'Curl the heels toward the glutes.', 'Lower fully under control.'], ['Arching the lower back', 'Bouncing the pad']),
  exercise('slider-leg-curl', 'Slider leg curl', 'Floor sliders', 'ham-semitendinosus', 'Intermediate', ['Start in a bridge.', 'Slide the heels away without dropping the hips.', 'Pull the heels back under control.'], ['Losing hip extension', 'Moving too quickly']),
  exercise('romanian-deadlift', 'Romanian deadlift', 'Barbell', 'ham-semimembranosus', 'Intermediate', ['Push the hips backward.', 'Keep the bar close to the legs.', 'Stand by extending the hips.'], ['Turning it into a squat', 'Reaching beyond a neutral spine']),
  exercise('assisted-nordic', 'Assisted Nordic curl', 'Anchor + resistance band', 'ham-semimembranosus', 'Intermediate', ['Keep a straight line from knees to shoulders.', 'Lower as slowly as possible.', 'Use the band or hands only as much as needed.'], ['Bending at the hips', 'Dropping without control']),
  exercise('hip-thrust', 'Barbell hip thrust', 'Barbell + bench', 'glute-max', 'Beginner', ['Place the shoulder blades on the bench.', 'Drive through the feet.', 'Finish with the ribs down and hips extended.'], ['Overarching the lower back', 'Pushing through the toes']),
  exercise('cable-kickback', 'Cable hip extension', 'Cable station', 'glute-max', 'Beginner', ['Brace while holding support.', 'Drive the leg backward without arching.', 'Pause when the glute is fully shortened.'], ['Rotating the pelvis', 'Swinging the leg']),
  exercise('cable-abduction', 'Cable hip abduction', 'Cable station', 'glute-med', 'Beginner', ['Stand tall with the cable crossing in front.', 'Move the leg out to the side.', 'Keep the toes mostly forward.'], ['Leaning far away', 'Opening the hip outward']),
  exercise('lateral-step-down', 'Lateral step-down', 'Low box', 'glute-med', 'Intermediate', ['Balance on one leg near the edge.', 'Reach the free heel toward the floor.', 'Keep the pelvis level and knee tracking forward.'], ['Hip dropping', 'Knee collapsing inward']),
  exercise('standing-calf', 'Standing calf raise', 'Calf machine', 'calf-medial', 'Beginner', ['Use a full, comfortable ankle range.', 'Rise through the big-toe side of the foot.', 'Pause at the top.'], ['Bouncing', 'Rolling onto the outer foot']),
  exercise('single-leg-calf', 'Single-leg calf raise', 'Bodyweight or dumbbell', 'calf-lateral', 'Beginner', ['Use support for balance.', 'Rise as high as possible without rolling the ankle.', 'Lower the heel slowly.'], ['Using knee motion', 'Rushing the stretch']),
  exercise('seated-calf', 'Seated calf raise', 'Calf machine', 'soleus', 'Beginner', ['Keep the knees bent around 90°.', 'Raise the heels through a full range.', 'Pause, then lower slowly.'], ['Bouncing off the bottom', 'Using a very short range']),
  exercise('bent-knee-calf', 'Bent-knee calf raise', 'Dumbbell + support', 'soleus', 'Beginner', ['Bend the knees and hold the position.', 'Raise both heels without straightening the legs.', 'Lower slowly.'], ['Turning it into a squat', 'Letting the arches collapse']),
]

export const muscles: Muscle[] = [
  { id: 'chest-upper', group: 'Chest', name: 'Upper chest', function: 'Raises and draws the upper arm across the body; emphasized by inclined pressing.', side: 'front', path: 'M125 185 C140 160 160 160 175 185 L166 225 C151 235 139 235 125 225 Z' },
  { id: 'chest-lower', group: 'Chest', name: 'Lower chest', function: 'Draws the upper arm across and downward; active in dips and decline pressing.', side: 'front', path: 'M125 225 C140 225 160 225 175 225 L180 275 C160 290 140 290 120 275 Z' },
  { id: 'lats', group: 'Back', name: 'Latissimus dorsi', function: 'Extends and adducts the upper arm, creating the broad shape of the back.', side: 'back', path: 'M105 190 C125 180 175 180 195 190 L180 330 C160 345 140 345 120 330 Z' },
  { id: 'upper-traps', group: 'Back', name: 'Upper trapezius', function: 'Elevates and upwardly rotates the shoulder blade.', side: 'back', path: 'M128 125 L172 125 L190 185 L160 175 L140 175 L110 185 Z' },
  { id: 'mid-traps', group: 'Back', name: 'Middle trapezius', function: 'Retracts the shoulder blades and supports stable rowing mechanics.', side: 'back', path: 'M115 180 L185 180 L178 235 L122 235 Z' },
  { id: 'lower-traps', group: 'Back', name: 'Lower trapezius', function: 'Helps depress and upwardly rotate the shoulder blade.', side: 'back', path: 'M135 220 L165 220 L175 295 L125 295 Z' },
  { id: 'rhomboids', group: 'Back', name: 'Rhomboids', function: 'Retract and stabilize the shoulder blades.', side: 'back', path: 'M137 175 L163 175 L168 245 L132 245 Z' },
  { id: 'erectors', group: 'Back', name: 'Erector spinae', function: 'Maintain spinal extension and resist trunk flexion.', side: 'back', path: 'M138 235 L162 235 L168 360 L132 360 Z' },
  { id: 'deltoid-anterior', group: 'Shoulders', name: 'Anterior deltoid', function: 'Raises the arm forward and assists pressing movements.', side: 'front', path: 'M104 150 C112 130 132 140 140 160 L128 205 L102 190 Z M196 150 C188 130 168 140 160 160 L172 205 L198 190 Z' },
  { id: 'deltoid-lateral', group: 'Shoulders', name: 'Lateral deltoid', function: 'Raises the arm to the side and contributes to shoulder width.', side: 'front', path: 'M98 160 C80 160 80 195 105 205 L120 185 L110 155 Z M202 160 C220 160 220 195 195 205 L180 185 L190 155 Z' },
  { id: 'deltoid-posterior', group: 'Shoulders', name: 'Posterior deltoid', function: 'Moves the arm backward and assists horizontal abduction.', side: 'back', path: 'M98 160 C80 160 80 195 105 205 L120 185 L110 155 Z M202 160 C220 160 220 195 195 205 L180 185 L190 155 Z' },
  { id: 'biceps-long', group: 'Arms', name: 'Biceps long head', function: 'Flexes the elbow and helps turn the palm upward.', side: 'front', path: 'M108 215 L128 205 L136 285 L112 290 Z M192 215 L172 205 L164 285 L188 290 Z' },
  { id: 'biceps-short', group: 'Arms', name: 'Biceps short head', function: 'Assists elbow flexion and forearm supination.', side: 'front', path: 'M128 205 L142 205 L148 285 L132 288 Z M172 205 L158 205 L152 285 L168 288 Z' },
  { id: 'brachialis', group: 'Arms', name: 'Brachialis', function: 'A strong elbow flexor in every forearm position.', side: 'front', path: 'M116 270 L136 265 L140 330 L120 335 Z M184 270 L164 265 L160 330 L180 335 Z' },
  { id: 'triceps-long', group: 'Arms', name: 'Triceps long head', function: 'Extends the elbow and crosses the shoulder joint.', side: 'back', path: 'M108 210 L130 205 L137 295 L112 300 Z M192 210 L170 205 L163 295 L188 300 Z' },
  { id: 'triceps-lateral', group: 'Arms', name: 'Triceps lateral head', function: 'Contributes strongly to forceful elbow extension.', side: 'back', path: 'M105 230 L122 220 L130 300 L108 305 Z M195 230 L178 220 L170 300 L192 305 Z' },
  { id: 'triceps-medial', group: 'Arms', name: 'Triceps medial head', function: 'Supports elbow extension throughout the movement range.', side: 'back', path: 'M122 260 L140 255 L143 315 L125 318 Z M178 260 L160 255 L157 315 L175 318 Z' },
  { id: 'forearm-flexors', group: 'Forearms', name: 'Forearm flexors', function: 'Flex the wrist and fingers and contribute to grip strength.', side: 'front', path: 'M112 300 L132 295 L126 380 L104 375 Z M188 300 L168 295 L174 380 L196 375 Z' },
  { id: 'forearm-extensors', group: 'Forearms', name: 'Forearm extensors', function: 'Extend and stabilize the wrist and fingers.', side: 'back', path: 'M112 300 L132 295 L126 380 L104 375 Z M188 300 L168 295 L174 380 L196 375 Z' },
  { id: 'abs-upper', group: 'Core', name: 'Upper rectus abdominis', function: 'Flexes the trunk and brings the ribs toward the pelvis.', side: 'front', path: 'M138 230 L162 230 L166 285 L134 285 Z' },
  { id: 'abs-lower', group: 'Core', name: 'Lower rectus abdominis', function: 'Supports trunk flexion and posterior pelvic control.', side: 'front', path: 'M134 285 L166 285 L168 345 L132 345 Z' },
  { id: 'obliques', group: 'Core', name: 'Obliques', function: 'Rotate, laterally flex, and stabilize the trunk.', side: 'front', path: 'M120 255 L138 270 L130 345 L110 320 Z M180 255 L162 270 L170 345 L190 320 Z' },
  { id: 'quad-rectus', group: 'Quadriceps', name: 'Rectus femoris', function: 'Extends the knee and also crosses the hip.', side: 'front', path: 'M130 345 L148 340 L150 455 L125 455 Z M170 345 L152 340 L150 455 L175 455 Z' },
  { id: 'quad-lateral', group: 'Quadriceps', name: 'Vastus lateralis', function: 'A large lateral knee extensor.', side: 'front', path: 'M112 350 L132 345 L130 455 L108 445 Z M188 350 L168 345 L170 455 L192 445 Z' },
  { id: 'quad-medial', group: 'Quadriceps', name: 'Vastus medialis', function: 'Extends the knee and supports medial patellar control.', side: 'front', path: 'M132 420 L150 410 L150 470 L128 468 Z M168 420 L150 410 L150 470 L172 468 Z' },
  { id: 'quad-intermedius', group: 'Quadriceps', name: 'Vastus intermedius', function: 'A deep quadriceps muscle that extends the knee.', side: 'front', path: 'M138 350 L162 350 L162 440 L138 440 Z' },
  { id: 'ham-biceps', group: 'Hamstrings', name: 'Biceps femoris', function: 'Flexes the knee and assists hip extension.', side: 'back', path: 'M110 350 L135 345 L140 455 L115 455 Z M190 350 L165 345 L160 455 L185 455 Z' },
  { id: 'ham-semitendinosus', group: 'Hamstrings', name: 'Semitendinosus', function: 'Flexes the knee and extends the hip.', side: 'back', path: 'M135 350 L148 345 L150 455 L132 455 Z M165 350 L152 345 L150 455 L168 455 Z' },
  { id: 'ham-semimembranosus', group: 'Hamstrings', name: 'Semimembranosus', function: 'A medial hamstring supporting knee flexion and hip extension.', side: 'back', path: 'M125 360 L140 350 L145 455 L125 455 Z M175 360 L160 350 L155 455 L175 455 Z' },
  { id: 'glute-max', group: 'Glutes', name: 'Gluteus maximus', function: 'The primary hip extensor and a powerful lower-body driver.', side: 'back', path: 'M110 325 C125 300 140 315 150 335 C160 315 175 300 190 325 L185 390 C165 405 135 405 115 390 Z' },
  { id: 'glute-med', group: 'Glutes', name: 'Gluteus medius', function: 'Abducts the hip and stabilizes the pelvis during single-leg work.', side: 'back', path: 'M105 300 C120 280 138 285 150 310 L135 350 L110 345 Z M195 300 C180 280 162 285 150 310 L165 350 L190 345 Z' },
  { id: 'calf-medial', group: 'Calves', name: 'Medial gastrocnemius', function: 'Plantarflexes the ankle with the knee extended.', side: 'back', path: 'M125 450 L150 445 L150 555 L125 550 Z' },
  { id: 'calf-lateral', group: 'Calves', name: 'Lateral gastrocnemius', function: 'Contributes to ankle plantarflexion and knee stability.', side: 'back', path: 'M150 445 L175 450 L175 550 L150 555 Z' },
  { id: 'soleus', group: 'Calves', name: 'Soleus', function: 'A deep plantarflexor emphasized when the knee is bent.', side: 'back', path: 'M130 500 L150 495 L150 575 L128 570 Z M150 495 L170 500 L172 570 L150 575 Z' },
]

export const program: ProgramDay[] = [
  {
    id: 'upper-1', label: 'Day A', title: 'Upper strength', focus: 'Horizontal push + pull', duration: '50 min',
    items: [
      { id: 'a1', exerciseId: 'incline-db-press', prescription: '3 × 6–8', rest: '2 min' },
      { id: 'a2', exerciseId: 'chest-supported-row', prescription: '3 × 6–8', rest: '2 min' },
      { id: 'a3', exerciseId: 'seated-db-press', prescription: '3 × 8–10', rest: '90 sec' },
      { id: 'a4', exerciseId: 'neutral-pulldown', prescription: '3 × 8–10', rest: '90 sec' },
      { id: 'a5', exerciseId: 'hammer-curl', prescription: '2 × 10–12', rest: '60 sec' },
      { id: 'a6', exerciseId: 'rope-pushdown', prescription: '2 × 10–12', rest: '60 sec' },
    ],
  },
  {
    id: 'lower-1', label: 'Day B', title: 'Lower strength', focus: 'Quads + posterior chain', duration: '50 min',
    items: [
      { id: 'b1', exerciseId: 'front-squat', prescription: '3 × 6–8', rest: '2–3 min' },
      { id: 'b2', exerciseId: 'romanian-deadlift', prescription: '3 × 8–10', rest: '2 min' },
      { id: 'b3', exerciseId: 'leg-press', prescription: '3 × 10–12', rest: '90 sec' },
      { id: 'b4', exerciseId: 'standing-calf', prescription: '3 × 12–15', rest: '60 sec' },
      { id: 'b5', exerciseId: 'reverse-crunch', prescription: '3 × 10–15', rest: '60 sec' },
    ],
  },
  {
    id: 'upper-2', label: 'Day C', title: 'Upper volume', focus: 'Back + shoulders', duration: '45 min',
    items: [
      { id: 'c1', exerciseId: 'high-low-fly', prescription: '3 × 10–12', rest: '75 sec' },
      { id: 'c2', exerciseId: 'seated-cable-row', prescription: '3 × 8–10', rest: '90 sec' },
      { id: 'c3', exerciseId: 'cable-lateral-raise', prescription: '3 × 12–15', rest: '60 sec' },
      { id: 'c4', exerciseId: 'reverse-fly', prescription: '3 × 12–15', rest: '60 sec' },
      { id: 'c5', exerciseId: 'preacher-curl', prescription: '2 × 10–12', rest: '60 sec' },
      { id: 'c6', exerciseId: 'overhead-rope-extension', prescription: '2 × 10–12', rest: '60 sec' },
    ],
  },
  {
    id: 'lower-2', label: 'Day D', title: 'Lower volume', focus: 'Glutes + single-leg control', duration: '45 min',
    items: [
      { id: 'd1', exerciseId: 'hip-thrust', prescription: '3 × 8–10', rest: '2 min' },
      { id: 'd2', exerciseId: 'split-squat', prescription: '3 × 10 / leg', rest: '90 sec' },
      { id: 'd3', exerciseId: 'seated-leg-curl', prescription: '3 × 10–12', rest: '75 sec' },
      { id: 'd4', exerciseId: 'seated-calf', prescription: '3 × 12–15', rest: '60 sec' },
      { id: 'd5', exerciseId: 'pallof-press', prescription: '3 × 10 / side', rest: '60 sec' },
    ],
  },
]

export const exerciseById = new Map(exercises.map((item) => [item.id, item]))
export const muscleById = new Map(muscles.map((item) => [item.id, item]))

export const exercisesForMuscle = (muscleId: string) =>
  exercises.filter((item) => item.primaryMuscleId === muscleId)

