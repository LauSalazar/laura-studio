import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

const PreloadedVideoShader = dynamic(
  () => import("@/components/PreloadedVideoShader").then((m) => m.default),
  { ssr: false, loading: () => <div style={{ width: "100%", aspectRatio: "16/5", background: "#000" }} /> }
);

// ← reemplaza estas URLs con tus videos reales
const VIDEOS = [
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781139646/LauraUdea_qijjvh.mp4",
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781139533/Omnidroid_vrngw2.mp4",
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781916364/AlVolcanReflexion_1_btasdm.mp4",
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781916708/LA_CONFIANCE_YOUTUBE_SHORT_d7nyon.mp4",
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781916850/TOMAEREA_VIDEOCLIP_FRESAS_dgkwsn.mp4",
  "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1781916960/Videoclip_musical_experimental_pln2pg.mp4"
];

const AUDIO = "https://res.cloudinary.com/dmwzvtgkd/video/upload/v1782091132/sound_pnowhu.mp3";

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
            Con otros ojos
          </h1>
          <p className="font-body text-ink-muted max-w-xl leading-relaxed">
            Videos procesados por el mismo sistema.
          </p>
        </div>

        {/* Canvas */}
        <div className="w-full rounded-2xl border border-ink-border overflow-hidden mb-16">
          <PreloadedVideoShader
            videoUrls={VIDEOS}
            labels={["UdeA", "Al Volcán", "Toma Aerea", "Omnidroid", "La confiance", "Musical experimental"]}
            audioUrl={AUDIO}
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
              mediante color y luz.
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