import { useState } from 'react'
import { CheckSquare, Plus, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Avatar, Badge, Button, Card, Dropdown, EmptyState, Tabs } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateTaskStatus } from '@/redux/slices/dashboardSlice'
import { formatDate } from '@/utils/format'
import type { TaskStatus } from '@/types'
import { cn } from '@/utils/cn'

const priorityVariant = { high: 'danger' as const, medium: 'warning' as const, low: 'neutral' as const }
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export function FollowUpTasksPage() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((s) => s.dashboard.tasks)
  const [activeTab, setActiveTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'pending', label: 'Pending', count: tasks.filter((t) => t.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
  ]

  const filtered = tasks.filter((t) => {
    const matchesTab = activeTab === 'all' || t.status === activeTab
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesTab && matchesStatus
  })

  const handleToggleComplete = (id: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    dispatch(updateTaskStatus({ id, status: newStatus }))
    toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened')
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Follow-up Tasks
          </h1>
          <p className="mt-1 text-sm text-surface-500">
            {tasks.filter((t) => t.status !== 'completed').length} active tasks
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Task</Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <div className="mb-4">
        <Dropdown options={statusOptions} value={statusFilter} onChange={setStatusFilter} className="w-44" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-6 w-6" />}
          title="No tasks found"
          description="Create a follow-up task from an interaction"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={cn(task.status === 'completed' && 'opacity-60')}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(task.id, task.status)}
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                      task.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-surface-300 hover:border-brand-500 dark:border-surface-600',
                    )}
                    aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.status === 'completed' && <CheckSquare className="h-3 w-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={cn(
                          'font-medium text-surface-900 dark:text-surface-100',
                          task.status === 'completed' && 'line-through',
                        )}
                      >
                        {task.title}
                      </h3>
                      <Badge variant={priorityVariant[task.priority]} dot>{task.priority}</Badge>
                      {task.status === 'in_progress' && <Badge variant="brand">In Progress</Badge>}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-surface-500">{task.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={task.hcpName} size="xs" />
                        <span className="text-xs text-surface-500">{task.hcpName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-surface-500">
                        <Calendar className="h-3 w-3" />
                        Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
