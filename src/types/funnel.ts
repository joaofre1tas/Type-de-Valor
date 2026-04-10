export type InputType = 'text' | 'phone' | 'email' | 'select' | 'calendar' | 'none'

export interface StepOption {
  id: string
  label: string
  value: string
}

export interface FunnelStep {
  id: string
  order: number
  mentorMessage: string
  inputType: InputType
  variableName: string
  required: boolean
  options?: StepOption[]
}

export interface LogicRule {
  id: string
  stepId: string
  variableName: string
  condition: 'equals'
  value: string
  targetStepId: string
}

export interface FunnelConfig {
  name: string
  redirectUrl: string
  webhookUrl: string
  finalMessage: string
  logoUrl: string
  mentorAvatarUrl: string
  primaryColor: string
  bgColor: string
  surfaceColor: string
}

export interface SchedulingConfig {
  availableDays: number[] // 0 = Sun, 1 = Mon...
  timeSlots: string[]
}
