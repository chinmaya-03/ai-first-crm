import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Button } from './Button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col items-center justify-center py-20 text-center', className)}
    >
      {/* Icon container with layered rings */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-brand-500/10 blur-xl dark:bg-brand-500/5" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-surface-200/80 bg-gradient-to-br from-surface-50 to-surface-100 text-surface-400 shadow-soft dark:border-surface-700/50 dark:from-surface-800/60 dark:to-surface-900/60 dark:text-surface-500">
          <div className="scale-125">{icon}</div>
        </div>
        {/* Decorative dots */}
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-200 dark:bg-brand-800" />
        <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-violet-200 dark:bg-violet-800" />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-surface-900 dark:text-surface-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-surface-500 dark:text-surface-400">{description}</p>
      )}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6"
        >
          <Button onClick={action.onClick}>{action.label}</Button>
        </motion.div>
      )}
    </motion.div>
  )
}
