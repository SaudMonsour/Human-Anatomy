import type { Exercise, Muscle, ProgramDay } from './data'
import { arabicExercises } from './exerciseTranslationsAr'

export type Language = 'en' | 'ar'

const en = {
  'language.switch': 'Switch to Arabic', 'language.next': 'العربية',
  'nav.label': 'Main navigation', 'nav.explore': 'Explore', 'nav.program': 'Program', 'nav.progress': 'Progress', 'nav.history': 'History',
  'tab.explore.eyebrow': 'Anatomy', 'tab.explore.title': 'Muscle explorer', 'tab.explore.description': 'Choose a muscle, select its exact part, and see matching exercises.',
  'tab.program.eyebrow': 'Program', 'tab.program.title': 'Four-day plan', 'tab.program.description': 'A simple upper–lower training week.',
  'tab.progress.eyebrow': 'Progress', 'tab.progress.title': 'Your progress', 'tab.progress.description': 'Track weight and training volume.',
  'tab.history.eyebrow': 'History', 'tab.history.title': 'Workout history', 'tab.history.description': 'Review or correct your saved sets.',
  'safety.note': 'Training guidance only. Stop if an exercise causes pain.',
  'search.placeholder': 'Search muscle or exercise', 'search.label': 'Search muscles and exercises', 'search.clear': 'Clear search', 'search.empty': 'No matches found.',
  'filter.all': 'All', 'filter.label': 'Filter muscle groups',
  'body.view': 'Body view', 'body.front': 'Front', 'body.back': 'Back', 'body.anterior': 'Anterior', 'body.posterior': 'Posterior', 'body.superficial': 'superficial view',
  'body.targetCount': '{count} targets', 'body.aria': '{side} superficial muscle map', 'body.currentTarget': '{region}: {count} exact targets, currently {part}', 'body.currentTargetOne': '{region}: one exact target, currently {part}',
  'body.selected': 'Selected', 'body.overlay': 'Muscle overlay', 'body.hint': 'Tap a muscle',
  'target.exact': 'Exact target', 'target.choose': 'Choose a specific target within {family}', 'target.head': 'Head', 'target.fibers': 'Fiber region', 'target.region': 'Region', 'target.muscle': 'Muscle',
  'target.note': 'Exercises emphasize this target; they do not completely isolate it.',
  'details.title': 'Muscle details', 'details.close': 'Close muscle details', 'details.exercises': 'Exercises', 'details.matched': '{count} matched', 'details.compare': 'Tap another highlighted muscle to compare exercises.',
  'exercise.beginner': 'Beginner', 'exercise.intermediate': 'Intermediate', 'exercise.fallback': 'Exercise', 'exercise.guide': 'Exercise guide', 'exercise.close': 'Close exercise',
  'exercise.primaryTarget': 'Primary target', 'exercise.how': 'How to do it', 'exercise.mistakes': 'Common mistakes', 'exercise.log': 'Log exercise',
  'program.thisWeek': 'this week', 'program.completion': 'Weekly completion', 'program.count': '{done} of {total} exercises', 'program.advice': 'Train steadily and leave a rest day between lower-body sessions.',
  'program.rest': 'rest', 'program.complete': 'Mark complete', 'program.incomplete': 'Mark incomplete',
  'progress.emptyTitle': 'Start with one workout', 'progress.emptyText': 'Choose an exercise and save your working weight to build your progress chart.', 'progress.explore': 'Explore exercises',
  'progress.exercise': 'Exercise', 'progress.unit': 'Display unit', 'progress.best': 'Best weight', 'progress.volume': 'Total volume', 'progress.sets': 'Working sets', 'progress.loading': 'Loading charts',
  'chart.weightEyebrow': 'Working weight', 'chart.weightTitle': 'Top load by day', 'chart.days': '{count} training days', 'chart.volumeEyebrow': 'Training volume', 'chart.volumeTitle': 'Work by day', 'chart.formula': 'weight × reps × sets',
  'history.emptyTitle': 'Nothing logged yet', 'history.emptyText': 'Your saved sets will appear here.', 'history.find': 'Find an exercise', 'history.filter': 'Filter workout history', 'history.clear': 'Clear data',
  'history.noMatch': 'No exercises match “{query}”.', 'history.entry': 'entry', 'history.entries': 'entries', 'history.volumeShort': 'vol', 'history.delete': 'Delete {exercise} entry', 'history.muscle': 'Muscle',
  'log.quick': 'Quick log', 'log.close': 'Close log form', 'log.last': 'Last time', 'log.unit': 'Weight unit', 'log.kilograms': 'Kilograms', 'log.pounds': 'Pounds',
  'log.weight': 'Weight', 'log.reps': 'Reps', 'log.sets': 'Sets', 'log.date': 'Date and time', 'log.note': 'Note', 'log.optional': 'optional', 'log.notePlaceholder': 'Tempo, form, or how the set felt',
  'log.error': 'Enter a valid weight and whole numbers for reps and sets.', 'log.save': 'Save workout',
  'confirm.title': 'Clear all training data?', 'confirm.text': 'This removes workout history and weekly completion from this device. It cannot be undone.', 'confirm.cancel': 'Cancel', 'confirm.clear': 'Clear data',
  'toast.saved': '{exercise} saved', 'toast.removed': 'Log entry removed', 'toast.undo': 'Undo', 'toast.cleared': 'Training data cleared',
} as const

export type TranslationKey = keyof typeof en

const ar: Record<TranslationKey, string> = {
  'language.switch': 'التبديل إلى الإنجليزية', 'language.next': 'EN',
  'nav.label': 'التنقل الرئيسي', 'nav.explore': 'العضلات', 'nav.program': 'البرنامج', 'nav.progress': 'التقدم', 'nav.history': 'السجل',
  'tab.explore.eyebrow': 'التشريح', 'tab.explore.title': 'مستكشف العضلات', 'tab.explore.description': 'اختر العضلة ثم الجزء المحدد وشاهد التمارين المناسبة.',
  'tab.program.eyebrow': 'البرنامج', 'tab.program.title': 'خطة أربعة أيام', 'tab.program.description': 'أسبوع تدريبي بسيط للجزء العلوي والسفلي.',
  'tab.progress.eyebrow': 'التقدم', 'tab.progress.title': 'تقدمك', 'tab.progress.description': 'تابع الأوزان وحجم التدريب.',
  'tab.history.eyebrow': 'السجل', 'tab.history.title': 'سجل التمارين', 'tab.history.description': 'راجع مجموعاتك المحفوظة أو صححها.',
  'safety.note': 'إرشادات تدريبية فقط. توقف إذا سبب التمرين ألماً.',
  'search.placeholder': 'ابحث عن عضلة أو تمرين', 'search.label': 'البحث في العضلات والتمارين', 'search.clear': 'مسح البحث', 'search.empty': 'لا توجد نتائج.',
  'filter.all': 'الكل', 'filter.label': 'تصفية مجموعات العضلات',
  'body.view': 'عرض الجسم', 'body.front': 'الأمام', 'body.back': 'الخلف', 'body.anterior': 'أمامي', 'body.posterior': 'خلفي', 'body.superficial': 'عرض سطحي',
  'body.targetCount': '{count} هدف', 'body.aria': 'خريطة العضلات السطحية — {side}', 'body.currentTarget': '{region}: ‏{count} أهداف محددة، الحالي {part}', 'body.currentTargetOne': '{region}: هدف محدد واحد، الحالي {part}',
  'body.selected': 'المحدد', 'body.overlay': 'طبقة العضلات', 'body.hint': 'اضغط على عضلة',
  'target.exact': 'الهدف المحدد', 'target.choose': 'اختر هدفاً محدداً داخل {family}', 'target.head': 'رأس', 'target.fibers': 'منطقة ألياف', 'target.region': 'منطقة', 'target.muscle': 'عضلة',
  'target.note': 'هذه التمارين تركز على الهدف، لكنها لا تعزله بالكامل.',
  'details.title': 'تفاصيل العضلة', 'details.close': 'إغلاق تفاصيل العضلة', 'details.exercises': 'التمارين', 'details.matched': '{count} مناسب', 'details.compare': 'اضغط على عضلة أخرى مضاءة لمقارنة التمارين.',
  'exercise.beginner': 'مبتدئ', 'exercise.intermediate': 'متوسط', 'exercise.fallback': 'تمرين', 'exercise.guide': 'شرح التمرين', 'exercise.close': 'إغلاق التمرين',
  'exercise.primaryTarget': 'الهدف الأساسي', 'exercise.how': 'طريقة الأداء', 'exercise.mistakes': 'أخطاء شائعة', 'exercise.log': 'تسجيل التمرين',
  'program.thisWeek': 'هذا الأسبوع', 'program.completion': 'إنجاز الأسبوع', 'program.count': '{done} من {total} تمريناً', 'program.advice': 'تدرب باستمرار واترك يوم راحة بين حصص الجزء السفلي.',
  'program.rest': 'راحة', 'program.complete': 'تحديد كمكتمل', 'program.incomplete': 'تحديد كغير مكتمل',
  'progress.emptyTitle': 'ابدأ بتمرين واحد', 'progress.emptyText': 'اختر تمريناً واحفظ وزن العمل لبناء مخطط تقدمك.', 'progress.explore': 'استكشف التمارين',
  'progress.exercise': 'التمرين', 'progress.unit': 'وحدة العرض', 'progress.best': 'أفضل وزن', 'progress.volume': 'الحجم الكلي', 'progress.sets': 'مجموعات العمل', 'progress.loading': 'جارٍ تحميل المخططات',
  'chart.weightEyebrow': 'وزن العمل', 'chart.weightTitle': 'أعلى وزن حسب اليوم', 'chart.days': '{count} أيام تدريب', 'chart.volumeEyebrow': 'حجم التدريب', 'chart.volumeTitle': 'العمل حسب اليوم', 'chart.formula': 'الوزن × التكرارات × المجموعات',
  'history.emptyTitle': 'لا توجد تمارين مسجلة', 'history.emptyText': 'ستظهر مجموعاتك المحفوظة هنا.', 'history.find': 'ابحث عن تمرين', 'history.filter': 'تصفية سجل التمارين', 'history.clear': 'مسح البيانات',
  'history.noMatch': 'لا يوجد تمرين يطابق «{query}».', 'history.entry': 'سجل', 'history.entries': 'سجلات', 'history.volumeShort': 'حجم', 'history.delete': 'حذف سجل {exercise}', 'history.muscle': 'عضلة',
  'log.quick': 'تسجيل سريع', 'log.close': 'إغلاق نموذج التسجيل', 'log.last': 'المرة السابقة', 'log.unit': 'وحدة الوزن', 'log.kilograms': 'كيلوجرام', 'log.pounds': 'رطل',
  'log.weight': 'الوزن', 'log.reps': 'التكرارات', 'log.sets': 'المجموعات', 'log.date': 'التاريخ والوقت', 'log.note': 'ملاحظة', 'log.optional': 'اختياري', 'log.notePlaceholder': 'الإيقاع أو الأداء أو شعورك بالمجموعة',
  'log.error': 'أدخل وزناً صالحاً وأرقاماً صحيحة للتكرارات والمجموعات.', 'log.save': 'حفظ التمرين',
  'confirm.title': 'مسح جميع بيانات التدريب؟', 'confirm.text': 'سيُحذف سجل التمارين وإنجاز الأسبوع من هذا الجهاز نهائياً.', 'confirm.cancel': 'إلغاء', 'confirm.clear': 'مسح البيانات',
  'toast.saved': 'تم حفظ {exercise}', 'toast.removed': 'تم حذف السجل', 'toast.undo': 'تراجع', 'toast.cleared': 'تم مسح بيانات التدريب',
}

export function translate(language: Language, key: TranslationKey, values: Record<string, string | number> = {}) {
  let text: string = (language === 'ar' ? ar : en)[key]
  Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)) })
  return text
}

type MuscleTranslation = Pick<Muscle, 'group' | 'family' | 'part' | 'name' | 'function'>

const arabicMuscles: Record<string, MuscleTranslation> = {
  'chest-upper': { group: 'الصدر', family: 'العضلة الصدرية الكبرى', part: 'الرأس الترقوي', name: 'أعلى الصدر', function: 'يرفع الذراع ويضمه أمام الجسم، ويزداد التركيز عليه في تمارين الضغط المائل.' },
  'chest-lower': { group: 'الصدر', family: 'العضلة الصدرية الكبرى', part: 'الرأس القصي الضلعي', name: 'منتصف وأسفل الصدر', function: 'يضم الذراع أمام الجسم وإلى الأسفل، ويزداد التركيز عليه في الضغط المستوي والمتوازي والفلاي من أعلى لأسفل.' },
  lats: { group: 'الظهر', family: 'العضلة الظهرية العريضة', part: 'العضلة كاملة', name: 'العضلة الظهرية العريضة', function: 'تسحب الذراع إلى الخلف ونحو الجسم وتمنح الظهر شكله العريض.' },
  'upper-traps': { group: 'الظهر', family: 'العضلة شبه المنحرفة', part: 'الألياف العلوية', name: 'الترابيس العلوية', function: 'ترفع لوح الكتف وتساعد على تدويره للأعلى.' },
  'mid-traps': { group: 'الظهر', family: 'العضلة شبه المنحرفة', part: 'الألياف الوسطى', name: 'الترابيس الوسطى', function: 'تسحب لوحي الكتف إلى الداخل وتثبتهما أثناء تمارين السحب.' },
  'lower-traps': { group: 'الظهر', family: 'العضلة شبه المنحرفة', part: 'الألياف السفلية', name: 'الترابيس السفلية', function: 'تخفض لوح الكتف وتساعد على تدويره للأعلى.' },
  rhomboids: { group: 'الظهر', family: 'العضلات المعينية', part: 'المجموعة كاملة', name: 'العضلات المعينية', function: 'تسحب لوحي الكتف إلى الداخل وتثبتهما.' },
  erectors: { group: 'الظهر', family: 'ناصبات الفقار', part: 'المجموعة كاملة', name: 'ناصبات الفقار', function: 'تحافظ على استقامة العمود الفقري وتقاوم انحناء الجذع.' },
  'deltoid-anterior': { group: 'الأكتاف', family: 'العضلة الدالية', part: 'الرأس الأمامي', name: 'الدالية الأمامية', function: 'ترفع الذراع للأمام وتساعد في تمارين الضغط.' },
  'deltoid-lateral': { group: 'الأكتاف', family: 'العضلة الدالية', part: 'الرأس الجانبي', name: 'الدالية الجانبية', function: 'ترفع الذراع إلى الجانب وتزيد عرض الكتف.' },
  'deltoid-posterior': { group: 'الأكتاف', family: 'العضلة الدالية', part: 'الرأس الخلفي', name: 'الدالية الخلفية', function: 'تحرك الذراع إلى الخلف وتساعد في فتح الذراع أفقياً.' },
  'biceps-long': { group: 'البايسبس', family: 'العضلة ذات الرأسين العضدية', part: 'الرأس الطويل', name: 'الرأس الطويل للبايسبس', function: 'يثني المرفق ويساعد على تدوير راحة اليد إلى الأعلى.' },
  'biceps-short': { group: 'البايسبس', family: 'العضلة ذات الرأسين العضدية', part: 'الرأس القصير', name: 'الرأس القصير للبايسبس', function: 'يساعد على ثني المرفق وتدوير الساعد للخارج.' },
  brachialis: { group: 'البايسبس', family: 'العضلة العضدية', part: 'العضلة كاملة', name: 'العضلة العضدية', function: 'مثنٍ قوي للمرفق مهما كانت وضعية راحة اليد.' },
  'triceps-long': { group: 'الترايسبس', family: 'العضلة ثلاثية الرؤوس العضدية', part: 'الرأس الطويل', name: 'الرأس الطويل للترايسبس', function: 'يمد المرفق ويعبر مفصل الكتف.' },
  'triceps-lateral': { group: 'الترايسبس', family: 'العضلة ثلاثية الرؤوس العضدية', part: 'الرأس الجانبي', name: 'الرأس الجانبي للترايسبس', function: 'يساهم بقوة في مد المرفق.' },
  'triceps-medial': { group: 'الترايسبس', family: 'العضلة ثلاثية الرؤوس العضدية', part: 'الرأس الإنسي', name: 'الرأس الإنسي للترايسبس', function: 'يدعم مد المرفق خلال كامل مدى الحركة.' },
  'forearm-flexors': { group: 'الساعد', family: 'عضلات الساعد', part: 'حجرة العضلات القابضة', name: 'قابضات الساعد', function: 'تثني الرسغ والأصابع وتساهم في قوة القبضة.' },
  'forearm-extensors': { group: 'الساعد', family: 'عضلات الساعد', part: 'حجرة العضلات الباسطة', name: 'باسطات الساعد', function: 'تمد الرسغ والأصابع وتثبتهما.' },
  'abs-upper': { group: 'الجذع', family: 'العضلة المستقيمة البطنية', part: 'المنطقة العلوية', name: 'أعلى عضلات البطن', function: 'تثني الجذع وتقرب الأضلاع من الحوض.' },
  'abs-lower': { group: 'الجذع', family: 'العضلة المستقيمة البطنية', part: 'المنطقة السفلية', name: 'أسفل عضلات البطن', function: 'تدعم ثني الجذع والتحكم في ميل الحوض للخلف.' },
  obliques: { group: 'الجذع', family: 'العضلات المائلة', part: 'المجموعة كاملة', name: 'العضلات المائلة', function: 'تدير الجذع وتميله جانبياً وتثبته.' },
  'quad-rectus': { group: 'أمام الفخذ', family: 'العضلة رباعية الرؤوس', part: 'المستقيمة الفخذية', name: 'المستقيمة الفخذية', function: 'تمد الركبة وتعبر أيضاً مفصل الورك.' },
  'quad-lateral': { group: 'أمام الفخذ', family: 'العضلة رباعية الرؤوس', part: 'الواسعة الوحشية', name: 'الواسعة الوحشية', function: 'عضلة كبيرة على جانب الفخذ تمد الركبة.' },
  'quad-medial': { group: 'أمام الفخذ', family: 'العضلة رباعية الرؤوس', part: 'الواسعة الإنسية', name: 'الواسعة الإنسية', function: 'تمد الركبة وتساعد على التحكم الإنسي في الرضفة.' },
  'quad-intermedius': { group: 'أمام الفخذ', family: 'العضلة رباعية الرؤوس', part: 'الواسعة الوسطى', name: 'الواسعة الوسطى', function: 'عضلة عميقة من الرباعية تمد الركبة.' },
  'ham-biceps': { group: 'خلف الفخذ', family: 'أوتار الركبة', part: 'ذات الرأسين الفخذية', name: 'ذات الرأسين الفخذية', function: 'تثني الركبة وتساعد على مد الورك.' },
  'ham-semitendinosus': { group: 'خلف الفخذ', family: 'أوتار الركبة', part: 'نصف الوترية', name: 'نصف الوترية', function: 'تثني الركبة وتمد الورك.' },
  'ham-semimembranosus': { group: 'خلف الفخذ', family: 'أوتار الركبة', part: 'نصف الغشائية', name: 'نصف الغشائية', function: 'عضلة إنسية خلف الفخذ تدعم ثني الركبة ومد الورك.' },
  'glute-max': { group: 'الألوية', family: 'عضلات الألوية', part: 'الألوية الكبرى', name: 'الألوية الكبرى', function: 'العضلة الأساسية لمد الورك ومحرك قوي للجزء السفلي.' },
  'glute-med': { group: 'الألوية', family: 'عضلات الألوية', part: 'الألوية الوسطى', name: 'الألوية الوسطى', function: 'تبعد الورك وتثبت الحوض أثناء الوقوف على ساق واحدة.' },
  'calf-medial': { group: 'السمانة', family: 'عضلات السمانة', part: 'الرأس الإنسي للتوأمية', name: 'التوأمية الإنسية', function: 'تبسط الكاحل عندما تكون الركبة ممدودة.' },
  'calf-lateral': { group: 'السمانة', family: 'عضلات السمانة', part: 'الرأس الوحشي للتوأمية', name: 'التوأمية الوحشية', function: 'تساهم في بسط الكاحل وثبات الركبة.' },
  soleus: { group: 'السمانة', family: 'عضلات السمانة', part: 'النعلية', name: 'العضلة النعلية', function: 'عضلة عميقة لبسط الكاحل يزداد عملها عند ثني الركبة.' },
}

const equipmentAr: Record<string, string> = {
  'Dumbbells + bench': 'دمبل + مقعد', 'Cable station': 'جهاز الكابل', 'Dip bars': 'متوازي', 'Dumbbells or trap bar': 'دمبل أو تراب بار', Barbell: 'بار',
  'Light dumbbells + bench': 'دمبل خفيف + مقعد', Wall: 'حائط', 'Resistance band': 'حبل مقاومة', 'Back-extension bench': 'مقعد تمديد الظهر', Bodyweight: 'وزن الجسم',
  'Barbell + landmine': 'بار + لاندماين', Dumbbells: 'دمبل', 'Preacher bench': 'مقعد بريتشر', 'EZ bar': 'بار EZ', 'EZ bar + bench': 'بار EZ + مقعد',
  'Dumbbell or kettlebell': 'دمبل أو كيتل بيل', 'Finger band': 'رباط أصابع', 'Stability ball': 'كرة توازن', 'Pull-up bar': 'عقلة', Mat: 'حصيرة',
  'Cable station or band': 'كابل أو حبل مقاومة', Machine: 'جهاز', 'Hack-squat machine': 'جهاز هاك سكوات', 'Leg-press machine': 'جهاز ضغط الأرجل',
  'Dumbbell or barbell': 'دمبل أو بار', 'Dumbbells + low step': 'دمبل + منصة منخفضة', Dumbbell: 'دمبل', 'Floor sliders': 'أقراص انزلاق',
  'Anchor + resistance band': 'نقطة تثبيت + حبل مقاومة', 'Barbell + bench': 'بار + مقعد', 'Low box': 'صندوق منخفض', 'Calf machine': 'جهاز السمانة',
  'Bodyweight or dumbbell': 'وزن الجسم أو دمبل', 'Dumbbell + support': 'دمبل + دعامة',
}

export const localizeMuscle = (muscle: Muscle, language: Language): Muscle => language === 'ar' ? { ...muscle, ...arabicMuscles[muscle.id] } : muscle
export const localizeExercise = (exercise: Exercise, language: Language): Exercise => language === 'ar' ? { ...exercise, ...arabicExercises[exercise.id], equipment: equipmentAr[exercise.equipment] ?? exercise.equipment } : exercise

const arabicPrograms: Record<string, Pick<ProgramDay, 'label' | 'title' | 'focus' | 'duration'>> = {
  'upper-1': { label: 'اليوم أ', title: 'قوة الجزء العلوي', focus: 'دفع وسحب أفقي', duration: '50 دقيقة' },
  'lower-1': { label: 'اليوم ب', title: 'قوة الجزء السفلي', focus: 'الفخذ الأمامي والسلسلة الخلفية', duration: '50 دقيقة' },
  'upper-2': { label: 'اليوم ج', title: 'حجم الجزء العلوي', focus: 'الظهر والأكتاف', duration: '45 دقيقة' },
  'lower-2': { label: 'اليوم د', title: 'حجم الجزء السفلي', focus: 'الألوية والتحكم بساق واحدة', duration: '45 دقيقة' },
}

export const localizeProgram = (day: ProgramDay, language: Language): ProgramDay => language === 'ar' ? { ...day, ...arabicPrograms[day.id] } : day
export const localizeLevel = (level: Exercise['level'], language: Language) => translate(language, level === 'Beginner' ? 'exercise.beginner' : 'exercise.intermediate')
export const localizeRest = (rest: string, language: Language) => language === 'ar' ? rest.replace('min', 'دقيقة').replace('sec', 'ثانية') : rest

export const translationCoverage = {
  muscles: Object.keys(arabicMuscles),
  exercises: Object.keys(arabicExercises),
}
