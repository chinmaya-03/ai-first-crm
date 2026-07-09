import { useState } from 'react'
import { Bell, Shield, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardHeader, Button, Input, Dropdown, Tabs, Badge } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setTheme, type ThemeMode } from '@/redux/slices/themeSlice'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const { mode } = useAppSelector((s) => s.theme)
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'ai', label: 'AI Settings' },
  ]

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ]

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Settings</h1>
        <p className="mt-1 text-sm text-surface-500">Manage your account and preferences</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'profile' && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader title="Profile Information" description="Update your personal details" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First Name" defaultValue="Alex" />
                <Input label="Last Name" defaultValue="Morgan" />
              </div>
              <Input label="Email" type="email" defaultValue="alex.morgan@medai.com" />
              <Input label="Job Title" defaultValue="Medical Science Liaison" />
              <Input label="Territory" defaultValue="Northeast Region" />
            </div>
          </Card>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader title="Notification Preferences" />
            <div className="space-y-4">
              {[
                { label: 'Follow-up reminders', desc: 'Get notified when tasks are due', enabled: true },
                { label: 'New AI insights', desc: 'Receive AI-generated engagement insights', enabled: true },
                { label: 'Interaction confirmations', desc: 'Confirm when interactions are saved', enabled: false },
                { label: 'Weekly summary', desc: 'Receive a weekly activity digest', enabled: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between rounded-lg border border-surface-100 p-4 dark:border-surface-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-surface-400" />
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.label}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-surface-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={item.enabled}
                    className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                  />
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader title="Theme" description="Choose your preferred color scheme" />
            <Dropdown
              label="Color Mode"
              options={themeOptions}
              value={mode}
              onChange={(v) => dispatch(setTheme(v as ThemeMode))}
            />
          </Card>
          <Card>
            <CardHeader title="Display" />
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-surface-700 dark:text-surface-300">Compact sidebar</span>
                <input type="checkbox" className="h-4 w-4 rounded text-brand-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-surface-700 dark:text-surface-300">Show AI panel by default</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
              </label>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader
              title="AI Assistant Configuration"
              description="Customize how AI processes your interactions"
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-brand-50 p-4 dark:bg-brand-950/30">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">AI Autofill</p>
                    <p className="text-xs text-surface-500">Automatically suggest form values from chat</p>
                  </div>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-surface-700 dark:text-surface-300">Voice note transcription</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-surface-700 dark:text-surface-300">Auto-generate follow-up suggestions</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-brand-600" />
              </label>
              <Dropdown
                label="Confidence Threshold"
                options={[
                  { value: 'low', label: 'Low (60%+)' },
                  { value: 'medium', label: 'Medium (75%+)' },
                  { value: 'high', label: 'High (90%+)' },
                ]}
                value="medium"
                onChange={() => {}}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Data & Privacy" />
            <div className="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
              <Shield className="h-4 w-4" />
              AI processing complies with HIPAA guidelines. Voice data is encrypted and not stored.
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
