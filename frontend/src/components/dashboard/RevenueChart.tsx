import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface DataPoint {
  date: string
  revenue: number
}

interface Props {
  data: DataPoint[]
  totalValue: string
  change: string
}

function formatMillions(value: number) {
  return `${value / 1_000_000}M`
}

export default function RevenueChart({ data, totalValue, change }: Props) {
    return (
        <div className='bg-black-950 border border-gray-700 rounded-xl p-5 flex-1'>
            {/* Header */}
            <div className='flex items-center justify-between mb-1'>

                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="text-sm text-gray-400">Revenue Overview</h3>
                </div>

                <select className="bg-black-900 border border-gray-700 rounded-lg text-sm text-white px-3 py-1.5 items-center justify-between">
                    <option>Week</option>
                    <option>Month</option>
                    <option>Year</option>
                </select>
            </div>

            {/* Total + change */}
            <div className="flex items-baseline gap-2 mb-4">
                <p className="text-2xl font-semibold text-white">{totalValue}</p>
                <span className="text-sm text-success">▲ {change}</span>
                <span className="text-sm text-gray-500">vs last month</span>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    
                    <XAxis
                        dataKey="date"
                        stroke="#8a8a8a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={15}
                    />

                    <YAxis
                        stroke="#8a8a8a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatMillions}
                        tickMargin={10}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0d0d0d',
                            border: '1px solid #2a2a2a',
                            borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#ffffff' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6d5dfc"
                        fill="#6d5dfc"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}