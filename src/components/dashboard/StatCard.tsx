import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  index?: number
}

const iconGradients = [
  'from-brand-500 to-violet-600',
  'from-cyan-500 to-brand-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
]

const glowColors = [
  'shadow-brand-500/15',
  'shadow-cyan-500/15',
  'shadow-rose-500/15',
  'shadow-emerald-500/15',
]

export function StatCard({ label, value, change, trend = 'neutral', icon, index = 0 }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const gradient = iconGradients[index % iconGradients.length]
  const glow = glowColors[index % glowColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn(
        'group relative overflow-hidden rounded-2xl border border-surface-200/50 bg-white/70 p-6 shadow-soft backdrop-blur-xl',
        'dark:border-surface-800/40 dark:bg-surface-950/45',
        'transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5',
        'hover:border-brand-500/20 hover:shadow-elevated',
        glow,
      )}>
        {/* Background glow pulse */}
        <div className={cn(
          'absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60',
          `bg-gradient-to-br ${gradient}`,
        )} />

        <div className="relative flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-400">
              {label}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.07 + 0.2 }}
              className="mt-2.5 text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50"
            >
              {value}
            </motion.p>
            {change !== undefined && (
              <div
                className={cn(
                  'mt-2 flex items-center gap-1.5 text-xs font-semibold',
                  trend === 'up'   && 'text-emerald-600 dark:text-emerald-400',
                  trend === 'down' && 'text-red-500 dark:text-red-400',
                  trend === 'neutral' && 'text-surface-500',
                )}
              >
                <span className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full',
                  trend === 'up'   && 'bg-emerald-100 dark:bg-emerald-950',
                  trend === 'down' && 'bg-red-100 dark:bg-red-950',
                  trend === 'neutral' && 'bg-surface-100 dark:bg-surface-800',
                )}>
                  <TrendIcon className="h-2.5 w-2.5" />
                </span>
                {change > 0 ? '+' : ''}{change}%
                <span className="font-normal text-surface-400 dark:text-surface-500">vs last month</span>
              </div>
            )}
          </div>

          <div className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md',
            `${gradient} shadow-black/10`,
          )}>
            <div className="scale-110">{icon}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
