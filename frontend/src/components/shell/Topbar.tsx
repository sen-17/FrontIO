import { Search, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface Props {
  title: string
}

export default function Topbar({ title }: Props) {
  const { user } = useAuth()

  return (
    <header className='h-20 border-b border-gray-700 flex items-center justify-between bg-black-950 px-8'>
        {/* Page Title */}
        <h2 className='text-2xl font-semibold text-white'>{title}</h2>

        {/* Search Bar */}
        <div className='flex-1 max-w-md mx-8'>
            <div className='relative'>
                <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'/>
                
                <input
                 type="text"
                 placeholder='Search anything...'
                 className="w-full bg-black-900 border border-gray-700 rounded-lg pl-10 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />

                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 border border-gray-700 rounded px-1.5 py-05">
                    /
                </kbd>
            </div>
        </div>

        {/* Right side — Notifications + User */}
        <div className='flex items-center gap-5'>
            <button className='text-gray-500 hover:text-white transition-colors relative'>
                <Bell size={20} />
            </button>

            <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-700/30 rounded-lg px-2 py-1.5 transition-colors'>
                <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium'>
                    {user?.name?.[0] ?? 'U'}
                </div>
                <span className='text-sm text-white'>{user?.name}</span>
                <ChevronDown size={16} className="text-gray-500" />
            </div>
        </div>
    </header>
  )
}