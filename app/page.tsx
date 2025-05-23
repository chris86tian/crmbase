import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Zap, Users, PhoneCall, BarChart3, Settings2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Auto-Caller",
    description: "Automatisieren Sie Ihre Anrufe und erreichen Sie mehr Kunden in kürzerer Zeit.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Kontaktmanagement",
    description: "Verwalten Sie alle Ihre Kundenkontakte zentral und übersichtlich.",
  },
  {
    icon: <PhoneCall className="h-6 w-6 text-primary" />,
    title: "Interaktions-Tracking",
    description: "Protokollieren Sie jede Interaktion und behalten Sie den Überblick.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Reporting & Analytics",
    description: "Erhalten Sie wertvolle Einblicke durch detaillierte Berichte und Analysen.",
  },
  {
    icon: <Settings2 className="h-6 w-6 text-primary" />,
    title: "Anpassbare Workflows",
    description: "Passen Sie das System an Ihre spezifischen Vertriebsprozesse an.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Sicher & Zuverlässig",
    description: "Ihre Daten sind bei uns sicher und jederzeit verfügbar.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Bye-bye Callcenter –</span>
            <span className="block text-primary mt-2 sm:mt-4">
              Hallo AUTO-CALLER von CRM-BASE
            </span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-8 md:max-w-2xl">
            Revolutionieren Sie Ihre Kundenkommunikation mit unserem intelligenten CRM-System. Mehr Effizienz, bessere Ergebnisse.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/auth"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-primary-foreground"
              )}
            >
              Jetzt starten <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-primary border-primary hover:bg-primary/10"
              )}
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-card text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Funktionen, die begeistern
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Entdecken Sie, wie CRM-BASE Ihren Vertriebsalltag vereinfachen und optimieren kann.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-6 rounded-lg border border-border transition-colors hover:border-primary/50"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-md bg-primary/10 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bereit, Ihren Vertrieb zu transformieren?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Melden Sie sich jetzt an und erleben Sie die Zukunft der Kundenkommunikation mit CRM-BASE.
          </p>
          <div className="mt-8">
            <Link
              href="/auth"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-primary-foreground"
              )}
            >
              Kostenlos registrieren
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer is now handled by SiteFooter in layout.tsx */}
    </div>
  );
}
