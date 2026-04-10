import React, { createContext, useContext, useEffect, useState } from 'react'
import { FunnelConfig, FunnelStep, LogicRule, SchedulingConfig } from '@/types/funnel'

const DEFAULT_CONFIG: FunnelConfig = {
  name: 'Diagnóstico Estratégico AV',
  redirectUrl: '',
  webhookUrl: '',
  finalMessage: 'Tudo certo! Recebemos suas informações e entraremos em contato em breve.',
  logoUrl: 'https://img.usecurling.com/i?q=agency&color=orange',
  mentorAvatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  primaryColor: '#FC8338',
  bgColor: '#121212',
  surfaceColor: '#1a1a1a',
}

const DEFAULT_STEPS: FunnelStep[] = [
  {
    id: 's1',
    order: 1,
    mentorMessage: 'Olá! Sou seu mentor. Para começarmos, qual o seu nome?',
    inputType: 'text',
    variableName: 'nome',
    required: true,
  },
  {
    id: 's2',
    order: 2,
    mentorMessage: 'Muito prazer, {{nome}}! Qual o seu melhor WhatsApp?',
    inputType: 'phone',
    variableName: 'telefone',
    required: true,
  },
  {
    id: 's3',
    order: 3,
    mentorMessage: 'E qual é a sua cidade?',
    inputType: 'text',
    variableName: 'cidade',
    required: true,
  },
  {
    id: 's4',
    order: 4,
    mentorMessage: 'Pode me passar o seu e-mail profissional?',
    inputType: 'email',
    variableName: 'email',
    required: true,
  },
  {
    id: 's5',
    order: 5,
    mentorMessage: 'Qual o nome da sua empresa?',
    inputType: 'text',
    variableName: 'empresa',
    required: true,
  },
  {
    id: 's6',
    order: 6,
    mentorMessage: 'Qual o seu cargo atual na {{empresa}}?',
    inputType: 'select',
    variableName: 'cargo',
    required: true,
    options: [
      { id: 'o1', label: 'Fundador/CEO', value: 'Founder' },
      { id: 'o2', label: 'Diretor', value: 'Diretor' },
      { id: 'o3', label: 'Gerente', value: 'Gerente' },
      { id: 'o4', label: 'Outro', value: 'Outro' },
    ],
  },
  {
    id: 's7',
    order: 7,
    mentorMessage: 'Ótimo! Vamos agendar nossa reunião de diagnóstico. Escolha um horário:',
    inputType: 'calendar',
    variableName: 'agendamento',
    required: true,
  },
]

const DEFAULT_SCHEDULING: SchedulingConfig = {
  availableDays: [1, 2, 3, 4, 5],
  timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
}

interface FunnelContextType {
  config: FunnelConfig
  setConfig: (c: FunnelConfig) => void
  steps: FunnelStep[]
  setSteps: (s: FunnelStep[]) => void
  logicRules: LogicRule[]
  setLogicRules: (r: LogicRule[]) => void
  scheduling: SchedulingConfig
  setScheduling: (s: SchedulingConfig) => void
  resetData: () => void
}

const FunnelContext = createContext<FunnelContextType | null>(null)

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<FunnelConfig>(DEFAULT_CONFIG)
  const [steps, setStepsState] = useState<FunnelStep[]>(DEFAULT_STEPS)
  const [logicRules, setLogicRulesState] = useState<LogicRule[]>([])
  const [scheduling, setSchedulingState] = useState<SchedulingConfig>(DEFAULT_SCHEDULING)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem('av_config')
    const savedSteps = localStorage.getItem('av_steps')
    const savedRules = localStorage.getItem('av_rules')
    const savedSched = localStorage.getItem('av_scheduling')

    if (savedConfig) setConfigState(JSON.parse(savedConfig))
    if (savedSteps) setStepsState(JSON.parse(savedSteps))
    if (savedRules) setLogicRulesState(JSON.parse(savedRules))
    if (savedSched) setSchedulingState(JSON.parse(savedSched))
    setIsLoaded(true)
  }, [])

  const setConfig = (c: FunnelConfig) => {
    setConfigState(c)
    localStorage.setItem('av_config', JSON.stringify(c))
  }
  const setSteps = (s: FunnelStep[]) => {
    setStepsState(s)
    localStorage.setItem('av_steps', JSON.stringify(s))
  }
  const setLogicRules = (r: LogicRule[]) => {
    setLogicRulesState(r)
    localStorage.setItem('av_rules', JSON.stringify(r))
  }
  const setScheduling = (s: SchedulingConfig) => {
    setSchedulingState(s)
    localStorage.setItem('av_scheduling', JSON.stringify(s))
  }

  const resetData = () => {
    setConfig(DEFAULT_CONFIG)
    setSteps(DEFAULT_STEPS)
    setLogicRules([])
    setScheduling(DEFAULT_SCHEDULING)
  }

  if (!isLoaded) return null

  return (
    <FunnelContext.Provider
      value={{
        config,
        setConfig,
        steps,
        setSteps,
        logicRules,
        setLogicRules,
        scheduling,
        setScheduling,
        resetData,
      }}
    >
      {children}
    </FunnelContext.Provider>
  )
}

export const useFunnel = () => {
  const context = useContext(FunnelContext)
  if (!context) throw new Error('useFunnel must be used within FunnelProvider')
  return context
}
