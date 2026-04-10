import { useState, useRef } from 'react'
import { useFunnel } from '@/stores/FunnelContext'
import { FunnelStep } from '@/types/funnel'
import { FlowNode } from './FlowNode'
import { FlowEdges } from './FlowEdges'
import { StepEditSheet } from '../StepEditSheet'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function TabFlowBuilder() {
  const { steps, setSteps } = useFunnel()
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.8)
  const [isPanning, setIsPanning] = useState(false)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)

  const [connecting, setConnecting] = useState<{ stepId: string; optionId?: string } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const [editingStep, setEditingStep] = useState<FunnelStep | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.005, 0.2), 2))
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.flow-node')) return
    setIsPanning(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }))
    } else if (draggingNode) {
      setSteps(
        steps.map((s) =>
          s.id === draggingNode
            ? {
                ...s,
                position: {
                  x: s.position.x + e.movementX / zoom,
                  y: s.position.y + e.movementY / zoom,
                },
              }
            : s,
        ),
      )
    }

    if (connecting && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false)
    setDraggingNode(null)
    setConnecting(null)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const handlePortDown = (stepId: string, isOutput: boolean, optionId?: string) => {
    if (isOutput) setConnecting({ stepId, optionId })
  }

  const handlePortUp = (stepId: string) => {
    if (connecting && connecting.stepId !== stepId) {
      setSteps(
        steps.map((s) => {
          if (s.id === connecting.stepId) {
            if (connecting.optionId && s.options) {
              return {
                ...s,
                options: s.options.map((o) =>
                  o.id === connecting.optionId ? { ...o, targetStepId: stepId } : o,
                ),
              }
            }
            return { ...s, nextStepId: stepId }
          }
          return s
        }),
      )
    }
    setConnecting(null)
  }

  const addStep = () => {
    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      type: 'message',
      position: { x: (-pan.x + 300) / zoom, y: (-pan.y + 200) / zoom },
      mentorMessage: 'Nova Mensagem',
      inputType: 'none',
      variableName: '',
      required: false,
    }
    setSteps([...steps, newStep])
    setEditingStep(newStep)
  }

  return (
    <div
      className="relative w-full h-[600px] bg-[var(--av-bg)] overflow-hidden border border-[var(--av-border)] rounded-xl shadow-inner font-sans"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={containerRef}
    >
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          onClick={addStep}
          className="bg-av-gradient shadow-av-glow text-white border-none hover:opacity-90 transition-all rounded-av"
          style={{ backgroundImage: 'var(--av-gradient-cta)' }}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Nó
        </Button>
      </div>

      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="w-full h-full pointer-events-none absolute inset-0"
      >
        <FlowEdges steps={steps} connecting={connecting} mousePos={mousePos} />
        {steps.map((step) => (
          <FlowNode
            key={step.id}
            step={step}
            onEdit={() => setEditingStep(step)}
            onDragStart={() => setDraggingNode(step.id)}
            onPortDown={handlePortDown}
            onPortUp={handlePortUp}
            onDelete={() => setSteps(steps.filter((s) => s.id !== step.id))}
          />
        ))}
      </div>

      <StepEditSheet
        step={editingStep}
        isOpen={!!editingStep}
        onClose={() => setEditingStep(null)}
        onSave={(updated) => {
          setSteps(steps.map((s) => (s.id === updated.id ? updated : s)))
          setEditingStep(null)
        }}
      />
    </div>
  )
}
