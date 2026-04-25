import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacto — disponible para proyectos y colaboraciones.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-sand">
      <Navbar />
      <section className="max-w-2xl mx-auto px-8 md:px-16 pt-32 pb-24">

        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
            Contacto
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink">
            Hablemos
          </h1>
        </div>

        <p className="font-body text-ink-muted leading-relaxed mb-12">
          Disponible para proyectos, colaboraciones y residencias artísticas.
          Si tienes una idea o quieres trabajar juntos, escríbeme.
        </p>

        <a
          href="mailto:laurasalazarh@gmail.com"
          className="group inline-flex items-center gap-3 font-display font-light text-2xl text-ink hover:text-cosmos transition-colors"
        >
          laurasalazarh@gmail.com
          <span className="text-ink-muted group-hover:text-cosmos group-hover:translate-x-1 transition-all">
            →
          </span>
        </a>

        <div className="mt-16 pt-10 border-t border-ink-border">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-2">
            Ubicación
          </p>
          <p className="font-body text-ink-muted">
            Medellín, Colombia — disponible para proyectos remotos
          </p>
        </div>

      </section>
    </main>
  );
}