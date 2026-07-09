export type InteractionType = 'meeting' | 'call' | 'email' | 'conference' | 'other'
export type Sentiment = 'positive' | 'neutral' | 'negative'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface HCP {
  id: string
  name: string
  specialty: string
  hospital: string
  email: string
  phone: string
  avatar?: string
  tier: 'A' | 'B' | 'C'
  lastInteraction?: string
  totalInteractions: number
  location: string
}

export interface Material {
  id: string
  name: string
  category: string
}

export interface Sample {
  id: string
  name: string
  quantity: number
}

export interface InteractionFormData {
  hcpId: string
  hcpName: string
  type: InteractionType
  date: string
  time: string
  attendees: string
  topics: string
  materials: Material[]
  samples: Sample[]
  sentiment: Sentiment
  outcomes: string
  followUpActions: string
  aiSuggestedFollowUps: string[]
}

export interface Interaction extends InteractionFormData {
  id: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  aiResult?: AIExtractionResult
}

export interface AIExtractionResult {
  hcpId?: string

  doctor: string
  hospital: string
  drugMentioned: string
  productsDiscussed: string[]
  sentiment: Sentiment
  samplesRequested: string[]
  followUpDate: string
  actionItems: string[]
  confidenceScore: number
  summary: string
  interactionType?: InteractionType
  topics?: string
  attendees?: string
}

export interface FollowUpTask {
  id: string
  title: string
  hcpName: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  description?: string
}

export interface ActivityItem {
  id: string
  type: 'interaction' | 'task' | 'note' | 'ai'
  title: string
  description: string
  timestamp: string
  user: string
}

export interface DashboardStats {
  totalHcps: number
  interactionsThisMonth: number
  pendingTasks: number
  avgSentiment: number
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  type: 'info' | 'success' | 'warning'
}

export interface ReportMetric {
  label: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'neutral'
}

export const INTERACTION_TYPES: { value: InteractionType; label: string }[] = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Other' },
]

export const SENTIMENT_OPTIONS: { value: Sentiment; label: string; emoji: string }[] = [
  { value: 'positive', label: 'Positive', emoji: '😊' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'negative', label: 'Negative', emoji: '😟' },
]

export const DEFAULT_INTERACTION_FORM: InteractionFormData = {
  hcpId: '',
  hcpName: '',
  type: 'meeting',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  attendees: '',
  topics: '',
  materials: [],
  samples: [],
  sentiment: 'neutral',
  outcomes: '',
  followUpActions: '',
  aiSuggestedFollowUps: [],
}
