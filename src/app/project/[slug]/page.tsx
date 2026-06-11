import { ProjectClient } from "./ProjectClient";

export function generateStaticParams() {
  return [
    { slug: "toroide" },
    { slug: "arte-electronico" },
    { slug: "la-final" },
    { slug: "rizoma-visual" },
    { slug: "video-generativo" },
  ];
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectClient slug={params.slug} />;
}