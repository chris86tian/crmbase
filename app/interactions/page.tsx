import { SiteHeader } from "@/components/layout/site-header";
import { InteractionTable } from "@/components/interactions/interaction-table";

export default function InteractionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interaktionen</h1>
            <p className="text-muted-foreground">
              Verfolgen Sie alle Interaktionen mit Ihren Kontakten
            </p>
          </div>
        </div>
        <InteractionTable />
      </main>
    </div>
  );
}
