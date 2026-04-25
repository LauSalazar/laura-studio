"use client";

import { useState } from "react";
import { projects, CATEGORY_LABELS, type ProjectCategory } from "@/lib/project";
import { ProjectCard } from "./ProjectCard";
import { clsx } from "clsx";

const ALL = "todos";
type Filter = typeof ALL | ProjectCategory;

const categories = Array.from(new Set(projects.map((p) => p.category)));

export function Gallery() {
  const [active, setActive] = useState<Filter>(ALL);
  const filtered = active === ALL ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive(ALL)}
          className={clsx(
            "font-mono text-xs px-3 py-1.5 rounded-full border transition-all",
            active === ALL
              ? "bg-ink text-sand border-ink"
              : "bg-transparent text-ink-muted border-ink-border hover:border-ink/40 hover:text-ink"
          )}
        >
          todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              "font-mono text-xs px-3 py-1.5 rounded-full border transition-all",
              active === cat
                ? "bg-ink text-sand border-ink"
                : "bg-transparent text-ink-muted border-ink-border hover:border-ink/40 hover:text-ink"
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="font-body text-ink-muted text-sm">No hay proyectos en esta categoría aún.</p>
      )}
      <p className="font-mono text-xs text-ink-muted mt-8">
        {filtered.length} {filtered.length === 1 ? "proyecto" : "proyectos"}
      </p>
    </div>
  );
}