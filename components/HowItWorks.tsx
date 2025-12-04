import { MessageSquare, UserPlus, Wand2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Adicione seus desenvolvedores",
    description:
      "Importe seu time ou adicione manualmente. Setup leva menos de 2 minutos.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Registre 1:1s em 2 minutos",
    description:
      "Capture rapidamente pontos-chave, ações e acompanhamentos após cada reunião.",
  },
  {
    number: "03",
    icon: Wand2,
    title: "IA prepara sua próxima reunião",
    description:
      "Receba agendas geradas automaticamente baseadas em conversas anteriores e itens pendentes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-accent/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece em minutos, não dias. Nenhuma configuração complexa
            necessária.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-card border border-border mb-6 relative">
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-primary bg-accent px-2 py-1 rounded-full border border-border">
                    {step.number}
                  </span>
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
