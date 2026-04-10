import { useState } from 'react'
import { useFunnel } from '@/stores/FunnelContext'
import { FunnelStep } from '@/types/funnel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from 'lucide-react'
import { StepEditSheet } from './StepEditSheet'
import { Badge } from '@/components/ui/badge'

export function TabSteps() {
  const { steps, setSteps } = useFunnel()
  const [editingStep, setEditingStep] = useState<FunnelStep | null>(null)

  const moveStep = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= steps.length) return
    const newSteps = [...steps]
    const temp = newSteps[idx]
    newSteps[idx] = newSteps[idx + dir]
    newSteps[idx + dir] = temp
    newSteps.forEach((s, i) => (s.order = i + 1))
    setSteps(newSteps)
  }

  const handleDelete = (id: string) => {
    if (confirm('Remover esta etapa?')) {
      const newSteps = steps.filter((s) => s.id !== id)
      newSteps.forEach((s, i) => (s.order = i + 1))
      setSteps(newSteps)
    }
  }

  const handleSaveStep = (updated: FunnelStep) => {
    setSteps(steps.map((s) => (s.id === updated.id ? updated : s)))
  }

  const addNewStep = () => {
    const newStep: FunnelStep = {
      id: Date.now().toString(),
      order: steps.length + 1,
      mentorMessage: 'Nova etapa...',
      inputType: 'text',
      variableName: 'var' + steps.length,
      required: true,
    }
    setSteps([...steps, newStep])
    setEditingStep(newStep)
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Etapas do Funil</h2>
          <p className="text-muted-foreground">
            Construa o fluxo de conversa arrastando as etapas.
          </p>
        </div>
        <Button onClick={addNewStep}>
          <Plus className="w-4 h-4 mr-2" /> Nova Etapa
        </Button>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => (
          <Card key={step.id} className="group">
            <div className="flex items-center p-4 gap-4">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0}
                  onClick={() => moveStep(idx, -1)}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === steps.length - 1}
                  onClick={() => moveStep(idx, 1)}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">Etapa {step.order}</span>
                  <Badge variant="outline" className="text-xs font-normal">
                    {step.inputType}
                  </Badge>
                  {step.variableName && (
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      var: {step.variableName}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{step.mentorMessage}</p>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" onClick={() => setEditingStep(step)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(step.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <StepEditSheet
        step={editingStep}
        isOpen={!!editingStep}
        onClose={() => setEditingStep(null)}
        onSave={handleSaveStep}
      />
    </div>
  )
}
