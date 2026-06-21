import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface Props {
  title: string
  children: ReactNode
}

export default function AppShell({ title, children }: Props) {
  return (
    <div className="flex h-screen bg-black-900">

      {/* Sidebar — fixed on the left */}
      <Sidebar />

      {/* Right side — Topbar + scrollable page content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

    </div>
  )
}