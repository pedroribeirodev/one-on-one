import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Enterprise-ready e conforme LGPD
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground text-balance">
              Pare de perder{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                3 horas por semana
              </span>{" "}
              preparando 1:1s
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Ferramenta de 1:1 com IA feita para tech leads. Enterprise-ready,
              conforme LGPD, e aprovada pelo InfoSec.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group bg-transparent"
              >
                <Calendar className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                Agendar Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Porque o Notion está bloqueado na sua empresa.
            </p>
          </div>
          <div className="relative lg:pl-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
                    MS
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    1:1 com Maria Silva
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvedora Sênior - Semanal
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary">
                      IA SUGERIU
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    Discutir progresso na refatoração de autenticação
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <p className="text-sm text-foreground">
                    Crescimento de carreira: Revisar critérios de promoção
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <p className="text-sm text-foreground">
                    Acompanhamento: Preocupações com comunicação do time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
