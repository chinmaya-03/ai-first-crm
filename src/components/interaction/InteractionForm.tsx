import { useState, useRef, useEffect } from 'react'
import { Search, X, Plus, Package, FileText, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Button,
  Input,
  Textarea,
  Dropdown,
  Badge,
  Card,
  Modal,
} from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  updateForm,
  resetForm,
  saveInteraction,
  setSaving,
  addMaterial,
  removeMaterial,
  addSample,
  removeSample,
} from '@/redux/slices/interactionSlice'
import { mockMaterials } from '@/services/mockData'
import { searchHcps } from '@/services/api'
import { INTERACTION_TYPES, SENTIMENT_OPTIONS } from '@/types'
import type { InteractionType, Sentiment, HCP } from '@/types'
import { cn } from '@/utils/cn'

export function InteractionForm() {
  const dispatch = useAppDispatch()
  const form = useAppSelector((s) => s.interaction.form)
  const isSaving = useAppSelector((s) => s.interaction.isSaving)

  // Redux is now the single source of truth
  const hcpSearch = form.hcpName

  const [hcpOptions, setHcpOptions] = useState<HCP[]>([])
  const [showHcpDropdown, setShowHcpDropdown] = useState(false)
  const [loadingHcps, setLoadingHcps] = useState(false)

  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [showSampleModal, setShowSampleModal] = useState(false)

  const [materialSearch, setMaterialSearch] = useState('')
  const [sampleName, setSampleName] = useState('')
  const [sampleQty, setSampleQty] = useState(1)

  const hcpRef = useRef<HTMLDivElement>(null)

  const filteredHcps = hcpOptions.filter(
    (h) =>
      h.name.toLowerCase().includes(hcpSearch.toLowerCase()) ||
      h.specialty.toLowerCase().includes(hcpSearch.toLowerCase()),
  )

  const filteredMaterials = mockMaterials.filter((m) =>
    m.name.toLowerCase().includes(materialSearch.toLowerCase()),
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        hcpRef.current &&
        !hcpRef.current.contains(e.target as Node)
      ) {
        setShowHcpDropdown(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () =>
      document.removeEventListener('mousedown', handler)
  }, [])

  const selectHcp = (hcp: HCP) => {
    dispatch(
      updateForm({
        hcpId: hcp.id,
        hcpName: hcp.name,
      }),
    )

    setShowHcpDropdown(false)
  }

  const handleSave = () => {
    if (!form.hcpName) {
      toast.error('Please select an HCP')
      return
    }

    dispatch(setSaving(true))

    setTimeout(() => {
      dispatch(saveInteraction())
      toast.success('Interaction saved successfully!')
    }, 800)
  }

  useEffect(() => {
    const search = async () => {
           if (!hcpSearch.trim()) {
        setHcpOptions([])
        return
      }

      setLoadingHcps(true)

      try {
        const results = await searchHcps({
          doctor_name: hcpSearch,
        })

        setHcpOptions(results)
      } catch {
        setHcpOptions([])
      } finally {
        setLoadingHcps(false)
      }
    }

    const timer = window.setTimeout(search, 300)

    return () => window.clearTimeout(timer)
  }, [hcpSearch])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Log HCP Interaction
          </h1>

          <p className="mt-1 text-sm text-surface-500">
            Record meeting details and use the AI assistant to
            extract structured insights
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => dispatch(resetForm())}
          >
            Clear
          </Button>

          <Button
            loading={isSaving}
            onClick={handleSave}
          >
            Save Interaction
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-5">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div
              ref={hcpRef}
              className="relative space-y-1.5"
            >

              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                HCP Name
              </label>

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />

                <input
                  value={hcpSearch}
                  onChange={(e) => {
                    setShowHcpDropdown(true)

                    dispatch(
                      updateForm({
                        hcpName: e.target.value,
                        hcpId: '',
                      }),
                    )
                  }}
                  onFocus={() => setShowHcpDropdown(true)}
                  placeholder="Search or select HCP..."
                  className="w-full rounded-lg border border-surface-200 bg-white py-2 pl-10 pr-4 text-sm transition-colors hover:border-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-900"
                />
              </div>

              {showHcpDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-surface-200 bg-white shadow-elevated dark:border-surface-700 dark:bg-surface-900"
                >
                  {loadingHcps ? (
                    <div className="px-3 py-3 text-sm text-surface-500">
                      Searching HCPs…
                    </div>
                  ) : filteredHcps.length > 0 ? (
                    filteredHcps.map((hcp) => (
                      <button
                        key={hcp.id}
                        type="button"
                        onClick={() => selectHcp(hcp)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                      >
                        <div>
                          <p className="font-medium text-surface-900 dark:text-surface-100">{hcp.name}</p>
                          <p className="text-xs text-surface-500">
                            {hcp.specialty} · {hcp.hospital}
                          </p>
                        </div>
                        <Badge variant="brand" className="ml-auto">
                          Tier {hcp.tier}
                        </Badge>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-sm text-surface-500">No matching HCPs found.</div>
                  )}
                </motion.div>
              )}
            </div>

            <Dropdown
              label="Interaction Type"
              options={INTERACTION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              value={form.type}
              onChange={(v) => dispatch(updateForm({ type: v as InteractionType }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => dispatch(updateForm({ date: e.target.value }))}
            />
            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => dispatch(updateForm({ time: e.target.value }))}
            />
          </div>

          <Input
            label="Attendees"
            placeholder="Enter names or search..."
            value={form.attendees}
            onChange={(e) => dispatch(updateForm({ attendees: e.target.value }))}
          />

          <Textarea
            label="Topics Discussed"
            placeholder="Describe the key topics and discussion points..."
            rows={4}
            value={form.topics}
            onChange={(e) => dispatch(updateForm({ topics: e.target.value }))}
          />


          <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    <FileText className="h-4 w-4" />
                    Materials Shared
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowMaterialModal(true)}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.materials.length === 0 ? (
                    <p className="text-xs text-surface-400">No materials added</p>
                  ) : (
                    form.materials.map((m) => (
                      <Badge key={m.id} variant="neutral" className="gap-1 pr-1">
                        {m.name}
                        <button onClick={() => dispatch(removeMaterial(m.id))} className="ml-1 rounded-full p-0.5 hover:bg-surface-200 dark:hover:bg-surface-700">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    <Package className="h-4 w-4" />
                    Samples Distributed
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowSampleModal(true)}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.samples.length === 0 ? (
                    <p className="text-xs text-surface-400">No samples added</p>
                  ) : (
                    form.samples.map((s) => (
                      <Badge key={s.id} variant="brand" className="gap-1 pr-1">
                        {s.name} (×{s.quantity})
                        <button onClick={() => dispatch(removeSample(s.id))} className="ml-1 rounded-full p-0.5 hover:bg-brand-200 dark:hover:bg-brand-800">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Observed HCP Sentiment
            </label>
            <div className="flex gap-2">
              {SENTIMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => dispatch(updateForm({ sentiment: opt.value as Sentiment }))}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                    form.sentiment === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-500 dark:bg-brand-950/50 dark:text-brand-300'
                      : 'border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-700 dark:text-surface-400',
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Outcomes"
            placeholder="Key outcomes or agreements..."
            rows={3}
            value={form.outcomes}
            onChange={(e) => dispatch(updateForm({ outcomes: e.target.value }))}
          />

          <Textarea
            label="Follow-up Actions"
            placeholder="Enter next steps or tasks..."
            rows={3}
            value={form.followUpActions}
            onChange={(e) => dispatch(updateForm({ followUpActions: e.target.value }))}
          />

          {form.aiSuggestedFollowUps.length > 0 && (
            <div className="rounded-xl bg-brand-50/50 p-4 dark:bg-brand-950/20">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                <Sparkles className="h-3.5 w-3.5" />
                AI Suggested Follow-ups
              </p>
              <div className="space-y-1">
                {form.aiSuggestedFollowUps.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateForm({
                          followUpActions: form.followUpActions ? `${form.followUpActions}\n${item}` : item,
                        }),
                      )
                    }
                    className="block text-sm text-brand-700 hover:underline dark:text-brand-300"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        title="Add Material"
        size="md"
      >
        <Input
          placeholder="Search materials..."
          value={materialSearch}
          onChange={(e) => setMaterialSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
        <div className="mt-3 max-h-60 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredMaterials.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                dispatch(addMaterial(m))
                setShowMaterialModal(false)
                setMaterialSearch('')
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
            >
              <span>{m.name}</span>
              <Badge variant="neutral">{m.category}</Badge>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={showSampleModal}
        onClose={() => setShowSampleModal(false)}
        title="Add Sample"
        footer={
          <Button
            onClick={() => {
              if (sampleName) {
                dispatch(addSample({ id: `sample-${Date.now()}`, name: sampleName, quantity: sampleQty }))
                setShowSampleModal(false)
                setSampleName('')
                setSampleQty(1)
              }
            }}
          >
            Add Sample
          </Button>
        }
      >
        <div className="space-y-4">
          <Input label="Sample Name" value={sampleName} onChange={(e) => setSampleName(e.target.value)} />
          <Input
            label="Quantity"
            type="number"
            min={1}
            value={sampleQty}
            onChange={(e) => setSampleQty(Number(e.target.value))}
          />
        </div>
      </Modal>
    </div>
  )
}
