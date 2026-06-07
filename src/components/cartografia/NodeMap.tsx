"use client";

import { useEffect, useRef } from "react";
import './NodeMap.css';
import { nodos, conexiones, type Nodo } from "@/lib/cartografia";

interface Props {
  nodoActivo: string | null;
  nodosVisitados: Set<string>;
  onNodoClick: (id: string) => void;
}

const COLORES = {
  central:   { stroke: "#4A90E2", fill: "#0D1520", text: "#4A90E2" },
  historico: { stroke: "#5CE1B9", fill: "#0D1A18", text: "#5CE1B9" },
  autoral:   { stroke: "#4A90E2", fill: "#0D1520", text: "#4A90E2" },
  especial:  { stroke: "#2A3A4A", fill: "#0D1520", text: "#8B949E" },
};

const RADIO = {
  central:   40,
  historico: 26,
  autoral:   26,
  especial:  20,
};

export function NodeMap({ nodoActivo, nodosVisitados, onNodoClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 480;
  const H = 420;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getPos = (n: Nodo) => ({ x: n.x * W, y: n.y * H });

    // Actualizar líneas
    conexiones.forEach((c) => {
      const origen  = nodos.find((n) => n.id === c.origen)!;
      const destino = nodos.find((n) => n.id === c.destino)!;
      const line = svg.querySelector(`[data-line="${c.origen}-${c.destino}"]`) as SVGLineElement;
      if (!line) return;
      const isActive =
        nodoActivo === c.origen || nodoActivo === c.destino;
      line.setAttribute("stroke", isActive ? "#4A90E2" : "#1E2A38");
      line.setAttribute("stroke-width", isActive ? "1.2" : "0.6");
      line.setAttribute("stroke-opacity", isActive ? "0.8" : "0.4");
    });

    // Actualizar nodos
    nodos.forEach((n) => {
      const circle = svg.querySelector(`[data-node="${n.id}"] circle`) as SVGCircleElement;
      const g = svg.querySelector(`[data-node="${n.id}"]`) as SVGGElement;
      if (!circle || !g) return;

      const isActive  = nodoActivo === n.id;
      const isVisited = nodosVisitados.has(n.id);
      const col = COLORES[n.tipo];
      const rad = RADIO[n.tipo];

      if (isActive) {
        circle.setAttribute("stroke", col.stroke);
        circle.setAttribute("stroke-width", "1.5");
        circle.setAttribute("fill", col.fill);
        circle.setAttribute("r", String(rad + 4));
      } else if (isVisited) {
        circle.setAttribute("stroke", "#3A3E48");
        circle.setAttribute("stroke-width", "0.8");
        circle.setAttribute("fill", "#111620");
        circle.setAttribute("r", String(rad));
      } else {
        circle.setAttribute("stroke", col.stroke);
        circle.setAttribute("stroke-width", "0.8");
        circle.setAttribute("fill", col.fill);
        circle.setAttribute("r", String(rad));
      }
    });
  }, [nodoActivo, nodosVisitados]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
    >
      {/* SVG animation styles are moved to NodeMap.css */}

      {/* Fondo */}
      <rect width={W} height={H} fill="#0B0D10" rx="12" />

      {/* Grid sutil */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 40} y1={0} x2={i * 40} y2={H}
          stroke="#141820" strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0} y1={i * 40} x2={W} y2={i * 40}
          stroke="#141820" strokeWidth="0.5"
        />
      ))}

      {/* Conexiones */}
      {conexiones.map((c) => {
        const o = nodos.find((n) => n.id === c.origen)!;
        const d = nodos.find((n) => n.id === c.destino)!;
        return (
          <line
            key={`${c.origen}-${c.destino}`}
            data-line={`${c.origen}-${c.destino}`}
            x1={o.x * W} y1={o.y * H}
            x2={d.x * W} y2={d.y * H}
            stroke="#1E2A38"
            strokeWidth="0.6"
            strokeOpacity="0.4"
            strokeDasharray={c.tipo === "discontinua" ? "3 5" : undefined}
          />
        );
      })}

      {/* Nodos */}
      {nodos.map((n) => {
        const px = n.x * W;
        const py = n.y * H;
        const col = COLORES[n.tipo];
        const rad = RADIO[n.tipo];
        const isCentral = n.tipo === "central";

        return (
          <g
            key={n.id}
            data-node={n.id}
            style={{ cursor: "pointer" }}
            onClick={() => onNodoClick(n.id)}
          >
            {/* Halo exterior en nodo activo */}
            {nodoActivo === n.id && (
              <circle
                cx={px} cy={py}
                r={rad + 12}
                fill="none"
                stroke={col.stroke}
                strokeWidth="0.5"
                strokeOpacity="0.3"
                className="node-pulse"
              />
            )}

            <circle
              cx={px} cy={py} r={rad}
              fill={col.fill}
              stroke={col.stroke}
              strokeWidth="0.8"
            />

            {/* Texto */}
            <text
              x={px} y={isCentral ? py - 5 : py - 4}
              textAnchor="middle"
              fill={col.text}
              fontSize={isCentral ? 11 : 9}
              fontFamily="var(--font-mono, monospace)"
              fontWeight="500"
            >
              {n.label}
            </text>
            <text
              x={px} y={isCentral ? py + 9 : py + 8}
              textAnchor="middle"
              fill="#8B949E"
              fontSize={8}
              fontFamily="var(--font-mono, monospace)"
            >
              {n.sublabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}