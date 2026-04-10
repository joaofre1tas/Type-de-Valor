import { useFunnel } from '@/stores/FunnelContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatBubble } from '../funnel/ChatBubble'

export function TabVisual() {
  const { config, setConfig } = useFunnel()

  const handleFile =
    (field: 'logoUrl' | 'mentorAvatarUrl') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => setConfig({ ...config, [field]: reader.result as string })
        reader.readAsDataURL(file)
      }
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Personalize as cores e imagens do funil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo da Empresa</Label>
              <Input type="file" accept="image/*" onChange={handleFile('logoUrl')} />
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  className="h-10 mt-2 object-contain bg-muted p-1 rounded"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Avatar do Mentor</Label>
              <Input type="file" accept="image/*" onChange={handleFile('mentorAvatarUrl')} />
              {config.mentorAvatarUrl && (
                <img
                  src={config.mentorAvatarUrl}
                  className="h-12 w-12 mt-2 rounded-full object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cor Primária (Accent)</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor de Fundo (Bg)</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1"
                    value={config.bgColor}
                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                  />
                  <Input
                    value={config.bgColor}
                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor dos Cards (Surface)</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1"
                    value={config.surfaceColor}
                    onChange={(e) => setConfig({ ...config, surfaceColor: e.target.value })}
                  />
                  <Input
                    value={config.surfaceColor}
                    onChange={(e) => setConfig({ ...config, surfaceColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Pane */}
      <div
        className="relative rounded-xl overflow-hidden border shadow-lg h-[600px] flex flex-col font-sans"
        style={
          {
            backgroundColor: config.bgColor,
            color: '#f4f4f4',
            '--av-surface': config.surfaceColor,
            '--av-border': '#333',
            '--av-text-secondary': '#c1c1c1',
          } as any
        }
      >
        <div
          className="h-14 border-b border-[var(--av-border)] flex items-center px-4"
          style={{ backgroundColor: 'rgba(26,26,26,0.7)' }}
        >
          {config.logoUrl && <img src={config.logoUrl} className="h-6" />}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-end">
          <ChatBubble
            sender="mentor"
            text="Olá! Este é um exemplo de como sua identidade visual se comportará."
          />
          <ChatBubble sender="user" text="Incrível! As cores estão ótimas." />
        </div>
        <div
          className="p-4 border-t border-[var(--av-border)]"
          style={{ backgroundColor: 'rgba(26,26,26,0.7)' }}
        >
          <div
            className="h-12 rounded-md flex items-center px-4 opacity-50"
            style={{ backgroundColor: config.surfaceColor, border: '1px solid var(--av-border)' }}
          >
            Digite aqui...
          </div>
        </div>
      </div>
    </div>
  )
}
