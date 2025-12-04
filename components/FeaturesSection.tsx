import { Shield, Sparkles, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Agendas com IA",
    description:
      "Gera automaticamente tópicos de reunião baseado em 1:1s anteriores, economizando horas de preparação.",
  },
  {
    icon: Shield,
    title: "Segurança Enterprise",
    description:
      "SSO, conforme LGPD, audit logs, e privado por padrão. Construído para requisitos corporativos.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento de Carreira",
    description:
      "Exporte relatórios de evolução para promoções em um clique. Documente crescimento ao longo do tempo.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa para 1:1s efetivas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Construído especificamente para tech leads gerenciando
            desenvolvedores em ambientes corporativos.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
