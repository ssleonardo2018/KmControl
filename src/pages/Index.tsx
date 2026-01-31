import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, Gauge, Fuel, FileText, Shield, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] rounded-full bg-primary blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Navigation */}
          <nav className="container mx-auto flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
                <Bus className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  FleetControl
                </h1>
                <p className="text-xs text-white/60">Gestão de Frota</p>
              </div>
            </div>
            <Button asChild variant="secondary">
              <Link to="/auth">
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="container mx-auto px-6 py-20 text-center lg:py-32">
            <div className="mx-auto max-w-3xl animate-slide-up">
              <h2 className="font-display text-4xl font-bold text-white lg:text-6xl">
                Controle completo da sua{" "}
                <span className="text-gradient-primary bg-gradient-accent bg-clip-text text-transparent">
                  frota escolar
                </span>
              </h2>
              <p className="mt-6 text-lg text-white/70 lg:text-xl">
                Sistema moderno para registro de quilometragem, abastecimento e
                geração de relatórios. Simplifique a gestão dos seus ônibus
                escolares e universitários.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-accent hover:opacity-90"
                >
                  <Link to="/auth">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/auth">Fazer login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="font-display text-3xl font-bold lg:text-4xl">
              Tudo que você precisa para gerenciar sua frota
            </h3>
            <p className="mt-4 text-muted-foreground">
              Funcionalidades completas para motoristas, supervisores e
              administradores
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-fleet-lg hover:border-primary/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Gauge className="h-7 w-7" />
              </div>
              <h4 className="mt-4 font-display text-xl font-semibold">
                Quilometragem
              </h4>
              <p className="mt-2 text-muted-foreground">
                Registro diário de KM com cálculo automático da distância
                percorrida.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-fleet-lg hover:border-accent/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Fuel className="h-7 w-7" />
              </div>
              <h4 className="mt-4 font-display text-xl font-semibold">
                Abastecimento
              </h4>
              <p className="mt-2 text-muted-foreground">
                Controle de diesel e arla com upload de fotos do comprovante.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-fleet-lg hover:border-success/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-success transition-colors group-hover:bg-success group-hover:text-success-foreground">
                <FileText className="h-7 w-7" />
              </div>
              <h4 className="mt-4 font-display text-xl font-semibold">
                Relatórios
              </h4>
              <p className="mt-2 text-muted-foreground">
                Relatórios mensais detalhados com exportação em PDF e Excel.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-fleet-lg hover:border-warning/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10 text-warning transition-colors group-hover:bg-warning group-hover:text-warning-foreground">
                <Shield className="h-7 w-7" />
              </div>
              <h4 className="mt-4 font-display text-xl font-semibold">
                Segurança
              </h4>
              <p className="mt-2 text-muted-foreground">
                Acesso controlado por perfis: motorista, supervisor e
                administrador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-dark py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="font-display text-3xl font-bold text-white lg:text-4xl">
              Pronto para começar?
            </h3>
            <p className="mt-4 text-white/70">
              Crie sua conta gratuitamente e comece a gerenciar sua frota de
              forma eficiente.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-gradient-accent hover:opacity-90"
            >
              <Link to="/auth">
                Criar conta grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Bus className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">FleetControl</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            © {new Date().getFullYear()} FleetControl. Sistema de Gestão de
            Frota Escolar.
          </p>
        </div>
      </footer>
    </div>
  );
}
