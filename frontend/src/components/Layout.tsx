import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: ReactNode
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'Products', path: '/products', icon: '📦' },
]

export default function Layout({ children }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">FrontIO</h1>
          <p className="text-xs text-gray-400 mt-1">Powered by Odoo</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-400 mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>

    </div>
  )
}