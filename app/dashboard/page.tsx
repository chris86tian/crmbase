// Remove SiteHeader import, it's already in the root layout
// import { SiteHeader } from "@/components/layout/site-header";
import { ContactTable } from "@/components/contacts/contact-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    // The SiteHeader is now globally managed by app/layout.tsx
    // The main div for dashboard content starts here
    <div className="flex-1"> {/* Ensure this takes up available space */}
      <main className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kontakte</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Kontakte und sehen Sie deren Interaktionshistorie
            </p>
          </div>
          {/* Add New Contact Button or other actions here if needed */}
        </div>
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-md" />}>
          <ContactTable />
        </Suspense>
      </main>
    </div>
  );
}
