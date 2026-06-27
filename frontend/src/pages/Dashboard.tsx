import RevenueChart from '../components/dashboard/RevenueChart'
import StatCard from '../components/dashboard/StatCard'
import SalesByChannel from '../components/dashboard/SalesByChannel'
import AppShell from '../components/shell/AppShell'
import { DollarSign } from 'lucide-react'

const channelData = [
  { label: 'Direct Sales', value: 26000000, amount: 'Rp 26.000.000', percentage: '50%', color: '#6d5dfc' },
  { label: 'Online Store', value: 15600000, amount: 'Rp 15.600.000', percentage: '30%', color: '#a78bfa' },
  { label: 'Market Place', value: 7800000, amount: 'Rp 7.800.000', percentage: '15%', color: '#3b82f6' },
  { label: 'Others', value: 2600000, amount: 'Rp 2.600.000', percentage: '5%', color: '#8a8a8a' },
]

const revenueData = [
  { date: 'May 20', revenue: 20000000 },
  { date: 'May 21', revenue: 35000000 },
  { date: 'May 22', revenue: 28000000 },
  { date: 'May 23', revenue: 45000000 },
  { date: 'May 24', revenue: 38000000 },
  { date: 'May 25', revenue: 50000000 },
  { date: 'May 26', revenue: 80000000 },
]

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
          sparklineData={[20, 35, 28, 45, 38, 50, 80]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} totalValue="Rp 52.000.000" change="14.2%" />
        </div>
        <SalesByChannel data={channelData} total="52.000.000" />
      </div>
    </AppShell>
  )
}