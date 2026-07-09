import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ChatMessage } from '@/types'
import { suggestedPrompts } from '@/services/mockData'

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  suggestedPrompts: string[]
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm your AI assistant. Describe your HCP interaction in natural language and I'll extract structured data for you. Try something like:\n\n\"Met Dr. Chen at Memorial Hospital, discussed Product X efficacy, she requested samples.\"",
  timestamp: new Date().toISOString(),
}

const initialState: ChatState = {
  messages: [welcomeMessage],
  isTyping: false,
  suggestedPrompts,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    clearChat: (state) => {
      state.messages = [welcomeMessage]
    },
  },
})

export const { addMessage, setTyping, clearChat } = chatSlice.actions
export default chatSlice.reducer
