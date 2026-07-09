import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  ArrowRight,
  MessageSquare,
  Phone,
  Mail,
  UsersRound,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
  MapPin,
  Building2,
} from 'lucide-react'
import { Card, CardHeader, Badge, Avatar } from '@/components/ui'
import { formatDate, formatRelative } from '@/utils/format'
import type { FollowUpTask } from '@/types'
import { cn } from '@/utils/cn'

interface UpcomingFollowUpsProps {
  tasks: FollowUpTask[]
}

const priorityConfig = {
  high:   { variant: 'danger'  as const, label: 'High',   dot: 'bg-red-500'     },
  medium: { variant: 'warning' as const, label: 'Medium', dot: 'bg-amber-500'   },
  low:    { variant: 'neutral' as const, label: 'Low',    dot: 'bg-surface-400' },
}

const typeIcons: Record<string, React.ReactNode> = {
  meeting:    <UsersRound className="h-3.5 w-3.5" />,
  call:       <Phone className="h-3.5 w-3.5" />,
  email:      <Mail className="h-3.5 w-3.5" />,
  conference: <MessageSquare className="h-3.5 w-3.5" />,
  other:      <MessageSquare className="h-3.5 w-3.5" />,
}

export function UpcomingFollowUps({ tasks }: UpcomingFollowUpsProps) {
  const upcoming = tasks.filter((t) => t.status !== 'completed').slice(0, 4)

  return (
    <Card>
      <CardHeader
        title="Upcoming Follow-ups"
        description="Tasks due in the next 7 days"
        action={
          <Link
            to="/tasks"
            className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />
      <div className="space-y-2">
        {upcoming.map((task, i) => {
          const cfg = priorityConfig[task.priority]
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-3 rounded-xl border border-surface-100/80 p-3.5 transition-all duration-200 hover:border-surface-200 hover:bg-surface-50/60 dark:border-surface-800/50 dark:hover:border-surface-700 dark:hover:bg-surface-800/30"
            >
              <div className="relative">
                <Avatar name={task.hcpName} size="sm" />
                <span className={cn('absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-surface-950', cfg.dot)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{task.title}</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-surface-500">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(task.dueDate)}</span>
                  {task.hcpName && (
                    <>
                      <span className="text-surface-300 dark:text-surface-600">·</span>
                      <span className="truncate">{task.hcpName}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant={cfg.variant}>{cfg.label}</Badge>
            </motion.div>
          )
        })}
        {upcoming.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100">All caught up!</p>
            <p className="mt-1 text-xs text-surface-500">No upcoming follow-ups.</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export function RecentInteractions({ interactions }: { interactions: { id: string; hcpName: string; type: string; date: string; sentiment: string }[] }) {
  const sentimentConfig: Record<string, { variant: 'success' | 'danger' | 'neutral'; dot: string }> = {
    positive: { variant: 'success', dot: 'bg-emerald-500' },
    negative: { variant: 'danger',  dot: 'bg-red-500'     },
    neutral:  { variant: 'neutral', dot: 'bg-surface-400'  },
  }

  return (
    <Card>
      <CardHeader
        title="Recent Interactions"
        description="Latest HCP engagement activity"
        action={
          <Link
            to="/interactions"
            className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />
      {/* Timeline */}
      <div className="relative space-y-0 pl-5">
        {/* vertical line */}
        <div className="absolute bottom-2 left-2 top-2 w-px bg-surface-100 dark:bg-surface-800" />

        {interactions.slice(0, 5).map((int, i) => {
          const scfg = sentimentConfig[int.sentiment] ?? sentimentConfig.neutral
          const TypeIcon = typeIcons[int.type] ?? typeIcons.other

          return (
            <motion.div
              key={int.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative flex items-center gap-3.5 py-3 pl-3"
            >
              {/* Timeline dot */}
              <div className={cn(
                'absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white dark:ring-surface-950',
                scfg.dot,
              )}>
                <span className="text-white" style={{ fontSize: 8 }}>{TypeIcon}</span>
              </div>

              <Avatar name={int.hcpName} size="sm" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{int.hcpName}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs capitalize text-surface-500">
                  {TypeIcon}
                  {int.type} · {formatDate(int.date)}
                </p>
              </div>
              <Badge variant={scfg.variant}>{int.sentiment}</Badge>
            </motion.div>
          )
        })}

        {interactions.length === 0 && (
          <div className="py-8 text-center">
            <MessageSquare className="mx-auto mb-2 h-7 w-7 text-surface-300 dark:text-surface-600" />
            <p className="text-sm text-surface-500">No interactions yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export function RecentActivity({ activities }: { activities: { id: string; title: string; description: string; timestamp: string; type: string }[] }) {
  const typeConfig: Record<string, { color: string; bg: string }> = {
    interaction: { color: 'text-brand-600 dark:text-brand-400',   bg: 'bg-brand-100 dark:bg-brand-950'   },
    task:        { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950' },
    note:        { color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-950'   },
    ai:          { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-950' },
  }

  return (
    <Card>
      <CardHeader title="Recent Activity" description="Your latest actions across the CRM" />
      <div className="space-y-1">
        {activities.slice(0, 5).map((act, i) => {
          const cfg = typeConfig[act.type] ?? typeConfig.interaction
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-50/60 dark:hover:bg-surface-800/30"
            >
              <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
                <div className={cn('h-2.5 w-2.5 rounded-full', cfg.color.replace('text-', 'bg-').split(' ')[0])} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{act.title}</p>
                <p className="mt-0.5 text-xs text-surface-500">{act.description}</p>
              </div>
              <span className="shrink-0 text-[10px] text-surface-400">{formatRelative(act.timestamp)}</span>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}

export function DoctorInfoCard({ hcp }: { hcp: { name: string; specialty: string; hospital: string; tier: string; totalInteractions: number; location: string } }) {
  const tierConfig = {
    A: { label: 'Tier A', variant: 'brand' as const,   bg: 'bg-brand-500' },
    B: { label: 'Tier B', variant: 'success' as const, bg: 'bg-emerald-500' },
    C: { label: 'Tier C', variant: 'neutral' as const, bg: 'bg-surface-400' },
  }
  const tier = tierConfig[hcp.tier as keyof typeof tierConfig] ?? tierConfig.C

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200/50 bg-white/70 shadow-soft backdrop-blur-xl dark:border-surface-800/40 dark:bg-surface-950/45">
      {/* Header gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-violet-600 to-indigo-700 px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <div className="relative flex items-center gap-4">
          <Avatar name={hcp.name} size="lg" className="ring-2 ring-white/30 shadow-lg" />
          <div>
            <p className="font-semibold text-white">{hcp.name}</p>
            <p className="text-sm text-white/75">{hcp.specialty}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn('inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white', tier.bg)}>
                {hcp.tier}
              </span>
              <span className="text-xs text-white/80">{tier.label} HCP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-surface-100/80 dark:bg-surface-800/40">
        {[
          { icon: <Building2 className="h-3.5 w-3.5" />, label: 'Hospital', value: hcp.hospital },
          { icon: <MapPin className="h-3.5 w-3.5" />,    label: 'Location', value: hcp.location },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-2.5 bg-white/80 px-4 py-3.5 dark:bg-surface-900/60">
            <span className="mt-0.5 text-brand-500 dark:text-brand-400">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{item.label}</p>
              <p className="mt-0.5 truncate text-xs font-medium text-surface-800 dark:text-surface-200">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactions count */}
      <div className="flex items-center justify-between border-t border-surface-100/80 bg-white/80 px-5 py-4 dark:border-surface-800/40 dark:bg-surface-900/60">
        <span className="text-sm text-surface-500">Total Interactions</span>
        <span className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">{hcp.totalInteractions}</span>
      </div>
    </div>
  )
}

export function AIInsights() {
  const insights = [
    {
      title: 'Sentiment trending up',
      desc: 'Oncology segment +12% positive interactions this month',
      type: 'success',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: 'Follow-up gap detected',
      desc: '3 Tier A HCPs haven\'t been contacted in 30+ days',
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      title: 'Sample demand rising',
      desc: 'Product X sample requests up 28% vs last quarter',
      type: 'info',
      icon: <Info className="h-4 w-4" />,
    },
  ]

  const typeStyles: Record<string, { bar: string; bg: string; darkBg: string; border: string; darkBorder: string; icon: string }> = {
    success: {
      bar: 'bg-emerald-500',
      bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-950/30',
      border: 'border-emerald-100', darkBorder: 'dark:border-emerald-900/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      bar: 'bg-amber-500',
      bg: 'bg-amber-50',   darkBg: 'dark:bg-amber-950/30',
      border: 'border-amber-100',   darkBorder: 'dark:border-amber-900/40',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      bar: 'bg-brand-500',
      bg: 'bg-brand-50',   darkBg: 'dark:bg-brand-950/30',
      border: 'border-brand-100',   darkBorder: 'dark:border-brand-900/40',
      icon: 'text-brand-600 dark:text-brand-400',
    },
  }

  return (
    <Card>
      <CardHeader
        title="AI Insights"
        description="Powered by interaction analysis"
        action={
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
        }
      />
      <div className="space-y-2.5">
        {insights.map((insight, i) => {
          const s = typeStyles[insight.type]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                'relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01]',
                s.bg, s.darkBg, s.border, s.darkBorder,
              )}
            >
              {/* Left accent bar */}
              <div className={cn('absolute left-0 top-0 h-full w-0.5 rounded-l-full', s.bar)} />
              <div className="flex items-start gap-2.5 pl-2">
                <span className={cn('mt-0.5 shrink-0', s.icon)}>{insight.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{insight.title}</p>
                  <p className="mt-0.5 text-xs text-surface-600 dark:text-surface-400">{insight.desc}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}

export function TodaysTasks({ tasks }: { tasks: FollowUpTask[] }) {
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter((t) => t.dueDate <= today && t.status !== 'completed')

  return (
    <Card>
      <CardHeader
        title="Today's Tasks"
        description={todayTasks.length === 0 ? 'All caught up!' : `${todayTasks.length} tasks due today`}
        action={
          <Link to="/tasks" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
            View all
          </Link>
        }
      />
      {todayTasks.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-surface-900 dark:text-surface-100">You're all caught up!</p>
          <p className="mt-1 text-xs text-surface-500">No tasks are due today.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayTasks.map((task, i) => {
            const cfg = priorityConfig[task.priority]
            return (
              <motion.label
                key={task.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-50/60 dark:hover:bg-surface-800/30"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-surface-200 bg-white transition-colors group-hover:border-brand-400 dark:border-surface-600 dark:bg-surface-900">
                  <input type="checkbox" className="sr-only" />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-surface-700 dark:text-surface-300">{task.title}</span>
                <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
              </motion.label>
            )
          })}
        </div>
      )}
    </Card>
  )
}
