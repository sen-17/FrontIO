import { Icon } from "lucide-react";
import type { ComponentType } from "react";

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
}

export default function StatCard({icon: Icon, label, value, change, trend, period}: Props){
    return (
        <div className="bg-black-950 border border-gray-700 rounded-xl p-5 flex-1">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-15 h-15 rounded-lg bg-primary flex items-center justify-center">
                    <Icon size={30} className="text-white"/>
                </div>
                <div className="flex flex-col gap-0">
                    <span className="text-md text-gray-500">{label}</span>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                </div>
            </div>

            <div className="flex items-center gap-1 text-xs">
                <span className={trend === 'up' ? 'text-success' : 'text-error'}>
                    {trend === 'up' ? '▲' : '▼'} {change}
                </span>
                <span className="text-gray-500">{period}</span>
            </div>
        </div>
    )
}