"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

const REDIRECTS: Record<string, string> = {
  "arte-electronico": "/arte-electronico",
  "la-final": "/la-final",
  "rizoma-visual": "/rizoma-visual",
};

export function ProjectClient({ slug }: { slug: string }) {
  const router = useRouter();
  const redirectTo = REDIRECTS[slug];

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (redirectTo) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0B0D10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "#4A90E2",
          letterSpacing: "0.1em",
        }}>
          cargando...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 px-8 md:px-16">
      <Navbar />
      <section className="max-w-4xl mx-auto py-16">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
          Proyecto
        </p>
        <h1 className="font-display font-light text-4xl text-ink">
          {slug}
        </h1>
      </section>
    </main>
  );
}