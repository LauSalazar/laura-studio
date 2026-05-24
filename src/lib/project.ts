export type ProjectCategory =
  | "3d-webgl"
  | "arte-generativo"
  | "camara-video"
  | "experimento"
  | "instalacion"
  | "virtual-tour"
  | "juego";

export type ProjectType = "interactive" | "static" | "embed";

export interface Project {
  title: string;
  slug: string;
  category: ProjectCategory;
  tags: string[];
  year: number;
  cover: string;
  type: ProjectType;
  description: string;
  url?: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "3d-webgl":        "3D / WebGL",
  "arte-generativo": "Arte generativo",
  "camara-video":    "Cámara / video",
  "experimento":     "Experimento",
  "instalacion":     "Instalación",
  "virtual-tour":    "Virtual tour",
  "juego":           "Juego",
};

export const CATEGORY_COLORS: Record<ProjectCategory, { bg: string; text: string }> = {
  "3d-webgl":        { bg: "#EEEDFE", text: "#3C3489" },
  "arte-generativo": { bg: "#E1F5EE", text: "#085041" },
  "camara-video":    { bg: "#E6F1FB", text: "#0C447C" },
  "experimento":     { bg: "#F1EFE8", text: "#444441" },
  "instalacion":     { bg: "#FAECE7", text: "#712B13" },
  "virtual-tour":    { bg: "#FBEAF0", text: "#72243E" },
  "juego":           { bg: "#FAEEDA", text: "#633806" },
};

export const projects: Project[] = [
  {
    title: "Toroide errante",
    slug: "toroide",
    category: "3d-webgl",
    tags: ["p5.js", "geometría", "matemáticas"],
    year: 2026,
    cover: "/images/toroide/cover.jpg",
    type: "interactive",
    description: "Toroide 3D en perspectiva que se mueve aleatoriamente por el canvas.",
  },
  {
    title: "Cartografía del Arte Electrónico",
    slug: "arte-electronico",
    category: "experimento",
    tags: ["D3.js", "hipertexto", "investigación", "mapa nodal"],
    year: 2026,
    cover: "/images/cartografia/cover.jpg",
    type: "interactive",
    description: "Mapa nodal interactivo que explora la historia del arte electrónico de forma no lineal.",
  },
  {
    title: "La final",
    slug: "la-final",
    category: "virtual-tour",
    tags: ["three.js", "webgl", "interactividad"],
    year: 2026,
    cover: "/images/la-final/cover.jpg",
    type: "interactive",
    description: "Mundo inmersivo que explora un partido final de voley playa.",
  },
  {
    title: "Rizoma visual",
    slug: "rizoma-visual",
    category: "arte-generativo",
    tags: ["p5.js", "generative art", "algoritmos"],
    year: 2026,
    cover: "/images/rizoma-visual/cover.jpg",
    type: "interactive",
    description: "Rizoma creado a partir de una galeria visual.",
  }
];