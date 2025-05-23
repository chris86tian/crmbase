import { SiteHeader } from "@/components/layout/site-header";
import { ContactTable } from "@/components/contacts/contact-table";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kontakte</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Kontakte und sehen Sie deren Interaktionshistorie
            </p>
          </div>
        </div>
        <ContactTable />
      </main>
    </div>
  );
}
