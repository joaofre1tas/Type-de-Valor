import { useFunnel } from '@/stores/FunnelContext'
import { LogicRule } from '@/types/funnel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'

export function TabLogic() {
  const { logicRules, setLogicRules, steps } = useFunnel()

  const addRule = () => {
    setLogicRules([
      ...logicRules,
      {
        id: Date.now().toString(),
        stepId: steps[0]?.id || '',
        variableName: steps[0]?.variableName || '',
        condition: 'equals',
        value: '',
        targetStepId: steps[1]?.id || '',
      },
    ])
  }

  const updateRule = (id: string, data: Partial<LogicRule>) => {
    setLogicRules(logicRules.map((r) => (r.id === id ? { ...r, ...data } : r)))
  }

  const removeRule = (id: string) => {
    setLogicRules(logicRules.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in-up">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lógica e Saltos</CardTitle>
              <CardDescription>Crie ramificações com base nas respostas dos leads.</CardDescription>
            </div>
            <Button onClick={addRule} size="sm">
              <Plus className="w-4 h-4 mr-2" /> Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {logicRules.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              Nenhuma regra definida. O funil seguirá a ordem padrão.
            </div>
          ) : (
            logicRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
              >
                <span className="text-sm font-medium">Se na etapa</span>
                <Select
                  value={rule.stepId}
                  onValueChange={(v) => {
                    const st = steps.find((s) => s.id === v)
                    updateRule(rule.id, { stepId: v, variableName: st?.variableName || '' })
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.order}. {s.variableName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm font-medium">a resposta for igual a</span>

                <Select value={rule.value} onValueChange={(v) => updateRule(rule.id, { value: v })}>
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Valor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {steps
                      .find((s) => s.id === rule.stepId)
                      ?.options?.map((opt) => (
                        <SelectItem key={opt.id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      )) || (
                      <SelectItem value="custom" disabled>
                        Apenas campos "Select" suportados no momento
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <span className="text-sm font-medium">pular para</span>

                <Select
                  value={rule.targetStepId}
                  onValueChange={(v) => updateRule(rule.id, { targetStepId: v })}
                >
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        Etapa {s.order}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(rule.id)}
                  className="ml-auto text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
