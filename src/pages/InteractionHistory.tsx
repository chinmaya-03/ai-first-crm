import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageSquare, Filter, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, Badge, Button, Card, Dropdown, EmptyState } from '@/components/ui'
import { useAppSelector } from '@/redux/hooks'
import { formatDate } from '@/utils/format'
import { INTERACTION_TYPES } from '@/types'

const typeFilterOptions = [
  { value: 'all', label: 'All Types' },
  ...INTERACTION_TYPES.map((t) => ({ value: t.value, label: t.label })),
]

const sentimentVariant = {
  positive: 'success' as const,
  neutral: 'neutral' as const,
  negative: 'danger' as const,
}

export function InteractionHistoryPage() {
  const interactions = useAppSelector((s) => s.interaction.interactions)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = interactions.filter((int) => {
    const matchesSearch =
      int.hcpName.toLowerCase().includes(search.toLowerCase()) ||
      int.topics.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || int.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Interaction History
          </h1>
          <p className="mt-1 text-sm text-surface-500">{interactions.length} total interactions</p>
        </div>
        <Link to="/interactions/log">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Log Interaction</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interactions..."
            className="h-10 w-full rounded-lg border border-surface-200 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-900"
          />
        </div>
        <Dropdown options={typeFilterOptions} value={typeFilter} onChange={setTypeFilter} className="w-44" />
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filters</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No interactions found"
          description="Start logging your HCP interactions"
          action={{ label: 'Log Interaction', onClick: () => window.location.assign('/interactions/log') }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((int, i) => (
            <motion.div
              key={int.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover>
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar name={int.hcpName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">{int.hcpName}</h3>
                      <Badge variant="neutral" className="capitalize">{int.type}</Badge>
                      <Badge variant={sentimentVariant[int.sentiment]}>{int.sentiment}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">{int.topics}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-surface-500">
                      <span>{formatDate(int.date)} at {int.time}</span>
                      {int.materials.length > 0 && <span>{int.materials.length} materials shared</span>}
                      {int.samples.length > 0 && <span>{int.samples.length} samples distributed</span>}
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
