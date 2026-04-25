import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Sobre Laura — artista digital y desarrolladora.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-sand">
      <Navbar />
      <section className="max-w-2xl mx-auto px-8 md:px-16 pt-32 pb-24">

        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
            Sobre mí
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink">
            Laura
          </h1>
        </div>

        <div className="space-y-6 font-body text-ink-muted leading-relaxed">
          <p>
            Artista digital y desarrolladora basada en Medellín, Colombia.
            Exploro la intersección entre geometría, naturaleza y código.
          </p>
          <p>
            Estoy construyendo mi estilo personal a través de arte generativo,
            experimentos 3D y contenido digital. Cada proyecto es una
            investigación visual — una forma de entender el mundo a través
            de sistemas, formas y movimiento.
          </p>
          <p>
            Mi trabajo abarca arte generativo, proyectos 3D, experimentos
            con cámara, instalaciones digitales y juegos. Siempre explorando,
            siempre aprendiendo.
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-ink-border">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6">
            Herramientas
          </p>
          <div className="flex flex-wrap gap-2">
            {["p5.js", "Three.js", "React Three Fiber", "WebGL", "Next.js", "GLSL"].map((tool) => (
              <span
                key={tool}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-ink-border text-ink-muted"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}