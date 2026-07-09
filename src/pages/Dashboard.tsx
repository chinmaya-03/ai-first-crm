import { Users, MessageSquare, CheckSquare, Smile } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import {
  UpcomingFollowUps,
  RecentInteractions,
  RecentActivity,
  DoctorInfoCard,
  AIInsights,
  TodaysTasks,
} from '@/components/dashboard/DashboardWidgets'
import { useAppSelector } from '@/redux/hooks'
import { mockHcps } from '@/services/mockData'
import { formatPercent } from '@/utils/format'

export function DashboardPage() {
  const stats = useAppSelector((s) => s.dashboard.stats)
  const tasks = useAppSelector((s) => s.dashboard.tasks)
  const activities = useAppSelector((s) => s.dashboard.activities)
  const interactions = useAppSelector((s) => s.interaction.interactions)
  const featuredHcp = mockHcps[0]

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Good morning, Alex
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Here's what's happening with your HCP engagements today.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total HCPs"
          value={stats.totalHcps}
          change={4.2}
          trend="up"
          icon={<Users className="h-5 w-5" />}
          index={0}
        />
        <StatCard
          label="Interactions"
          value={stats.interactionsThisMonth}
          change={12.5}
          trend="up"
          icon={<MessageSquare className="h-5 w-5" />}
          index={1}
        />
        <StatCard
          label="Pending Tasks"
          value={stats.pendingTasks}
          change={-8.3}
          trend="down"
          icon={<CheckSquare className="h-5 w-5" />}
          index={2}
        />
        <StatCard
          label="Avg. Sentiment"
          value={formatPercent(stats.avgSentiment)}
          change={3.1}
          trend="up"
          icon={<Smile className="h-5 w-5" />}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UpcomingFollowUps tasks={tasks} />
          <RecentInteractions interactions={interactions} />
        </div>
        <div className="space-y-6">
          <DoctorInfoCard hcp={featuredHcp} />
          <AIInsights />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity activities={activities} />
        <TodaysTasks tasks={tasks} />
      </div>
    </div>
  )
}
