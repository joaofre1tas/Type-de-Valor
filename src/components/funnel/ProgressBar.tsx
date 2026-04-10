import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100))

  return (
    <div className="w-full flex flex-col gap-1.5 px-4 max-w-[680px] mx-auto">
      <div className="flex justify-end w-full">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--av-text-secondary)]">
          {String(currentStep).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 w-full">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i < currentStep
          const isCurrent = i === currentStep - 1
          return (
            <div key={i} className="flex-1 flex items-center gap-1">
              <div
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-500',
                  isActive ? 'bg-av-gradient shadow-av-glow' : 'bg-[var(--av-border)]',
                )}
                style={isActive ? { backgroundImage: 'var(--av-gradient-cta)' } : {}}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
