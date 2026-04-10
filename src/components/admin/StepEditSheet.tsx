import { useState } from 'react'
import { FunnelStep, InputType } from '@/types/funnel'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  step: FunnelStep | null
  isOpen: boolean
  onClose: () => void
  onSave: (step: FunnelStep) => void
}

export function StepEditSheet({ step, isOpen, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<FunnelStep | null>(null)

  // Sync draft when step changes
  if (step && draft?.id !== step.id && isOpen) {
    setDraft({ ...step })
  }

  if (!draft) return null

  const handleAddVar = (v: string) => {
    setDraft({ ...draft, mentorMessage: draft.mentorMessage + ` {{${v}}}` })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Editar Etapa</SheetTitle>
          <SheetDescription>Configure a mensagem do mentor e a captura do dado.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Mensagem do Mentor</Label>
            <Textarea
              rows={4}
              value={draft.mentorMessage}
              onChange={(e) => setDraft({ ...draft, mentorMessage: e.target.value })}
            />
            <div className="flex gap-2 flex-wrap pt-1">
              <span className="text-xs text-muted-foreground mr-1">Inserir variável:</span>
              {['nome', 'empresa', 'cidade'].map((v) => (
                <button
                  key={v}
                  onClick={() => handleAddVar(v)}
                  className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-primary/20 text-primary"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Variável Salva</Label>
              <Input
                value={draft.variableName}
                onChange={(e) => setDraft({ ...draft, variableName: e.target.value })}
                placeholder="Ex: nome"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Input</Label>
              <Select
                value={draft.inputType}
                onValueChange={(v) => setDraft({ ...draft, inputType: v as InputType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto Curto</SelectItem>
                  <SelectItem value="phone">Telefone (BR)</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="select">Múltipla Escolha</SelectItem>
                  <SelectItem value="calendar">Calendário</SelectItem>
                  <SelectItem value="none">Nenhum (Apenas mensagem)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between border p-3 rounded-lg">
            <div>
              <Label>Campo Obrigatório?</Label>
              <p className="text-xs text-muted-foreground">O usuário não pode pular esta etapa.</p>
            </div>
            <Switch
              checked={draft.required}
              onCheckedChange={(c) => setDraft({ ...draft, required: c })}
            />
          </div>

          {draft.inputType === 'select' && (
            <div className="space-y-3 border p-4 rounded-lg bg-muted/30">
              <Label>Opções de Escolha</Label>
              {draft.options?.map((opt, i) => (
                <div key={opt.id} className="flex gap-2">
                  <Input
                    value={opt.label}
                    onChange={(e) => {
                      const newOpts = [...(draft.options || [])]
                      newOpts[i] = { ...newOpts[i], label: e.target.value, value: e.target.value }
                      setDraft({ ...draft, options: newOpts })
                    }}
                    placeholder="Rótulo"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDraft({ ...draft, options: draft.options?.filter((_, idx) => idx !== i) })
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setDraft({
                    ...draft,
                    options: [
                      ...(draft.options || []),
                      { id: Date.now().toString(), label: 'Nova Opção', value: 'Nova Opção' },
                    ],
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Opção
              </Button>
            </div>
          )}

          <Button
            className="w-full mt-4"
            onClick={() => {
              onSave(draft)
              onClose()
            }}
          >
            Salvar Etapa
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
