"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      <div className="relative z-10 px-8 md:px-16 max-w-2xl">
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Laura — Medellín, Colombia
        </motion.p>

        <motion.h1
          className="font-display font-light text-5xl md:text-7xl leading-none tracking-tight text-ink mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          Arte generativo
          <br />
          <span className="text-cosmos">& mundos</span>
          <br />
          digitales
        </motion.h1>

        <motion.p
          className="font-body text-base text-ink-muted max-w-sm leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Exploración visual personal.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {/* ← Link en lugar de <a> */}
          <Link
            href="/work"
            className="font-body text-sm text-ink border-b border-ink pb-0.5 hover:text-cosmos hover:border-cosmos transition-colors"
          >
            ver proyectos →
          </Link>
          <Link
            href="/about"
            className="font-body text-sm text-ink-muted hover:text-ink transition-colors"
          >
            sobre mí
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand to-transparent z-10 pointer-events-none" />
    </section>
  );
}