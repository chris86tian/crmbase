import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>
          &copy; {new Date().getFullYear()} CRM-BASE. Alle Rechte vorbehalten.
        </div>
        <nav className="flex gap-4 mt-4 md:mt-0">
          <Link href="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
