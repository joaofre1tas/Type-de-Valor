import { FunnelStep } from '@/types/funnel'
import { Card } from '@/components/ui/card'
import {
  MessageSquare,
  MousePointerClick,
  GitBranch,
  CalendarClock,
  Zap,
  Edit2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  step: FunnelStep
  onEdit: () => void
  onDragStart: () => void
  onPortDown: (stepId: string, isOutput: boolean, optionId?: string) => void
  onPortUp: (stepId: string) => void
  onDelete: () => void
}

export function FlowNode({ step, onEdit, onDragStart, onPortDown, onPortUp, onDelete }: Props) {
  const getIcon = () => {
    switch (step.type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-yellow-500" />
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'input':
        return <MousePointerClick className="w-4 h-4 text-green-500" />
      case 'logic':
        return <GitBranch className="w-4 h-4 text-purple-500" />
      case 'appointment':
        return <CalendarClock className="w-4 h-4 text-orange-500" />
      default:
        return null
    }
  }

  const isTrigger = step.type === 'trigger'

  return (
    <div
      className="flow-node absolute w-[280px] pointer-events-auto shadow-xl transition-shadow hover:shadow-2xl font-sans"
      style={{ left: step.position.x, top: step.position.y }}
    >
      {!isTrigger && (
        <div
          className="absolute -left-3 top-[28px] w-6 h-6 bg-[var(--av-surface)] border-2 border-[var(--av-border)] rounded-full cursor-crosshair flex items-center justify-center hover:border-[var(--av-accent)] z-20"
          onPointerDown={(e) => {
            e.stopPropagation()
            onPortDown(step.id, false)
          }}
          onPointerUp={(e) => {
            e.stopPropagation()
            onPortUp(step.id)
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[var(--av-text-secondary)] pointer-events-none" />
        </div>
      )}

      <Card className="border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)] rounded-xl overflow-hidden flex flex-col">
        <div
          className="h-14 border-b border-[var(--av-border)] bg-black/40 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            e.stopPropagation()
            onDragStart()
          }}
        >
          <div className="flex items-center gap-2 font-medium text-sm">
            {getIcon()}
            <span className="capitalize">{step.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--av-text-secondary)] hover:text-white"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            {!isTrigger && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 text-xs text-[var(--av-text-secondary)] line-clamp-3 min-h-[60px]">
          {step.mentorMessage || (isTrigger ? 'Ponto de entrada do Funil' : 'Sem mensagem')}
        </div>

        {step.inputType === 'select' && step.options && (
          <div className="flex flex-col border-t border-[var(--av-border)] bg-black/20">
            {step.options.map((opt) => (
              <div
                key={opt.id}
                className="relative p-2 px-4 border-b border-[var(--av-border)]/50 text-xs flex justify-between items-center h-10"
              >
                <span>{opt.label}</span>
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--av-surface)] border-2 border-[var(--av-border)] rounded-full cursor-crosshair flex items-center justify-center hover:border-[var(--av-accent)] z-20"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    onPortDown(step.id, true, opt.id)
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--av-accent)] pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {(step.inputType !== 'select' || !step.options) && (
        <div
          className="absolute -right-3 top-[28px] w-6 h-6 bg-[var(--av-surface)] border-2 border-[var(--av-border)] rounded-full cursor-crosshair flex items-center justify-center hover:border-[var(--av-accent)] z-20"
          onPointerDown={(e) => {
            e.stopPropagation()
            onPortDown(step.id, true)
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[var(--av-accent)] pointer-events-none" />
        </div>
      )}
    </div>
  )
}
