import { Outlet, useLocation } from 'react-router-dom'
import { useFunnel } from '@/stores/FunnelContext'
import { cn } from '@/lib/utils'

export default function Layout() {
  const { config } = useFunnel()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <main
      className={cn(
        'flex flex-col min-h-screen transition-colors duration-500',
        !isAdmin && 'dark',
      )}
      style={
        !isAdmin
          ? ({
              '--av-bg': config.bgColor,
              '--av-surface': config.surfaceColor,
              '--av-accent': config.primaryColor,
            } as React.CSSProperties)
          : {}
      }
    >
      {/* If not admin, apply the custom AV dark theme globally */}
      <div
        className={cn(
          'flex-1 flex flex-col',
          !isAdmin && 'bg-[var(--av-bg)] text-[var(--av-text-primary)] font-sans',
        )}
      >
        <Outlet />
      </div>
    </main>
  )
}
