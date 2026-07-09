import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSidebarCollapsed, setMobileSidebarOpen } from '@/redux/slices/uiSlice'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hcps', icon: Users, label: 'HCPs' },
  { to: '/interactions', icon: MessageSquare, label: 'Interactions' },
  { to: '/interactions/log', icon: Sparkles, label: 'Log Interaction', highlight: true },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector((s) => s.ui)
  const location = useLocation()

  const content = (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-surface-200/80 bg-white dark:border-surface-800 dark:bg-surface-950',
        sidebarCollapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-surface-200/80 px-4 dark:border-surface-800">
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100">MedAI CRM</p>
              <p className="text-[10px] text-surface-500">Healthcare Professional</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
          className="hidden rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 lg:block dark:hover:bg-surface-800"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
        <button
          onClick={() => dispatch(setMobileSidebarOpen(false))}
          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-800"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = (() => {
            if (item.to === '/') return location.pathname === '/'
            if (item.to === '/interactions/log') return location.pathname === '/interactions/log'
            if (item.to === '/interactions') return location.pathname === '/interactions'
            return location.pathname.startsWith(item.to)
          })()

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-900 dark:hover:text-surface-100',
                item.highlight && !isActive && 'text-brand-600 dark:text-brand-400',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-950/50"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <item.icon className={cn('relative h-[18px] w-[18px] shrink-0', isActive && 'text-brand-600 dark:text-brand-400')} />
              {!sidebarCollapsed && <span className="relative truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="border-t border-surface-200/80 p-4 dark:border-surface-800">
          <div className="rounded-xl bg-gradient-to-br from-brand-600/10 via-violet-600/10 to-cyan-500/10 p-3">
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">AI Assistant Active</p>
            <p className="mt-0.5 text-[11px] text-surface-500">Log interactions 3x faster with AI</p>
          </div>
        </div>
      )}
    </aside>
  )

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm"
            onClick={() => dispatch(setMobileSidebarOpen(false))}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 h-full"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  )
}
