import { Link } from 'react-router-dom'
import { Search, Filter, Plus, MapPin, Building2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, Badge, Button, Card, Dropdown, EmptyState } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setSearchFilter, setSpecialtyFilter } from '@/redux/slices/hcpSlice'
import { formatRelative } from '@/utils/format'

const specialties = [
  { value: 'all', label: 'All Specialties' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Endocrinology', label: 'Endocrinology' },
  { value: 'Rheumatology', label: 'Rheumatology' },
  { value: 'Pulmonology', label: 'Pulmonology' },
]

const tierVariant = { A: 'brand' as const, B: 'success' as const, C: 'neutral' as const }

export function HcpListPage() {
  const dispatch = useAppDispatch()
  const { hcps, searchFilter, specialtyFilter } = useAppSelector((s) => s.hcp)

  const filtered = hcps.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      h.hospital.toLowerCase().includes(searchFilter.toLowerCase())
    const matchesSpecialty = specialtyFilter === 'all' || h.specialty === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Healthcare Professionals
          </h1>
          <p className="mt-1 text-sm text-surface-500">{hcps.length} HCPs in your territory</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add HCP</Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            value={searchFilter}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            placeholder="Search by name or hospital..."
            className="h-10 w-full rounded-lg border border-surface-200 bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-900"
          />
        </div>
        <Dropdown
          options={specialties}
          value={specialtyFilter}
          onChange={(v) => dispatch(setSpecialtyFilter(v))}
          placeholder="Specialty"
          className="w-48"
        />
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No HCPs found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((hcp, i) => (
            <motion.div
              key={hcp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/hcps/${hcp.id}`}>
                <Card hover className="group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <Avatar name={hcp.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400">
                          {hcp.name}
                        </h3>
                        <Badge variant={tierVariant[hcp.tier]}>Tier {hcp.tier}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-surface-500">{hcp.specialty}</p>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-surface-500">
                          <Building2 className="h-3.5 w-3.5" />
                          {hcp.hospital}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-surface-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {hcp.location}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-surface-100 pt-3 dark:border-surface-800">
                        <span className="text-xs text-surface-500">
                          {hcp.totalInteractions} interactions
                        </span>
                        {hcp.lastInteraction && (
                          <span className="text-xs text-surface-400">
                            Last: {formatRelative(hcp.lastInteraction)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
