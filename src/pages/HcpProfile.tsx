import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  MessageSquare,
  Calendar,
  Plus,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, CardHeader, Tabs, Timeline } from '@/components/ui'
import { useAppSelector } from '@/redux/hooks'
import { formatDate, formatRelative } from '@/utils/format'
import { useState } from 'react'

export function HcpProfilePage() {
  const { id } = useParams<{ id: string }>()
  const hcps = useAppSelector((s) => s.hcp.hcps)
  const interactions = useAppSelector((s) => s.interaction.interactions)
  const hcp = hcps.find((h) => h.id === id)
  const [activeTab, setActiveTab] = useState('overview')

  if (!hcp) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-surface-900 dark:text-surface-100">HCP not found</p>
          <Link to="/hcps" className="mt-2 text-sm text-brand-600 hover:underline dark:text-brand-400">
            Back to HCP list
          </Link>
        </div>
      </div>
    )
  }

  const hcpInteractions = interactions.filter((i) => i.hcpId === hcp.id)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'interactions', label: 'Interactions', count: hcpInteractions.length },
    { id: 'notes', label: 'Notes' },
  ]

  return (
    <div className="p-4 lg:p-6">
      <Link
        to="/hcps"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to HCPs
      </Link>

      <div className="mb-6 overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <div className="bg-gradient-to-r from-brand-600 via-violet-600 to-cyan-600 px-6 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-5">
              <Avatar name={hcp.name} size="xl" className="ring-4 ring-white/20" />
              <div>
                <h1 className="text-2xl font-bold text-white">{hcp.name}</h1>
                <p className="text-white/80">{hcp.specialty}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="brand" className="bg-white/20 text-white">Tier {hcp.tier}</Badge>
                  <Badge variant="neutral" className="bg-white/20 text-white">{hcp.totalInteractions} interactions</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" leftIcon={<MessageSquare className="h-4 w-4" />}>
                Message
              </Button>
              <Link to="/interactions/log">
                <Button leftIcon={<Plus className="h-4 w-4" />}>Log Interaction</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
          {[
            { icon: Building2, label: 'Hospital', value: hcp.hospital },
            { icon: MapPin, label: 'Location', value: hcp.location },
            { icon: Calendar, label: 'Last Interaction', value: hcp.lastInteraction ? formatRelative(hcp.lastInteraction) : 'Never' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-surface-50 p-4 dark:bg-surface-800/50">
              <item.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <div>
                <p className="text-xs text-surface-500">{item.label}</p>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Contact Information" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-surface-400" />
                <span className="text-sm text-surface-700 dark:text-surface-300">{hcp.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-surface-400" />
                <span className="text-sm text-surface-700 dark:text-surface-300">{hcp.phone}</span>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Engagement Summary" />
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Total Interactions</span>
                <span className="font-semibold">{hcp.totalInteractions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Tier Classification</span>
                <Badge variant="brand">Tier {hcp.tier}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Specialty</span>
                <span className="font-semibold">{hcp.specialty}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'interactions' && (
        <Card>
          {hcpInteractions.length === 0 ? (
            <p className="py-8 text-center text-sm text-surface-500">No interactions recorded yet.</p>
          ) : (
            <Timeline
              items={hcpInteractions.map((int) => ({
                id: int.id,
                title: `${int.type.charAt(0).toUpperCase() + int.type.slice(1)} — ${formatDate(int.date)}`,
                description: int.topics.slice(0, 100) + (int.topics.length > 100 ? '...' : ''),
                timestamp: int.createdAt,
                variant: int.sentiment === 'positive' ? 'success' : int.sentiment === 'negative' ? 'warning' : 'default',
              }))}
            />
          )}
        </Card>
      )}

      {activeTab === 'notes' && (
        <Card>
          <p className="py-8 text-center text-sm text-surface-500">No notes yet. Add notes during your next interaction.</p>
        </Card>
      )}
    </div>
  )
}
