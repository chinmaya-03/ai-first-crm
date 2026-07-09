import type { AIExtractionResult, HCP } from '@/types'

const BASE_URL = '/api/v1'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  console.log('================================')
  console.log('🚀 API REQUEST')
  console.log('URL:', `${BASE_URL}${path}`)
  console.log('OPTIONS:', options)

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  console.log('STATUS:', response.status)

  const body = await response.text()

  console.log('RESPONSE BODY:')
  console.log(body)

  if (!response.ok) {
    throw new Error(body || 'API request failed')
  }

  return JSON.parse(body) as T
}

function normalizeAIResult(payload: any): AIExtractionResult {
  console.log('NORMALIZING RESPONSE:')
  console.log(payload)

  const productsDiscussed = Array.isArray(payload.products_discussed)
    ? payload.products_discussed.map(String)
    : payload.products_discussed
    ? [String(payload.products_discussed)]
    : []

  const actionItems = Array.isArray(payload.action_items)
    ? payload.action_items.map(String)
    : payload.actionItems
    ? Array.isArray(payload.actionItems)
      ? payload.actionItems.map(String)
      : [String(payload.actionItems)]
    : payload.next_action || payload.nextAction
    ? [String(payload.next_action ?? payload.nextAction)]
    : []

  return {
    hcpId: payload.hcp_id ?? payload.hcpId ?? '',

    doctor: payload.doctor_name ?? payload.doctor ?? 'Unknown',
    
    hospital: payload.hospital ?? 'Unknown',
    drugMentioned: productsDiscussed.join(', '),
    productsDiscussed,
    sentiment: payload.sentiment ?? 'neutral',
    samplesRequested: Array.isArray(payload.samples_requested)
      ? payload.samples_requested.map(String)
      : payload.samples_requested
      ? [String(payload.samples_requested)]
      : [],
    followUpDate: payload.follow_up_date ?? payload.followUpDate ?? '',
    actionItems,
    confidenceScore:
      typeof payload.confidenceScore === 'number'
        ? payload.confidenceScore
        : 0.92,
    summary: payload.summary ?? payload.interaction_summary ?? '',
    interactionType: payload.interaction_type ?? payload.interactionType,
    topics: payload.topics ?? payload.summary ?? '',
    attendees: payload.attendees ?? '',
  }
}

export async function logInteraction(text: string): Promise<AIExtractionResult> {
  console.log('🟢 logInteraction()')
  console.log(text)

  const payload = await request<any>('/ai/log-interaction', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })

  console.log('RAW BACKEND RESPONSE:')
  console.log(payload)

  return normalizeAIResult(payload)
}

export async function editInteraction(
  interactionId: string,
  data: Record<string, unknown>,
) {
  return request<any>(`/ai/edit-interaction/${interactionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function searchHcps(params: {
  doctor_name?: string
  hospital?: string
  specialty?: string
}) {
  const query = new URLSearchParams()

  if (params.doctor_name) query.set('doctor_name', params.doctor_name)
  if (params.hospital) query.set('hospital', params.hospital)
  if (params.specialty) query.set('specialty', params.specialty)

  return request<HCP[]>(`/ai/search-hcp?${query.toString()}`)
}

export async function getInteractionHistory(hcpId: string) {
  return request<
    Array<{
      id: string
      date: string
      topics: string
      sentiment: string
      outcomes?: string
    }>
  >(`/ai/history/${hcpId}`)
}

export async function recommendNext(hcpId: string) {
  const payload = await request<{ recommendation: string }>(
    `/ai/recommend-next`,
    {
      method: 'POST',
      body: JSON.stringify({ hcp_id: hcpId }),
    },
  )

  return payload.recommendation
}

export async function listHcps(search?: string, specialty?: string) {
  const query = new URLSearchParams()

  if (search) query.set('search', search)
  if (specialty && specialty !== 'all')
    query.set('specialty', specialty)

  const response = await request<{
    total: number
    skip: number
    limit: number
    items: HCP[]
  }>(`/hcps?${query.toString()}`)

  return response.items
}

export async function getHcp(id: string) {
  return request<HCP>(`/hcps/${id}`)
}

export async function listInteractions(hcpId?: string) {
  const query = new URLSearchParams()

  if (hcpId) query.set('hcp_id', hcpId)

  return request<
    Array<{
      id: string
      hcp_id: string
      date: string
      topics: string
      sentiment: string
      outcomes?: string
      follow_up_actions?: string
      next_action?: string
    }>
  >(`/interactions?${query.toString()}`)
}

export async function listFollowups(status?: string) {
  const query = new URLSearchParams()

  if (status) query.set('status', status)

  return request<any>(`/followups?${query.toString()}`)
}