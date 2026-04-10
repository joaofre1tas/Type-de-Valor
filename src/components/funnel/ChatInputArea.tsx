import { useState } from 'react'
import { FunnelStep } from '@/types/funnel'
import { useFunnel } from '@/stores/FunnelContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface ChatInputAreaProps {
  step?: FunnelStep
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function ChatInputArea({ step, onSubmit, disabled }: ChatInputAreaProps) {
  const { scheduling } = useFunnel()
  const [val, setVal] = useState('')
  const [date, setDate] = useState<Date>()

  if (!step || step.inputType === 'none') return null

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!val && !date) return
    onSubmit(val || (date ? format(date, 'dd/MM/yyyy') + (val ? ` às ${val}` : '') : ''))
    setVal('')
    setDate(undefined)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`
    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`
    setVal(v)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 glass-panel z-10 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-[680px] flex gap-2 items-end">
        {(step.inputType === 'text' || step.inputType === 'email') && (
          <Input
            type={step.inputType}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={`Digite seu ${step.variableName}...`}
            className="h-12 bg-[var(--av-surface)] border-[var(--av-border)] text-white placeholder:text-[var(--av-text-secondary)] focus-visible:ring-[var(--av-accent)] rounded-av"
            disabled={disabled}
            required={step.required}
          />
        )}

        {step.inputType === 'phone' && (
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-[var(--av-text-secondary)]">🇧🇷 +55</span>
            <Input
              type="tel"
              value={val}
              onChange={handlePhoneChange}
              placeholder="(XX) XXXXX-XXXX"
              className="h-12 pl-16 bg-[var(--av-surface)] border-[var(--av-border)] text-white focus-visible:ring-[var(--av-accent)] rounded-av"
              disabled={disabled}
              required={step.required}
            />
          </div>
        )}

        {step.inputType === 'select' && (
          <Select
            onValueChange={(v) => {
              setVal(v)
              onSubmit(v)
              setVal('')
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-12 bg-[var(--av-surface)] border-[var(--av-border)] text-white focus:ring-[var(--av-accent)] rounded-av">
              <SelectValue placeholder="Selecione uma opção..." />
            </SelectTrigger>
            <SelectContent className="bg-[var(--av-surface)] border-[var(--av-border)] text-white">
              {step.options?.map((opt) => (
                <SelectItem
                  key={opt.id}
                  value={opt.value}
                  className="focus:bg-[var(--av-wm-fill)] focus:text-[var(--av-accent)] cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {step.inputType === 'calendar' && (
          <div className="flex flex-col gap-2 w-full bg-[var(--av-surface)] p-4 rounded-xl border border-[var(--av-border)]">
            <div className="flex gap-4 flex-col sm:flex-row">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return d < today || !scheduling.availableDays.includes(d.getDay())
                }}
                className="rounded-md border border-[var(--av-border)] text-white bg-transparent pointer-events-auto"
                classNames={{
                  day_selected:
                    'bg-av-gradient text-white hover:bg-av-gradient focus:bg-av-gradient',
                  day_today: 'bg-[var(--av-wm-fill)] text-white',
                }}
              />
              {date && (
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-sm font-medium text-[var(--av-text-secondary)]">
                    Horários para {format(date, 'dd/MM')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {scheduling.timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={val === time ? 'default' : 'outline'}
                        className={cn(
                          'h-10 border-[var(--av-border)] text-white hover:text-white hover:bg-[var(--av-wm-fill)]',
                          val === time ? 'bg-av-gradient border-transparent' : 'bg-transparent',
                        )}
                        onClick={() => setVal(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!date || !val}
              className="w-full mt-2 h-12 bg-av-gradient text-white rounded-av hover:shadow-av-glow transition-all"
              style={{ backgroundImage: 'var(--av-gradient-cta)' }}
            >
              Confirmar Agendamento <CalendarIcon className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {step.inputType !== 'select' && step.inputType !== 'calendar' && (
          <Button
            type="submit"
            disabled={disabled || !val}
            className="h-12 w-12 px-0 shrink-0 bg-av-gradient text-white rounded-av hover:shadow-av-glow transition-all disabled:opacity-50"
            style={{ backgroundImage: 'var(--av-gradient-cta)' }}
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </form>
    </div>
  )
}
