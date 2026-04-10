import { useFunnel } from '@/stores/FunnelContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TabGeneral() {
  const { config, setConfig } = useFunnel()

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Defina os parâmetros principais do seu funil conversacional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Funil</Label>
            <Input
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>URL de Redirecionamento (Opcional)</Label>
            <Input
              placeholder="https://sua-agencia.com.br/obrigado"
              value={config.redirectUrl}
              onChange={(e) => setConfig({ ...config, redirectUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Para onde enviar o lead após o agendamento.
            </p>
          </div>

          <div className="space-y-2">
            <Label>URL do Webhook (Opcional)</Label>
            <Input
              placeholder="https://hooks.zapier.com/..."
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Disparado no final do funil com os dados do lead.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Mensagem Final de Sucesso</Label>
            <Textarea
              rows={3}
              value={config.finalMessage}
              onChange={(e) => setConfig({ ...config, finalMessage: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
