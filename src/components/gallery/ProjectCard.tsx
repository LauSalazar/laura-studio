"use client";

import Link from "next/link";
import Image from "next/image";
import { type Project, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/project";

export function ProjectCard({ project }: { project: Project }) {
  const color = CATEGORY_COLORS[project.category];

  return (
    <Link href={`/project/${project.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-ink-border bg-white transition-all duration-300 group-hover:border-ink/30">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-dark">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full opacity-20" style={{ background: color.text }} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="font-display font-light text-base text-ink leading-tight">
              {project.title}
            </h2>
            <span className="font-mono text-xs text-ink-muted shrink-0 mt-0.5">{project.year}</span>
          </div>
          <p className="font-body text-xs text-ink-muted leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: color.bg, color: color.text }}>
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="font-mono text-xs text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">
              ver →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}