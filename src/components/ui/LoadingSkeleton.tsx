import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800/60',
        className,
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-surface-700/40" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-200/50 bg-white/70 p-6 shadow-soft dark:border-surface-800/40 dark:bg-surface-950/45">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-7 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-surface-100/80 py-4 dark:border-surface-800/50">
      <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3 flex-1', i === 0 && 'max-w-[180px]')} />
      ))}
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-surface-200/50 bg-white/70 p-5 dark:border-surface-800/40 dark:bg-surface-950/45">
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-2.5 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
