import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              1:1
            </span>
          </div>
          <span className="font-semibold text-xl text-foreground">
            OneOnOne
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Funcionalidades
          </a>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Preços
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Entrar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Começar Gratuitamente
          </Button>
        </div>
      </div>
    </header>
  );
}
