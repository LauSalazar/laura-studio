import { Navbar } from "@/components/layout/Navbar";
import { projects } from "@/lib/project";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="min-h-screen pt-24 px-8 md:px-16">
      <Navbar />
      <section className="max-w-4xl mx-auto py-16">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-muted mb-4">
          Proyecto
        </p>
        <h1 className="font-display font-light text-4xl text-ink">
          {params.slug}
        </h1>
      </section>
    </main>
  );
}