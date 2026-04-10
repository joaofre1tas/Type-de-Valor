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
  const { config, steps, logicRules } = useFunnel()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [collectedData, setCollectedData] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const currentStep = steps[currentStepIdx]

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Initialize first message
  useEffect(() => {
    if (messages.length === 0 && currentStep) {
      showMentorMessage(currentStep.mentorMessage)
    }
  }, [currentStepIdx])

  const showMentorMessage = (template: string) => {
    setIsTyping(true)
    setTimeout(() => {
      let text = template
      // Replace variables
      Object.keys(collectedData).forEach((key) => {
        text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), collectedData[key])
      })
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'mentor', text }])
      setIsTyping(false)
    }, 800)
  }

  const handleUserSubmit = (value: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: value }])

    const newCollected = { ...collectedData, [currentStep.variableName]: value }
    setCollectedData(newCollected)

    // Check regional logic
    if (currentStep.inputType === 'phone') {
      const ddd = value.replace(/\D/g, '').substring(0, 2)
      const isSP = ['11', '12', '13', '14', '15', '16', '17', '18', '19'].includes(ddd)
      const isRJ = ['21', '22', '24'].includes(ddd)
      if (isSP || isRJ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'mentor',
              text: isSP
                ? 'Que legal, vejo que é de SP! Temos uma condição especial pra sua região.'
                : 'Maravilha, um carioca! Temos muita atuação no RJ.',
            },
          ])
        }, 1500)
      }
    }

    // Evaluate logic rules
    let nextStepId: string | null = null
    const rule = logicRules.find((r) => r.stepId === currentStep.id && r.value === value)
    if (rule) nextStepId = rule.targetStepId

    setTimeout(() => {
      if (nextStepId) {
        const idx = steps.findIndex((s) => s.id === nextStepId)
        if (idx !== -1) setCurrentStepIdx(idx)
        else finishFunnel()
      } else if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(currentStepIdx + 1)
      } else {
        finishFunnel()
      }
    }, 500)
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

  return (
    <div className="flex flex-col h-full bg-[var(--av-bg)] text-[var(--av-text-primary)]">
      {/* Header */}
      <header className="fixed top-0 w-full h-[64px] glass-panel z-10 flex items-center justify-between px-4 border-b-0 border-[var(--av-border)] shadow-sm">
        <div className="flex items-center gap-3">
          {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-8 object-contain" />}
        </div>
        <div className="flex-1 px-4">
          <ProgressBar
            currentStep={finished ? steps.length : currentStepIdx + 1}
            totalSteps={steps.length}
          />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-[80px] pb-[100px] px-4">
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
