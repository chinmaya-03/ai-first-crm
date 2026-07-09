import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/format'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-base',
}

const gradients = [
  'from-brand-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-brand-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
]

function getGradient(name: string) {
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white/80 shadow-sm dark:ring-surface-900', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm ring-2 ring-white/80 dark:ring-surface-900',
        sizeMap[size],
        getGradient(name),
        className,
      )}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
