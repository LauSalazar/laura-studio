import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Generativo",
  description: "Dos videos transformados por el mismo sistema generativo con shaders GLSL.",
};

const VideoShader = dynamic(
  () => import("@/components/sketches/VideoShader").then((m) => m.VideoShader),
  { ssr: false, loading: () => <div style={{ width: "100%", aspectRatio: "16/5", background: "#000" }} /> }
);

// ← reemplaza estas URLs con tus videos reales
const VIDEO_1 = "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781139646/LauraUdea_qijjvh.mp4";
const VIDEO_2 = "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781139533/Omnidroid_vrngw2.mp4";

export default function VideoGenerativoPage() {
  return (
    <main className="min-h-screen bg-sand">
      <Navbar />
      <section className="max-w-5xl mx-auto px-8 md:px-16 pt-32 pb-24">

        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-3">
            Arte generativo — 2026
          </p>
          <h1 className="font-display font-light text-4xl md:text-5xl text-ink mb-4">
            Video generativo
          </h1>
          <p className="font-body text-ink-muted max-w-xl leading-relaxed">
            Dos videos procesados por el mismo sistema generativo.
          </p>
        </div>

        {/* Canvas */}
        <div className="w-full rounded-2xl border border-ink-border overflow-hidden mb-16">
          <VideoShader
            video1Url={VIDEO_1}
            video2Url={VIDEO_2}
            label1="video 01"
            label2="video 02"
          />
        </div>

        {/* Ficha técnica */}
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Concepto
            </p>
            <p className="font-body text-ink-muted leading-relaxed">
              Una máquina de interpretación visual que transforma el video original
              mediante color, luz y geometría. El interés no está en el video en sí,
              sino en cómo el sistema generativo reacciona a él — produciendo
              resultados únicos a partir del mismo algoritmo.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
              Ficha técnica
            </p>
            <div className="space-y-3">
              {[
                { label: "Categoría",    value: "Arte generativo" },
                { label: "Tecnología",   value: "Three.js · GLSL" },
                { label: "Efectos",      value: "Fluor · Bloom · Distorsión" },
                { label: "Año",          value: "2026" },
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