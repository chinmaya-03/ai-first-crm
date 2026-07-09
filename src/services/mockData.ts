import type {
  ActivityItem,
  AIExtractionResult,
  DashboardStats,
  FollowUpTask,
  HCP,
  Interaction,
  Material,
  Notification,
  ReportMetric,
} from '@/types'

export const mockHcps: HCP[] = [
  {
    id: 'hcp-1',
    name: 'Dr. Sarah Chen',
    specialty: 'Oncology',
    hospital: 'Memorial Cancer Center',
    email: 's.chen@memorial.org',
    phone: '+1 (555) 234-5678',
    tier: 'A',
    lastInteraction: '2025-04-15T10:30:00Z',
    totalInteractions: 24,
    location: 'Boston, MA',
  },
  {
    id: 'hcp-2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Cardiology',
    hospital: 'Heart & Vascular Institute',
    email: 'm.rodriguez@hvi.org',
    phone: '+1 (555) 345-6789',
    tier: 'A',
    lastInteraction: '2025-04-12T14:00:00Z',
    totalInteractions: 18,
    location: 'Chicago, IL',
  },
  {
    id: 'hcp-3',
    name: 'Dr. Emily Watson',
    specialty: 'Neurology',
    hospital: 'University Medical Center',
    email: 'e.watson@umc.edu',
    phone: '+1 (555) 456-7890',
    tier: 'B',
    lastInteraction: '2025-04-10T09:15:00Z',
    totalInteractions: 12,
    location: 'San Francisco, CA',
  },
  {
    id: 'hcp-4',
    name: 'Dr. James Park',
    specialty: 'Endocrinology',
    hospital: 'Metro Health System',
    email: 'j.park@metrohealth.org',
    phone: '+1 (555) 567-8901',
    tier: 'B',
    lastInteraction: '2025-04-08T16:45:00Z',
    totalInteractions: 9,
    location: 'Seattle, WA',
  },
  {
    id: 'hcp-5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Rheumatology',
    hospital: 'Regional Specialty Clinic',
    email: 'l.thompson@rsc.org',
    phone: '+1 (555) 678-9012',
    tier: 'C',
    lastInteraction: '2025-04-05T11:00:00Z',
    totalInteractions: 6,
    location: 'Denver, CO',
  },
  {
    id: 'hcp-6',
    name: 'Dr. Robert Kim',
    specialty: 'Pulmonology',
    hospital: 'Pacific Lung Center',
    email: 'r.kim@plc.org',
    phone: '+1 (555) 789-0123',
    tier: 'A',
    lastInteraction: '2025-04-03T13:30:00Z',
    totalInteractions: 15,
    location: 'Los Angeles, CA',
  },
]

export const mockMaterials: Material[] = [
  { id: 'mat-1', name: 'Product X Clinical Overview', category: 'Clinical' },
  { id: 'mat-2', name: 'Efficacy Study Summary 2024', category: 'Research' },
  { id: 'mat-3', name: 'Patient Support Program Guide', category: 'Support' },
  { id: 'mat-4', name: 'Dosing & Administration Guide', category: 'Clinical' },
  { id: 'mat-5', name: 'Safety Profile Brochure', category: 'Safety' },
  { id: 'mat-6', name: 'Competitive Landscape Analysis', category: 'Market' },
]

export const mockInteractions: Interaction[] = [
  {
    id: 'int-1',
    hcpId: 'hcp-1',
    hcpName: 'Dr. Sarah Chen',
    type: 'meeting',
    date: '2025-04-15',
    time: '10:30',
    attendees: 'Dr. Chen, Oncology Fellow',
    topics: 'Discussed Product X efficacy in NSCLC patients. Dr. Chen expressed interest in new clinical trial data.',
    materials: [mockMaterials[0], mockMaterials[1]],
    samples: [{ id: 's1', name: 'Product X Sample Kit', quantity: 2 }],
    sentiment: 'positive',
    outcomes: 'Agreed to review new trial data. Requested samples for two patients.',
    followUpActions: 'Send updated clinical data by April 22. Schedule follow-up in 2 weeks.',
    aiSuggestedFollowUps: ['Schedule follow-up meeting in 2 weeks', 'Send clinical trial summary'],
    createdAt: '2025-04-15T10:30:00Z',
  },
  {
    id: 'int-2',
    hcpId: 'hcp-2',
    hcpName: 'Dr. Michael Rodriguez',
    type: 'call',
    date: '2025-04-12',
    time: '14:00',
    attendees: 'Dr. Rodriguez',
    topics: 'Follow-up on formulary discussion. Dr. Rodriguez needs additional cost-effectiveness data.',
    materials: [mockMaterials[5]],
    samples: [],
    sentiment: 'neutral',
    outcomes: 'Will present to P&T committee next month.',
    followUpActions: 'Prepare health economics presentation.',
    aiSuggestedFollowUps: ['Send HEOR data package'],
    createdAt: '2025-04-12T14:00:00Z',
  },
]

export const mockTasks: FollowUpTask[] = [
  {
    id: 'task-1',
    title: 'Send clinical trial summary to Dr. Chen',
    hcpName: 'Dr. Sarah Chen',
    dueDate: '2025-04-22',
    priority: 'high',
    status: 'pending',
    description: 'Include Phase III results and safety profile update.',
  },
  {
    id: 'task-2',
    title: 'Schedule follow-up with Dr. Rodriguez',
    hcpName: 'Dr. Michael Rodriguez',
    dueDate: '2025-04-20',
    priority: 'medium',
    status: 'in_progress',
    description: 'Discuss P&T committee presentation materials.',
  },
  {
    id: 'task-3',
    title: 'Deliver sample kits to Memorial Cancer Center',
    hcpName: 'Dr. Sarah Chen',
    dueDate: '2025-04-18',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'task-4',
    title: 'Prepare HEOR presentation',
    hcpName: 'Dr. Michael Rodriguez',
    dueDate: '2025-04-25',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 'task-5',
    title: 'Conference follow-up emails',
    hcpName: 'Multiple HCPs',
    dueDate: '2025-04-19',
    priority: 'low',
    status: 'completed',
  },
]

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'interaction',
    title: 'Logged meeting with Dr. Sarah Chen',
    description: 'Product X efficacy discussion at Memorial Cancer Center',
    timestamp: '2025-04-15T10:30:00Z',
    user: 'You',
  },
  {
    id: 'act-2',
    type: 'ai',
    title: 'AI extracted 3 action items',
    description: 'From voice note transcription — 94% confidence',
    timestamp: '2025-04-15T10:32:00Z',
    user: 'AI Assistant',
  },
  {
    id: 'act-3',
    type: 'task',
    title: 'Task completed: Conference follow-up emails',
    description: 'Sent to 12 HCPs from ASCO booth visits',
    timestamp: '2025-04-14T16:00:00Z',
    user: 'You',
  },
  {
    id: 'act-4',
    type: 'interaction',
    title: 'Logged call with Dr. Michael Rodriguez',
    description: 'Formulary discussion follow-up',
    timestamp: '2025-04-12T14:00:00Z',
    user: 'You',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Follow-up due today',
    message: 'Send clinical trial summary to Dr. Sarah Chen',
    read: false,
    timestamp: '2025-04-19T08:00:00Z',
    type: 'warning',
  },
  {
    id: 'notif-2',
    title: 'New AI insight available',
    message: 'Sentiment trend improved for Oncology segment',
    read: false,
    timestamp: '2025-04-18T14:30:00Z',
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'Interaction logged',
    message: 'Meeting with Dr. Sarah Chen saved successfully',
    read: true,
    timestamp: '2025-04-15T10:35:00Z',
    type: 'success',
  },
]

export const mockDashboardStats: DashboardStats = {
  totalHcps: 156,
  interactionsThisMonth: 47,
  pendingTasks: 12,
  avgSentiment: 0.72,
}

export const mockReportMetrics: ReportMetric[] = [
  { label: 'Total Interactions', value: 247, change: 12.5, trend: 'up' },
  { label: 'Active HCPs', value: 156, change: 4.2, trend: 'up' },
  { label: 'Avg. Sentiment Score', value: '72%', change: 3.1, trend: 'up' },
  { label: 'Task Completion Rate', value: '84%', change: -2.4, trend: 'down' },
  { label: 'Samples Distributed', value: 89, change: 8.7, trend: 'up' },
  { label: 'AI Autofill Usage', value: '63%', change: 15.2, trend: 'up' },
]

export const suggestedPrompts = [
  'Met Dr. Smith at Memorial Hospital, discussed Product X efficacy...',
  'Had a 30-min call with cardiologist about formulary access',
  'Conference booth visit — collected samples request for 3 patients',
  'Email follow-up after ASCO presentation on new trial data',
]

export function parseAIInput(input: string): AIExtractionResult {
  const lower = input.toLowerCase()
  const sentiment: AIExtractionResult['sentiment'] = lower.includes('concern') ||
    lower.includes('negative') ||
    lower.includes('declined')
    ? 'negative'
    : lower.includes('interested') || lower.includes('positive') || lower.includes('agreed')
      ? 'positive'
      : 'neutral'

  const doctorMatch = input.match(/dr\.?\s+([a-z]+(?:\s+[a-z]+)?)/i)
  const doctor = doctorMatch ? `Dr. ${doctorMatch[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}` : 'Dr. Sarah Chen'

  const hospitalMatch = input.match(/(?:at|from)\s+([A-Z][a-zA-Z\s&]+(?:Center|Hospital|Institute|Clinic|Medical))/i)
  const hospital = hospitalMatch ? hospitalMatch[1].trim() : 'Memorial Cancer Center'

  const drugMatch = input.match(/product\s+[a-z0-9]+/i)
  const drugMentioned = drugMatch ? drugMatch[0] : 'Product X'

  const actionItems: string[] = []
  if (lower.includes('follow-up') || lower.includes('follow up')) {
    actionItems.push('Schedule follow-up meeting in 2 weeks')
  }
  if (lower.includes('sample')) {
    actionItems.push('Prepare and deliver sample kits')
  }
  if (lower.includes('data') || lower.includes('trial')) {
    actionItems.push('Send updated clinical trial data')
  }
  if (actionItems.length === 0) {
    actionItems.push('Send meeting summary email', 'Update CRM notes')
  }

  const samplesRequested: string[] = []
  if (lower.includes('sample')) {
    samplesRequested.push('Product X Sample Kit (x2)')
  }

  return {
    doctor,
    hospital,
    drugMentioned,
    productsDiscussed: [drugMentioned],
    sentiment,
    samplesRequested,
    followUpDate: '2025-05-03',
    actionItems,
    confidenceScore: 0.87 + Math.random() * 0.1,
    summary: `Interaction with ${doctor} at ${hospital}. Discussed ${drugMentioned} with ${sentiment} reception. Key topics extracted from your description.`,
    interactionType: lower.includes('call') ? 'call' : lower.includes('email') ? 'email' : lower.includes('conference') ? 'conference' : 'meeting',
    topics: input,
    attendees: doctor,
  }
}

export function simulateTypingDelay(ms = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
