import { useFunnel } from '@/stores/FunnelContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function TabScheduling() {
  const { scheduling, setScheduling } = useFunnel()
  const [newTime, setNewTime] = useState('')

  const toggleDay = (dayIndex: number) => {
    const days = scheduling.availableDays.includes(dayIndex)
      ? scheduling.availableDays.filter((d) => d !== dayIndex)
      : [...scheduling.availableDays, dayIndex].sort()
    setScheduling({ ...scheduling, availableDays: days })
  }

  const addTime = () => {
    if (newTime && !scheduling.timeSlots.includes(newTime)) {
      setScheduling({ ...scheduling, timeSlots: [...scheduling.timeSlots, newTime].sort() })
      setNewTime('')
    }
  }

  const removeTime = (time: string) => {
    setScheduling({ ...scheduling, timeSlots: scheduling.timeSlots.filter((t) => t !== time) })
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Agendamento</CardTitle>
          <CardDescription>
            Defina os dias e horários disponíveis para os leads marcarem reuniões.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-sm font-medium mb-3">Dias da Semana Disponíveis</h3>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day, idx) => (
                <Button
                  key={idx}
                  variant={scheduling.availableDays.includes(idx) ? 'default' : 'outline'}
                  onClick={() => toggleDay(idx)}
                  className="rounded-full"
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Horários Disponíveis</h3>
            <div className="flex gap-2 mb-4">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-32"
              />
              <Button onClick={addTime} variant="secondary">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {scheduling.timeSlots.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum horário cadastrado.</p>
              )}
              {scheduling.timeSlots.map((time) => (
                <div
                  key={time}
                  className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm"
                >
                  <span className="font-medium">{time}</span>
                  <button
                    onClick={() => removeTime(time)}
                    className="text-muted-foreground hover:text-destructive ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
