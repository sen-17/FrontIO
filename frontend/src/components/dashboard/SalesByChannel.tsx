import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface ChannelData {
  label: string
  value: number
  amount: string
  percentage: string
  color: string
}

interface Props {
  data: ChannelData[]
  total: string
}

export default function SalesByChannel({ data, total }: Props) {
  return (
    <div className="bg-black-950 border border-gray-700 rounded-xl p-5 h-full flex flex-col">
      <h3 className="text-sm text-gray-400 mb-4">Sales by Channel</h3>

      {/* Donut chart + Legend side by side */}
      <div className="flex items-center gap-6 flex-1">

        {/* Donut chart */}
        <div className="h-40 w-40 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
              >
                {data.map(entry => (
                  <Cell key={entry.label} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered total — overlaid on top of the donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-base font-semibold text-white">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {data.map(item => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-white">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.amount}</p>
                </div>
              </div>
              <span className="text-gray-400">{item.percentage}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="text-sm text-primary mt-4 text-left hover:underline">
        View full report →
      </button>
    </div>
  )
}