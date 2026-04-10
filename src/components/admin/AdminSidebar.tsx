import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Palette, ListOrdered, GitBranch, Calendar, PlayCircle } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useFunnel } from '@/stores/FunnelContext'

const items = [
  { title: 'Configurações', url: 'general', icon: LayoutDashboard },
  { title: 'Identidade Visual', url: 'visual', icon: Palette },
  { title: 'Etapas do Funil', url: 'steps', icon: ListOrdered },
  { title: 'Lógica e Saltos', url: 'logic', icon: GitBranch },
  { title: 'Agendamento', url: 'scheduling', icon: Calendar },
  { title: 'Preview do Funil', url: 'preview', icon: PlayCircle },
]

export function AdminSidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) {
  const { config } = useFunnel()

  return (
    <Sidebar className="border-r border-border dark:bg-[#121212]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-widest text-[10px] mt-4 mb-2 px-4">
            Painel Administrativo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = activeTab === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      onClick={() => onTabChange(item.url)}
                      className={cn(
                        "cursor-pointer transition-all mx-2 rounded-md h-10",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/15 font-medium"
                      )}
                      style={isActive ? { color: config.primaryColor, borderLeft: `3px solid ${config.primaryColor}` } : {}}
                    >
                      <button>
                        <item.icon className="w-4 h-4 mr-2" style={isActive ? { color: config.primaryColor } : {}} />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarSidebar>
  )
}
