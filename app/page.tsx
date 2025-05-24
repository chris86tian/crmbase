import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, MailCheck, MousePointerClick, PhoneForwarded, Target, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const howItWorksSteps = [
  {
    icon: <MailCheck className="h-8 w-8 text-primary" />,
    title: "Value-basierte E-Mail-Sequenz",
    description: "Jeder Lead erhält eine individuelle, wertorientierte E-Mail-Strecke. Keine Standard-Floskeln, sondern relevante Impulse und konkrete Lösungen, die wirklich interessieren.",
  },
  {
    icon: <MousePointerClick className="h-8 w-8 text-primary" />,
    title: "Interesse durch Klicks",
    description: "Kein Blindflug mehr: Nur Leads, die durch Link-Klicks echtes Interesse zeigen, gehen in die nächste Runde.",
  },
  {
    icon: <PhoneForwarded className="h-8 w-8 text-primary" />,
    title: "KI-Qualifizierungs-Call",
    description: "Jetzt übernimmt der Auto-Caller. Die Künstliche Intelligenz ruft an, klärt letzte Fragen, beantwortet Einwände – und liefert alle Informationen, die der Lead wirklich braucht. Ziel: Im anschließenden Beratungsgespräch geht’s nicht mehr um das “Ob”, sondern nur noch ums “Wie” und “Wann”.",
  },
];

const advantages = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "100 % Fokus auf kaufbereite Kunden",
    description: "Kein Vertriebsteam, das Leads “warmquatscht”. Sie sprechen nur mit Entscheidern, die wirklich wollen.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Prozess auf Autopilot",
    description: "E-Mail, Klick-Analyse, KI-Call, Beratung – alles aus einer Hand. Kein Chaos, keine Zeitverschwendung.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Messbarer Vertriebserfolg",
    description: "Jeder Schritt wird getrackt und reportet. Sie wissen jederzeit, wo Ihre Leads stehen – und warum sie kaufen.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">bye-bye Callcenter -</span>
            <span className="block text-primary mt-2 sm:mt-4">
              Hallo “SmartQual-Sequence™” von CRM-BASE
            </span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-8 md:max-w-2xl">
            Weg mit Kaltakquise. Willkommen in der Zukunft der Lead-Qualifizierung.
          </p>
          <p className="mt-4 max-w-md mx-auto text-md text-muted-foreground sm:text-lg md:mt-6 md:max-w-2xl">
            Vergiss das klassische Callcenter-Gewurschtel. Mit unserer SmartQual-Sequence™ holen Sie nur noch die heißesten Leads ans Telefon – und das vollautomatisch.
          </p>
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href="/auth"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-primary-foreground text-lg px-8 py-4"
              )}
            >
              Jetzt kostenlos testen <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-card text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Wie funktioniert’s?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <div
                key={step.title}
                className="bg-background p-6 rounded-lg border border-border transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center text-center"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-16 md:py-24 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Die CRM-BASE Vorteile auf einen Blick
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {advantages.map((advantage) => (
              <div
                key={advantage.title}
                className="bg-card p-6 rounded-lg border border-border transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center text-center"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-6">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{advantage.title}</h3>
                <p className="text-muted-foreground text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-card text-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Jetzt Vertrieb neu denken.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            SmartQual-Sequence™ by CRM-BASE – Das ist die Zukunft. Mehr Abschluss, weniger Aufwand. Sind Sie bereit?
          </p>
          <div className="mt-8">
            <Link
              href="/auth"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-primary-foreground text-lg px-8 py-4"
              )}
            >
              Jetzt kostenlos testen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
