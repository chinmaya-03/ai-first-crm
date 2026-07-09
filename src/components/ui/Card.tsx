import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md', hover }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-200/50 bg-white/70 backdrop-blur-xl shadow-soft',
        'dark:border-surface-800/40 dark:bg-surface-950/45 dark:shadow-none',
        hover && 'transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-elevated hover:border-brand-500/25 dark:hover:border-brand-500/20',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-surface-900 dark:text-surface-50">{title}</h3>
        {description && <p className="mt-1 text-xs text-surface-500 dark:text-surface-450">{description}</p>}
      </div>
      {action}
    </div>
  )
}
