import { Ban, Clock, FolderOpen } from "lucide-react";

const painPoints = [
  {
    icon: Ban,
    title: "Notion bloqueado pelo InfoSec?",
    description:
      "Somos aprovados para uso enterprise e projetados com princípios de segurança primeiro.",
  },
  {
    icon: FolderOpen,
    title: "Bagunça no Google Docs?",
    description:
      "Pare de procurar em pastas infinitas. Tudo organizado em um só lugar.",
  },
  {
    icon: Clock,
    title: "3 horas preparando docs de promoção?",
    description:
      "Exporte relatórios completos de evolução de carreira em um clique.",
  },
];

export function PainPoints() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Isso soa familiar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Construímos o OneOnOne porque enfrentamos esses problemas também.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="p-8 rounded-2xl bg-gradient-to-br from-card to-accent/30 border border-border backdrop-blur-sm hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-6">
                <point.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {point.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
