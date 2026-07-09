import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { formatRelative } from '@/utils/format'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: React.ReactNode
  variant?: 'default' | 'brand' | 'success' | 'warning'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const dotConfig = {
  default: {
    dot: 'bg-surface-300 dark:bg-surface-600',
    ring: 'ring-surface-100 dark:ring-surface-800',
    line: 'bg-surface-100 dark:bg-surface-800',
  },
  brand: {
    dot: 'bg-gradient-to-br from-brand-500 to-violet-600',
    ring: 'ring-brand-100 dark:ring-brand-950',
    line: 'bg-brand-100 dark:bg-brand-900/30',
  },
  success: {
    dot: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    ring: 'ring-emerald-100 dark:ring-emerald-950',
    line: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  warning: {
    dot: 'bg-gradient-to-br from-amber-400 to-orange-600',
    ring: 'ring-amber-100 dark:ring-amber-950',
    line: 'bg-amber-100 dark:bg-amber-900/30',
  },
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, index) => {
        const cfg = dotConfig[item.variant ?? 'default']
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-4 pb-7 last:pb-0"
          >
            {/* Vertical connector line */}
            {index < items.length - 1 && (
              <div className={cn('absolute left-[11px] top-7 bottom-0 w-px', cfg.line)} />
            )}

            {/* Dot */}
            <div
              className={cn(
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 shadow-sm',
                cfg.dot,
                cfg.ring,
              )}
            >
              {item.icon && <span className="text-white" style={{ fontSize: 10 }}>{item.icon}</span>}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 rounded-xl border border-surface-100/80 bg-surface-50/60 px-4 py-3 dark:border-surface-800/40 dark:bg-surface-900/40">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{item.title}</p>
                <span className="shrink-0 text-[10px] text-surface-400 dark:text-surface-500">
                  {formatRelative(item.timestamp)}
                </span>
              </div>
              {item.description && (
                <p className="mt-1 text-xs leading-relaxed text-surface-600 line-clamp-2 dark:text-surface-400">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
