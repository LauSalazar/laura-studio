import { Navbar } from "@/components/layout/Navbar";
import { Gallery } from "@/components/gallery/Gallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Proyectos de arte generativo, 3D y experimentos digitales.",
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-sand">
      <Navbar />
      <section className="max-w-5xl mx-auto px-8 md:px-16 pt-32 pb-24">
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
            Proyectos
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink">
            Work
          </h1>
        </div>
        <Gallery />
      </section>
    </main>
  );
}