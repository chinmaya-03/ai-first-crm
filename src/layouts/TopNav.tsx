import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Monitor,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Avatar } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleMobileSidebar, setSearchQuery } from '@/redux/slices/uiSlice'
import { setTheme, type ThemeMode } from '@/redux/slices/themeSlice'
import { markAllNotificationsRead, markNotificationRead } from '@/redux/slices/dashboardSlice'
import { formatRelative } from '@/utils/format'

export function TopNav() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { searchQuery } = useAppSelector((s) => s.ui)
  const { mode, resolved } = useAppSelector((s) => s.theme)
  const notifications = useAppSelector((s) => s.dashboard.notifications)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-surface-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-950/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-800"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            placeholder="Search HCPs, interactions..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="h-9 w-64 rounded-lg border border-surface-200 bg-surface-50 pl-9 pr-4 text-sm transition-colors placeholder:text-surface-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 lg:w-80 dark:border-surface-700 dark:bg-surface-900 dark:focus:bg-surface-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={() => setShowTheme(!showTheme)}
            className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Toggle theme"
          >
            {resolved === 'dark' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>
          <AnimatePresence>
            {showTheme && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-elevated dark:border-surface-700 dark:bg-surface-900"
              >
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      dispatch(setTheme(opt.value))
                      setShowTheme(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-surface-50 dark:hover:bg-surface-800',
                      mode === opt.value && 'text-brand-600 dark:text-brand-400',
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-elevated dark:border-surface-700 dark:bg-surface-900"
              >
                <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3 dark:border-surface-800">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    className="text-xs text-brand-600 hover:underline dark:text-brand-400"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => dispatch(markNotificationRead(n.id))}
                      className={cn(
                        'flex w-full flex-col gap-0.5 border-b border-surface-100 px-4 py-3 text-left transition-colors hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-800/50',
                        !n.read && 'bg-brand-50/50 dark:bg-brand-950/20',
                      )}
                    >
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{n.title}</p>
                      <p className="text-xs text-surface-500">{n.message}</p>
                      <p className="text-[10px] text-surface-400">{formatRelative(n.timestamp)}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <Avatar name="Alex Morgan" size="sm" />
            <span className="hidden text-sm font-medium text-surface-700 md:block dark:text-surface-300">
              Alex Morgan
            </span>
            <ChevronDown className="hidden h-4 w-4 text-surface-400 md:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-elevated dark:border-surface-700 dark:bg-surface-900"
              >
                {[
                  { icon: User, label: 'Profile', action: () => {} },
                  { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                  { icon: LogOut, label: 'Sign out', action: () => {} },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setShowProfile(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-surface-700 transition-colors hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
