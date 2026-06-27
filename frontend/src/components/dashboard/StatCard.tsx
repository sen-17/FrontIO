import type { ComponentType } from "react";
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface Props {
    icon: ComponentType<{
        size?: number 
        className?: string
    }>
    label: string
    value: string
    change: string
    trend: 'up' | 'down'
    period: string
    sparklineData: number[]
}

export default function StatCard({icon: Icon, label, value, change, trend, period, sparklineData}: Props){
    const chartData = sparklineData.map((val, index) => ({index, val}))
    const sparklineColor = trend === 'up' ? '#22c55e' : '#ef4444'

    return (
        <div className="bg-black-950 border border-gray-700 rounded-xl p-5 flex-1 justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-15 h-15 rounded-lg bg-primary flex items-center justify-center">
                    <Icon size={30} className="text-white"/>
                </div>
                <div className="flex flex-col gap-0">
                    <span className="text-md text-gray-500">{label}</span>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                </div>
            </div>

            <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-nowrap">
                    <span className={trend === 'up' ? 'text-success' : 'text-error'}>
                        {trend === 'up' ? '▲' : '▼'} {change}
                    </span>
                    <span className="text-gray-500">{period}</span>
                </div>

                <div className="w-28 h-12 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area
                              type="monotone"
                              dataKey="val"
                              stroke={sparklineColor}
                              fill={sparklineColor}
                              fillOpacity={0.15}
                              strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}