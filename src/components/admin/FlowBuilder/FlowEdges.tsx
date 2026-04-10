import { FunnelStep } from '@/types/funnel'

interface Props {
  steps: FunnelStep[]
  connecting: { stepId: string; optionId?: string } | null
  mousePos: { x: number; y: number }
}

export function FlowEdges({ steps, connecting, mousePos }: Props) {
  const getPortPos = (stepId: string, isOutput: boolean, optionId?: string) => {
    const step = steps.find((s) => s.id === stepId)
    if (!step) return null

    let y = step.position.y + 28

    if (isOutput && optionId && step.options) {
      const optIdx = step.options.findIndex((o) => o.id === optionId)
      if (optIdx !== -1) {
        y = step.position.y + 116 + optIdx * 40 + 20
      }
    }

    return {
      x: step.position.x + (isOutput ? 280 : 0),
      y,
    }
  }

  const createPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = Math.abs(end.x - start.x) * 0.5
    return `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--av-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff4a4a" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {steps.map((step) => {
        const edges = []

        if (step.inputType === 'select' && step.options) {
          step.options.forEach((opt) => {
            if (opt.targetStepId) {
              const start = getPortPos(step.id, true, opt.id)
              const end = getPortPos(opt.targetStepId, false)
              if (start && end) {
                edges.push(
                  <path
                    key={`${step.id}-${opt.id}`}
                    d={createPath(start, end)}
                    fill="none"
                    stroke="url(#edge-gradient)"
                    strokeWidth="3"
                  />,
                )
              }
            }
          })
        } else if (step.nextStepId) {
          const start = getPortPos(step.id, true)
          const end = getPortPos(step.nextStepId, false)
          if (start && end) {
            edges.push(
              <path
                key={`${step.id}-next`}
                d={createPath(start, end)}
                fill="none"
                stroke="url(#edge-gradient)"
                strokeWidth="3"
              />,
            )
          }
        }
        return edges
      })}

      {connecting &&
        (() => {
          const start = getPortPos(connecting.stepId, true, connecting.optionId)
          if (!start) return null
          return (
            <path
              d={createPath(start, mousePos)}
              fill="none"
              stroke="url(#edge-gradient)"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          )
        })()}
    </svg>
  )
}
