import { useEffect, useRef, useState } from 'react'
import { useFunnel } from '@/stores/FunnelContext'
import { ChatBubble } from '@/components/funnel/ChatBubble'
import { ChatInputArea } from '@/components/funnel/ChatInputArea'
import { ProgressBar } from '@/components/funnel/ProgressBar'

interface Message {
  id: string
  sender: 'mentor' | 'user'
  text: string
}

export default function Index() {
  const { config, steps } = useFunnel()
  const [messages, setMessages] = useState<Message[]>([])

  const triggerStep = steps.find((s) => s.type === 'trigger')
  const [currentStepId, setCurrentStepId] = useState<string | null>(
    triggerStep?.nextStepId || (steps[0]?.type !== 'trigger' ? steps[0]?.id : null),
  )

  const [isTyping, setIsTyping] = useState(false)
  const [collectedData, setCollectedData] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const [progress, setProgress] = useState(1)

  const scrollRef = useRef<HTMLDivElement>(null)

  const currentStep = steps.find((s) => s.id === currentStepId)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Initialize first message or when step changes
  useEffect(() => {
    if (currentStep && !isTyping) {
      const hasShown = messages.some((m) => m.id === `msg-${currentStep.id}`)
      if (!hasShown && currentStep.mentorMessage) {
        showMentorMessage(currentStep.mentorMessage, currentStep.id)
      } else if (!hasShown && !currentStep.mentorMessage) {
        moveToNextStep()
      }
    }
  }, [currentStepId])

  const showMentorMessage = (template: string, stepId?: string, delay = 600) => {
    setIsTyping(true)
    setTimeout(() => {
      let text = template
      Object.entries(collectedData).forEach(([key, val]) => {
        text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'gi'), val)
      })
      setMessages((prev) => [
        ...prev,
        { id: stepId ? `msg-${stepId}` : Date.now().toString(), sender: 'mentor', text },
      ])
      setIsTyping(false)
    }, delay)
  }

  const moveToNextStep = (forcedNextId?: string, currentVal?: string) => {
    if (!currentStep) return finishFunnel()
    let nextId = forcedNextId || currentStep.nextStepId

    // Check select routing
    if (!forcedNextId && currentStep.inputType === 'select' && currentStep.options) {
      const selectedOpt = currentStep.options.find((o) => o.value === currentVal)
      if (selectedOpt && selectedOpt.targetStepId) {
        nextId = selectedOpt.targetStepId
      }
    }

    if (nextId) {
      setProgress((p) => p + 1)
      setCurrentStepId(nextId)
    } else {
      finishFunnel()
    }
  }

  const handleUserSubmit = (value: string) => {
    if (!currentStep) return
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: value }])

    const newCollected = { ...collectedData, [currentStep.variableName]: value }
    setCollectedData(newCollected)

    setIsTyping(true)
    setTimeout(() => {
      let regionalMsgObj = null

      if (currentStep.inputType === 'phone' && currentStep.regionalMessages?.length) {
        const ddd = value.replace(/\D/g, '').substring(0, 2)
        const dddNum = parseInt(ddd)

        let region = 'Brasil'
        if (dddNum >= 11 && dddNum <= 19) region = 'SP'
        else if ([21, 22, 24].includes(dddNum)) region = 'RJ'
        else if (dddNum >= 71 && dddNum <= 89) region = 'Nordeste'
        else if (dddNum >= 41 && dddNum <= 55) region = 'Sul'

        regionalMsgObj = currentStep.regionalMessages.find((rm) => rm.region === region)
      }

      if (regionalMsgObj) {
        showMentorMessage(regionalMsgObj.message, undefined, 0)
        setTimeout(() => moveToNextStep(undefined, value), 1200)
      } else {
        setIsTyping(false)
        moveToNextStep(undefined, value)
      }
    }, 600)
  }

  const finishFunnel = () => {
    setFinished(true)
    showMentorMessage(config.finalMessage)
    if (config.webhookUrl) {
      // Mock webhook call
      console.log('Sending to webhook:', config.webhookUrl, collectedData)
    }
    if (config.redirectUrl) {
      setTimeout(() => {
        window.location.href = config.redirectUrl
      }, 3000)
    }
  }

  const totalPlayableSteps = steps.filter((s) => s.type !== 'trigger').length

  return (
    <div className="flex flex-col h-full bg-[var(--av-bg)] text-[var(--av-text-primary)] font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full h-[56px] glass-panel z-10 flex items-center justify-between px-4 border-b border-[var(--av-border)] shadow-sm">
        <div className="flex items-center gap-3">
          {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-6 object-contain" />}
        </div>
        <div className="flex-1 px-4 max-w-[400px] mx-auto">
          <ProgressBar
            currentStep={finished ? totalPlayableSteps : progress}
            totalSteps={totalPlayableSteps}
          />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[120px] px-4 scroll-smooth">
        <div className="max-w-[680px] mx-auto flex flex-col justify-end min-h-full">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
          ))}
          {isTyping && <ChatBubble sender="mentor" text="..." isTyping />}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      {!finished && !isTyping && <ChatInputArea step={currentStep} onSubmit={handleUserSubmit} />}
    </div>
  )
}
