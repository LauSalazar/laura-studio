"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";

const RizomaSketch = dynamic(
    () => import("@/components/sketches/RizomaSketch").then((m) => m.RizomaSketch),
    { ssr: false, loading: () => <div className="w-full h-full bg-white" /> }
);

export default function RizomaVisualPage() {
    const [sketchKey, setSketchKey] = useState(0);
    return (
        <main className="min-h-screen bg-sand">
            <Navbar />
            
            <section className="max-w-4xl mx-auto px-8 md:px-16 pt-32 pb-24">
                <div className="mb-10">
                    <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-3">
                        Arte generativo — 2026
                    </p>
                    <h1 className="font-display font-light text-4xl md:text-5xl text-ink">
                        Luz en el camino
                    </h1>
                </div>

                <div className="w-full rounded-2xl border border-ink-border bg-white overflow-hidden shadow-sm mb-16"
                    style={{ height: "520px" }}>
                    <RizomaSketch 
                        key={sketchKey} 
                        onRestart={() => setSketchKey(k => k + 1)} 
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-16">
                    <div className="md:col-span-2">
                        <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
                            Descripción
                        </p>
                        <p className="font-body text-ink-muted leading-relaxed">
                            Seamos luz en el camino, incluso en medio del lodo.
                        </p>
                    </div>
                    </div>
            </section>
        </main>
    );
}
                    