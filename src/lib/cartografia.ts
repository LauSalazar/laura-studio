export interface Nodo {
  id: string;
  label: string;
  sublabel: string;
  periodo?: string;
  x: number;
  y: number;
  tipo: "central" | "historico" | "autoral" | "especial";
}

export interface Conexion {
  origen: string;
  destino: string;
  tipo?: "solida" | "discontinua";
}

export const nodos: Nodo[] = [
  { id: "central", label: "Cartografía", sublabel: "Arte Electrónico", x: 0.5, y: 0.5, tipo: "central" },
  { id: "origenes", label: "Orígenes", sublabel: "1950-1970", x: 0.2, y: 0.15, tipo: "historico" },
  { id: "pantalla", label: "La pantalla", sublabel: "1970-1990", x: 0.5, y: 0.1, tipo: "historico" },
  { id: "internet", label: "Internet", sublabel: "1990-2000", x: 0.8, y: 0.15, tipo: "historico" },
  { id: "algoritmo", label: "Algoritmo", sublabel: "2000-2010", x: 0.2, y: 0.85, tipo: "historico" },
  { id: "interaccion", label: "Interacción", sublabel: "2010-2020", x: 0.5, y: 0.9, tipo: "historico" },
  { id: "presente", label: "Presente", sublabel: "2020-hoy", x: 0.8, y: 0.85, tipo: "historico" },
];

export const conexiones: Conexion[] = [
  { origen: "central", destino: "origenes" },
  { origen: "central", destino: "pantalla" },
  { origen: "central", destino: "internet" },
  { origen: "central", destino: "algoritmo" },
  { origen: "central", destino: "interaccion" },
  { origen: "central", destino: "presente" },
  { origen: "origenes", destino: "pantalla" },
  { origen: "pantalla", destino: "internet" },
  { origen: "internet", destino: "algoritmo" },
  { origen: "algoritmo", destino: "interaccion" },
  { origen: "interaccion", destino: "presente" },
];