import { cn } from '@/lib/utils'
import { useFunnel } from '@/stores/FunnelContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatBubbleProps {
  sender: 'mentor' | 'user'
  text: string
  isTyping?: boolean
  delay?: number
}

export function ChatBubble({ sender, text, isTyping, delay = 0 }: ChatBubbleProps) {
  const { config } = useFunnel()
  const isMentor = sender === 'mentor'

  // Highlight variables like {{name}}
  const formatText = (content: string) => {
    const parts = content.split(/(\{\{.*?\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span key={i} className="font-bold" style={{ color: config.primaryColor }}>
            {part.replace(/[{}]/g, '')}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in-up mb-6',
        isMentor ? 'justify-start' : 'justify-end',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn('flex max-w-[85%] gap-3', isMentor ? 'flex-row' : 'flex-row-reverse')}>
        {isMentor && (
          <Avatar className="w-10 h-10 border border-[var(--av-border)] flex-shrink-0 mt-auto">
            <AvatarImage src={config.mentorAvatarUrl} />
            <AvatarFallback className="bg-[var(--av-surface)] text-xs">AV</AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            'p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm',
            isMentor
              ? 'bg-[var(--av-surface)] border border-[var(--av-border)] text-[var(--av-text-primary)] rounded-bl-sm'
              : 'text-white rounded-br-sm shadow-av-glow',
          )}
          style={!isMentor ? { backgroundImage: 'var(--av-gradient-cta)' } : {}}
        >
          {isTyping ? (
            <div className="flex gap-1 items-center h-5 px-1">
              <span className="w-1.5 h-1.5 bg-[var(--av-text-secondary)] rounded-full animate-pulse-soft"></span>
              <span
                className="w-1.5 h-1.5 bg-[var(--av-text-secondary)] rounded-full animate-pulse-soft"
                style={{ animationDelay: '200ms' }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-[var(--av-text-secondary)] rounded-full animate-pulse-soft"
                style={{ animationDelay: '400ms' }}
              ></span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{formatText(text)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
