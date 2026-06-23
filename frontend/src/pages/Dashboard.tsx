import StatCard from '../components/dashboard/StatCard'
import AppShell from '../components/shell/AppShell'
import { DollarSign } from 'lucide-react'

export default function Dashboard() {
  return (
    <AppShell title="Dashboard">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Sales"
          value="Rp 52.000.000"
          change="14.2%"
          trend="up"
          period="vs last month"
        />
      </div>
    </AppShell>
  )
}