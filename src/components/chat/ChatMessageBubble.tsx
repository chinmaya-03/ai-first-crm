import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatTime } from '@/utils/format'
import type { ChatMessage } from '@/types'
import { AIResultCard } from './AIResultCard'

interface ChatMessageBubbleProps {
  message: ChatMessage
  onApplyResult?: () => void
}

export function ChatMessageBubble({ message, onApplyResult }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-brand-600 to-violet-600 text-white'
            : 'bg-gradient-to-br from-violet-500 to-brand-600 text-white',
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Content */}
      <div className={cn('max-w-[88%] space-y-1.5', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-sm shadow-brand-500/20'
              : 'rounded-tl-sm border border-surface-100/80 bg-surface-50 text-surface-800 dark:border-surface-800/50 dark:bg-surface-800/60 dark:text-surface-200',
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={cn('text-[10px] text-surface-400 dark:text-surface-500', isUser ? 'text-right' : 'text-left')}>
          {formatTime(message.timestamp)}
        </p>
        {message.aiResult && onApplyResult && (
          <AIResultCard result={message.aiResult} onApply={onApplyResult} />
        )}
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-brand-600 text-white shadow-sm">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-surface-100/80 bg-surface-50 px-4 py-3 dark:border-surface-800/50 dark:bg-surface-800/60">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-surface-400 dark:bg-surface-500"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
