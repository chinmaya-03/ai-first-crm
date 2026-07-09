import { InteractionForm } from '@/components/interaction/InteractionForm'
import { AIAssistantPanel } from '@/components/chat/AIAssistantPanel'

export function LogInteractionPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto p-4 lg:w-[65%] lg:p-6 scrollbar-thin">
        <InteractionForm />
      </div>
      <div className="hidden w-[35%] lg:block">
        <AIAssistantPanel />
      </div>
      <div className="border-t border-surface-200 lg:hidden dark:border-surface-800">
        <AIAssistantPanel sticky={false} className="h-[400px]" />
      </div>
    </div>
  )
}
