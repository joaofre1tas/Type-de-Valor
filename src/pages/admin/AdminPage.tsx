import { useState } from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { TabGeneral } from '@/components/admin/TabGeneral'
import { TabVisual } from '@/components/admin/TabVisual'
import { TabFlowBuilder } from '@/components/admin/FlowBuilder/TabFlowBuilder'
import { TabLogic } from '@/components/admin/TabLogic'
import { TabScheduling } from '@/components/admin/TabScheduling'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('general')

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return <TabGeneral />
      case 'visual':
        return <TabVisual />
      case 'steps':
        return <TabFlowBuilder />
      case 'logic':
        return <TabLogic />
      case 'scheduling':
        return <TabScheduling />
      case 'preview':
        return (
          <div className="h-[800px] w-full max-w-[400px] mx-auto border-[8px] border-black rounded-[40px] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 w-full h-6 bg-black z-20 flex justify-center">
              <div className="w-1/3 h-full bg-black rounded-b-xl"></div>
            </div>
            <iframe src="/" className="w-full h-full bg-background" />
          </div>
        )
      default:
        return <TabGeneral />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background dark:bg-background">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <SidebarInset className="flex flex-col flex-1 bg-muted/20">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="font-semibold ml-2">Agência de Valor - Setup</h1>
            <div className="ml-auto">
              <Button variant="outline" size="sm" asChild>
                <a href="/" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" /> Ver Funil
                </a>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 overflow-y-auto">{renderTab()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
