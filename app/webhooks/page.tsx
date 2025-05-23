import { SiteHeader } from "@/components/layout/site-header";
import { WebhookTable } from "@/components/webhooks/webhook-table";

export default function WebhooksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
            <p className="text-muted-foreground">
              Konfigurieren Sie Webhooks für die Integration mit n8n und anderen Diensten
            </p>
          </div>
        </div>
        <WebhookTable />
      </main>
    </div>
  );
}
