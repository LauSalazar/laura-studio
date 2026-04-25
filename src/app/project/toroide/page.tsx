import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toroide errante",
  description: "Toroide 3D proyectado en perspectiva que se mueve aleatoriamente por el canvas.",
};

const TorusSketch = dynamic(
  () => import("@/components/sketches/TorusSketch").then((m) => m.TorusSketch),
  { ssr: false, loading: () => <div className="w-full h-full bg-white" /> }
);

export default function ToroidePage() {
  return (
    <main className="min-h-screen bg-sand">
      <Navbar />

      <section className="max-w-4xl mx-auto px-8 md:px-16 pt-32 pb-24">

        {/* Título */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-3">
            3D / WebGL — 2026
          </p>
          <h1 className="font-display font-light text-4xl md:text-5xl text-ink">
            Toroide errante
          </h1>
        </div>

        {/* Canvas con marco */}
        <div className="w-full rounded-2xl border border-ink-border bg-white overflow-hidden shadow-sm mb-16"
          style={{ height: "520px" }}>
          <TorusSketch />
        </div>

        {/* Ficha del proyecto */}
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Descripción
            </p>
            <p className="font-body text-ink-muted leading-relaxed">
              Un toroide matemático proyectado en perspectiva simple, dibujado con p5.js.
              La forma se construye calculando dos familias de curvas — meridianos y paralelos —
              usando la fórmula paramétrica del toroide. El brillo de cada línea varía según
              su profundidad en Z, dando sensación de volumen sin WebGL.
            </p>
            <p className="font-body text-ink-muted leading-relaxed mt-4">
              El objeto rebota en los bordes con pequeñas variaciones aleatorias
              en cada rebote, garantizando que nunca repita exactamente el mismo camino.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Ficha técnica
            </p>
            <div className="space-y-3">
              {[
                { label: "Categoría", value: "3D / WebGL" },
                { label: "Tecnología", value: "p5.js" },
                { label: "Año", value: "2026" },
                { label: "Tipo", value: "Interactivo" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-ink-border pb-3">
                  <span className="font-mono text-xs text-ink-muted uppercase tracking-wide">{label}</span>
                  <span className="font-body text-sm text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}