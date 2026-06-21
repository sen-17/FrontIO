import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  CreditCard,
  Settings,
  UserCog,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface Props {
  mobileOpen: boolean
  onMobileClose: () => void
}

const navSections: NavSection[] = [
  {
    title: 'General',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Reports', path: '/reports', icon: FileText },
    ]
  },
  {
    title: 'Operations',
    items: [
      { label: 'Sales', path: '/sales', icon: DollarSign },
      { label: 'Purchase', path: '/purchase', icon: ShoppingCart },
      { label: 'Inventory', path: '/inventory', icon: Package },
      { label: 'Customers', path: '/customers', icon: Users },
    ]
  },
  {
    title: 'Finance',
    items: [
      { label: 'Invoices', path: '/invoices', icon: Receipt },
      { label: 'Payments', path: '/payments', icon: CreditCard },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Users', path: '/users', icon: UserCog },
    ]
  },
]

export default function SideBar({ mobileOpen, onMobileClose }: Props) {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()

    // Navigate and close the mobile drawer (mobile only — desktop ignores onMobileClose effect since it's already visible)
    function handleNavigate(path: string) {
      navigate(path)
      onMobileClose()
    }

    return (
      <>
        {/* Mobile overlay — dark backdrop behind the drawer, only visible when open */}
        {mobileOpen && (
          <div onClick={onMobileClose} className='fixed inset-0 bg-black/60 z-40 md:hidden'/>
        )}

        <aside className={`w-64 ${collapsed ? 'md:w-20' : 'md:w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:static inset-y-0 left-0 z-50 bg-black-950 border-r border-gray-700 flex flex-col h-screen transition-all duration-200 `}>
          {/* Logo + Collapse Button */}
          <div className="flex items-center justify-between px-5 py-5">
              {!collapsed && (
                <h1 className="font-display text-2xl text-white tracking-wide">
                  FRONT<span className="text-primary">IO</span>
                </h1>
              )}

              {/* Desktop collapse toggle */}
              <button onClick={() => setCollapsed(!collapsed)} className='hidden md:block text-gray-500 hover:text-white transition-colors'>
                {collapsed ? <ChevronsRight size={18}/> : <ChevronsLeft size={18}/>}
              </button>

              {/* Mobile close button */}
              <button onClick={onMobileClose} className='md:hidden text-gray-500 hover:text-white transition-colors'>
                <X size={20}/>
              </button>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 py-2">
              {navSections.map(section => (
                <div key={section.title} className='mb-6'>
                  {!collapsed && (
                    <p className='text-xs text-gray-500 font-medium px-3 mb-2 tracking-wider'>
                      {section.title.toUpperCase()}
                    </p>
                  )}

                  {section.items.map(item => {
                    const isActive = location.pathname == item.path
                    const Icon = item.icon

                    return (
                      <button 
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 text-sm transition-colors ${isActive ? 'bg-primary-subtle text-primary font-medium' : 'text-gray-500 hover:bg-gray-700/30 hover:text-white'}`}
                        >
                        
                        <Icon size={18}/>
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
          </nav>

          {/* User Card */}
          <div className="border-t border-gray-700 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium shrink-0">
                {user?.name?.[0] ?? 'U'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">Administrator</p>
                </div>
              )}
            </div>
          </div>

        </aside>
      </>
    )
}