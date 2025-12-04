import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function PricingTeaser() {
  return (
    <section
      id="pricing"
      className="py-24 px-4 bg-gradient-to-br from-primary/10 to-accent/10"
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preços simples e transparentes
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sem taxas escondidas. Sem cobrança por desenvolvedor.
          </p>
          <div className="inline-block bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <span className="text-lg text-muted-foreground">A partir de</span>
              <div className="mt-2">
                <span className="text-5xl font-bold text-foreground">R$99</span>
                <span className="text-muted-foreground">/tech lead/mês</span>
              </div>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-green-500" />
                Desenvolvedores ilimitados
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-green-500" />
                Funcionalidades de segurança corporativa
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-green-500" />
                Suporte prioritário
              </li>
            </ul>
            <p className="text-muted-foreground mb-8">
              Agende uma demo para saber mais sobre nossos planos e
              funcionalidades.
            </p>
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Agendar Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
