import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Mic, Paperclip, Sparkles, Trash2, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui'
import { ChatMessageBubble, TypingIndicator } from './ChatMessageBubble'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addMessage, setTyping, clearChat } from '@/redux/slices/chatSlice'
import { applyAIResult } from '@/redux/slices/interactionSlice'
import { processAIMessage } from '@/services/aiService'
import type { ChatMessage } from '@/types'
import { cn } from '@/utils/cn'

interface AIAssistantPanelProps {
  className?: string
  sticky?: boolean
}

export function AIAssistantPanel({ className, sticky = true }: AIAssistantPanelProps) {
  const dispatch = useAppDispatch()
  const { messages, isTyping, suggestedPrompts } = useAppSelector((s) => s.chat)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = async (text?: string) => {
  const content = (text ?? input).trim()
  if (!content || isTyping) return

  const userMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  }

  dispatch(addMessage(userMessage))
  setInput('')
  dispatch(setTyping(true))

  try {
    console.log("Sending message:", content)

    const result = await processAIMessage(content)

    console.log("AI Response:", result)

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content:
        "I've extracted the key details from your description. Review the summary cards below and click **Apply to Form** to auto-populate the interaction form.",
      timestamp: new Date().toISOString(),
      aiResult: result,
    }

    dispatch(addMessage(assistantMessage))
  } catch (error: any) {
    console.error("AI ERROR")
    console.error(error)

    if (error instanceof Error) {
      console.error(error.message)
      toast.error(error.message)
    } else {
      console.error(error)
      toast.error("Unknown error")
    }
  } finally {
    dispatch(setTyping(false))
  }
}

  const handleApplyResult = (message: ChatMessage) => {
  if (!message.aiResult) return

  const r = message.aiResult

  console.log("APPLY TO FORM")
  console.log(message.aiResult)
  console.log("Doctor:", r.doctor)
  console.log("Summary:", r.summary)
  console.log("Topics:", r.topics)

  dispatch(
    applyAIResult({
      hcpName: r.doctor,
      type: r.interactionType ?? "meeting",
      topics: r.topics ?? r.summary,
      sentiment: r.sentiment,
      outcomes: r.summary,
      followUpActions: r.actionItems.join("\n"),
      aiSuggestedFollowUps: r.actionItems,
      attendees: r.attendees ?? r.doctor,
    })
  )

  toast.success("AI data applied to form!")
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col border-l border-surface-200/50 bg-white/60 backdrop-blur-xl dark:border-surface-800/40 dark:bg-surface-950/50',
        sticky && 'sticky top-0 h-[calc(100vh-4rem)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-200/50 px-5 py-4 dark:border-surface-800/40">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 shadow-md shadow-brand-500/25">
            <Sparkles className="h-4 w-4 text-white" />
            {/* Live indicator */}
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-surface-900 dark:text-surface-100">AI Assistant</h2>
            <p className="text-[11px] text-surface-500">Log interactions via chat</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearChat())}
          className="rounded-xl p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
          aria-label="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onApplyResult={msg.aiResult ? () => handleApplyResult(msg) : undefined}
              />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="border-t border-surface-200/50 px-4 py-3 dark:border-surface-800/40"
          >
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-surface-400">
              <Zap className="h-3 w-3" />
              Suggested prompts
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSend(prompt)}
                  className="rounded-xl border border-surface-200/80 bg-surface-50/80 px-2.5 py-1.5 text-left text-[11px] text-surface-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-surface-700/60 dark:bg-surface-900/60 dark:text-surface-400 dark:hover:border-brand-700 dark:hover:bg-brand-950/30 dark:hover:text-brand-300"
                >
                  {prompt.slice(0, 55)}…
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="border-t border-surface-200/50 p-3.5 dark:border-surface-800/40">
        <div className="flex items-end gap-2 rounded-2xl border border-surface-200/80 bg-surface-50/80 px-2 py-2 backdrop-blur-sm transition-colors focus-within:border-brand-400/60 focus-within:bg-white dark:border-surface-700/60 dark:bg-surface-900/60 dark:focus-within:bg-surface-900">
          <div className="flex gap-0.5">
            <button
              type="button"
              className="rounded-xl p-1.5 text-surface-400 transition-colors hover:bg-surface-200/80 hover:text-surface-600 dark:hover:bg-surface-800"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-xl p-1.5 text-surface-400 transition-colors hover:bg-surface-200/80 hover:text-surface-600 dark:hover:bg-surface-800"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe interaction..."
            rows={1}
            className="max-h-24 flex-1 resize-none bg-transparent py-1.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-surface-100 dark:placeholder:text-surface-600"
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-surface-400 dark:text-surface-600">
          Press Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  )
}
