import { motion } from 'framer-motion'
import {
  Sparkles,
  User,
  Calendar,
  Building2,
  Pill,
  SmilePlus,
  Package,
  ListChecks,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui'
import type { AIExtractionResult, Sentiment } from '@/types'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

interface AIResultCardProps {
  result: AIExtractionResult
  onApply: () => void
}

const sentimentConfig: Record<
  Sentiment,
  {
    label: string
    color: string
    bg: string
    darkBg: string
    icon: string
  }
> = {
  positive: {
    label: 'Positive',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-950/40',
    icon: '😊',
  },
  neutral: {
    label: 'Neutral',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-950/40',
    icon: '😐',
  },
  negative: {
    label: 'Negative',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50',
    darkBg: 'dark:bg-red-950/40',
    icon: '😟',
  },
}

function MiniCard({
  icon,
  label,
  value,
  accent = 'brand',
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  accent?: 'brand' | 'violet' | 'emerald' | 'amber' | 'cyan'
}) {
  const accentMap: Record<string, string> = {
    brand:
      'from-brand-50 to-violet-50 dark:from-brand-950/30 dark:to-violet-950/30 border-brand-100 dark:border-brand-900/50',
    violet:
      'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-100 dark:border-violet-900/50',
    emerald:
      'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50',
    amber:
      'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/50',
    cyan:
      'from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 border-cyan-100 dark:border-cyan-900/50',
  }

  const iconAccentMap: Record<string, string> = {
    brand: 'text-brand-500 dark:text-brand-400',
    violet: 'text-violet-500 dark:text-violet-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-gradient-to-br p-3',
        accentMap[accent],
      )}
    >
      <div
        className={cn(
          'mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest',
          iconAccentMap[accent],
        )}
      >
        {icon}
        {label}
      </div>

      <div className="text-sm font-medium text-surface-900 dark:text-surface-100 leading-tight">
        {typeof value === 'string' ? (
          <span className="line-clamp-1">{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

function ConfidenceRing({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDash = (pct / 100) * circumference

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg
          className="absolute -rotate-90"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-surface-100 dark:text-surface-800"
            fill="none"
          />

          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            stroke="url(#confGrad)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - strokeDash,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
              delay: 0.3,
            }}
          />

          <defs>
            <linearGradient id="confGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
          {pct}%
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold text-surface-900 dark:text-surface-100">
          Confidence
        </p>

        <p className="text-[10px] text-surface-500">
          AI extraction score
        </p>
      </div>
    </div>
  )
}

export function AIResultCard({
  result,
  onApply,
}: AIResultCardProps) {
  const sentiment = sentimentConfig[result.sentiment]

  const followUp =
    result.followUpDate &&
    !isNaN(new Date(result.followUpDate).getTime())
      ? formatDate(result.followUpDate)
      : 'Not specified'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-t-2xl border border-b-0 border-brand-200/60 bg-gradient-to-r from-brand-600 to-violet-600 dark:border-brand-800/40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white/90" />
            <span className="text-sm font-semibold text-white">
              Meeting Summary
            </span>
          </div>

          <ConfidenceRing score={result.confidenceScore} />
        </div>
      </div>

      <div className="space-y-3 rounded-b-2xl border border-t-0 border-brand-200/60 bg-white/90 px-4 pb-4 pt-4 backdrop-blur-sm dark:border-brand-800/40 dark:bg-surface-950/70">

        <p className="text-xs leading-relaxed text-surface-600 dark:text-surface-400">
          {result.summary}
        </p>

        <div className="grid grid-cols-2 gap-2">

          <MiniCard
            icon={<User className="h-3 w-3" />}
            label="Doctor"
            value={result.doctor}
            accent="brand"
          />

          <MiniCard
            icon={<Building2 className="h-3 w-3" />}
            label="Hospital"
            value={result.hospital}
            accent="violet"
          />

          <MiniCard
            icon={<Pill className="h-3 w-3" />}
            label="Drug"
            value={result.drugMentioned}
            accent="cyan"
          />

          <MiniCard
            icon={<SmilePlus className="h-3 w-3" />}
            label="Sentiment"
            accent={
              result.sentiment === 'positive'
                ? 'emerald'
                : 'amber'
            }
            value={
              <span className={cn('font-semibold', sentiment.color)}>
                {sentiment.icon} {sentiment.label}
              </span>
            }
          />

          <MiniCard
            icon={<Calendar className="h-3 w-3" />}
            label="Follow-up"
            value={followUp}
            accent="violet"
          />
        </div>

        {/* Action items */}
        {result.actionItems.length > 0 && (
          <div className="rounded-xl border border-surface-200/60 bg-surface-50/60 p-3 dark:border-surface-800/40 dark:bg-surface-900/40">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-surface-500 dark:text-surface-400">
              <ListChecks className="h-3 w-3" />
              Action Items
            </div>

            <ul className="space-y-1.5">
              {result.actionItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-2 text-xs text-surface-700 dark:text-surface-300"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500 dark:text-brand-400" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {result.samplesRequested.length > 0 && (
          <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/60 p-3 dark:border-cyan-900/40 dark:bg-cyan-950/20">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              <Package className="h-3 w-3" />
              Samples Requested
            </div>

            <p className="text-xs text-surface-700 dark:text-surface-300">
              {result.samplesRequested.join(", ")}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2 dark:border-amber-900/40 dark:bg-amber-950/20">
          <Clock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />

          <p className="text-xs text-amber-800 dark:text-amber-300">
            Suggested follow-up:&nbsp;
            <span className="font-semibold">
              {followUp}
            </span>
          </p>
        </div>

        <Button
  onClick={() => {
    console.log("BUTTON CLICKED")
    onApply()
  }}
  className="w-full"
  rightIcon={<ArrowRight className="h-4 w-4" />}
>
  Apply to Form
</Button>
      </div>
    </motion.div>
  )
}

