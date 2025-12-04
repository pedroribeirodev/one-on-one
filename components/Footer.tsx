export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border bg-card">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Segurança
            </a>
            <a
              href="mailto:oi@oneonone.dev"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              oi@oneonone.dev
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">
            © 2025 OneOnOne. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
