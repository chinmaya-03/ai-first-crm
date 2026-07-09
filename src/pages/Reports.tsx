import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardHeader, Badge } from '@/components/ui'
import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/utils/cn'

export function ReportsPage() {
  const metrics = useAppSelector((s) => s.dashboard.reportMetrics)
  const interactions = useAppSelector((s) => s.interaction.interactions)

  const sentimentBreakdown = {
    positive: interactions.filter((i) => i.sentiment === 'positive').length,
    neutral: interactions.filter((i) => i.sentiment === 'neutral').length,
    negative: interactions.filter((i) => i.sentiment === 'negative').length,
  }
  const total = sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1

  const typeBreakdown = interactions.reduce(
    (acc, int) => {
      acc[int.type] = (acc[int.type] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Reports</h1>
        <p className="mt-1 text-sm text-surface-500">Analytics and performance insights</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <p className="text-xs font-medium uppercase tracking-wider text-surface-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-100">{metric.value}</p>
              <div
                className={cn(
                  'mt-2 flex items-center gap-1 text-xs font-medium',
                  metric.trend === 'up' && 'text-emerald-600',
                  metric.trend === 'down' && 'text-red-500',
                )}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {metric.change > 0 ? '+' : ''}
                {metric.change}% vs last period
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Sentiment Distribution" description="Across all logged interactions" />
          <div className="space-y-4">
            {(['positive', 'neutral', 'negative'] as const).map((sentiment) => {
              const count = sentimentBreakdown[sentiment]
              const pct = Math.round((count / total) * 100)
              const colors = { positive: 'bg-emerald-500', neutral: 'bg-surface-400', negative: 'bg-red-500' }
              return (
                <div key={sentiment}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="capitalize text-surface-700 dark:text-surface-300">{sentiment}</span>
                    <span className="font-medium text-surface-900 dark:text-surface-100">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn('h-full rounded-full', colors[sentiment])}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Interaction Types" description="Breakdown by channel" />
          <div className="space-y-3">
            {Object.entries(typeBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between rounded-lg bg-surface-50 px-4 py-3 dark:bg-surface-800/50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm capitalize text-surface-700 dark:text-surface-300">{type}</span>
                </div>
                <Badge variant="brand">{count}</Badge>
              </div>
            ))}
            {Object.keys(typeBreakdown).length === 0 && (
              <p className="py-4 text-center text-sm text-surface-500">No interaction data yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
