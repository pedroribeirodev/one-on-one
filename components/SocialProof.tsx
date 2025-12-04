export function SocialProof() {
  const companies = ["Nubank", "iFood", "Mercado Livre", "TOTVS", "Locaweb"];

  return (
    <section className="py-12 px-4 border-y border-border bg-accent/30">
      <div className="container mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Usado por tech leads em empresas inovadoras
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
