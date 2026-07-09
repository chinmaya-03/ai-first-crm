import { logInteraction } from './api'
import type { AIExtractionResult } from '@/types'

export async function processAIMessage(input: string): Promise<AIExtractionResult> {
  return logInteraction(input)
}
