import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ChartPoint = { date: string; weight: number; volume: number }

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value?: number }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><span>{label}</span><strong>{payload[0].value?.toLocaleString()} {unit}</strong></div>
}

export default function ProgressCharts({ data, unit }: { data: ChartPoint[]; unit: 'kg' | 'lb' }) {
  return (
    <>
      <section className="chart-card large">
        <div className="chart-heading"><div><div className="eyebrow">Working weight</div><h2>Top load by day</h2></div><span>{data.length} training days</span></div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#20332d" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" stroke="#688078" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#688078" tickLine={false} axisLine={false} fontSize={12} width={52} unit={` ${unit}`} />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <Line type="monotone" dataKey="weight" stroke="#c8ff3d" strokeWidth={3} dot={{ r: 4, fill: '#050505', stroke: '#c8ff3d', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-card">
        <div className="chart-heading"><div><div className="eyebrow">Training volume</div><h2>Work performed by day</h2></div><span>weight × reps × sets</span></div>
        <div className="chart-wrap compact">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#20332d" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" stroke="#688078" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#688078" tickLine={false} axisLine={false} fontSize={12} width={58} />
              <Tooltip content={<ChartTooltip unit={`${unit} vol`} />} />
              <Line type="monotone" dataKey="volume" stroke="#64d8bc" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}
