"use client";

import { useState } from "react";
import { NodeMap } from "@/components/cartografia/NodeMap";
import Link from "next/link";
import "./page.css";

const CONTENIDO: Record<
  string,
  {
    titulo: string;
    periodo?: string;
    texto: string;
    referentes: string[];
    conexiones: string[];
    fuentes?: { label: string; url: string }[];
  }
> = {
  central: {
    titulo: "Cartografía del Arte Electrónico",
    texto: "Una exploración no lineal de las relaciones entre arte, tecnología e interacción. Navega los nodos para descubrir cómo el arte electrónico se ha transformado desde los años 50 hasta el presente.",
    referentes: [],
    conexiones: ["Orígenes", "La pantalla", "Internet", "Algoritmo", "Interacción", "Presente"],
    fuentes: [
        { label: "Ars Electronica", url: "https://ars.electronica.art/news/en/" },
        { label: "The language of media, Lev Manovich", url: "https://dss-edit.com/plu/Manovich-Lev_The_Language_of_the_New_Media.pdf" },
        { label: "ZKM Center for Art and Media", url: "https://zkm.de/en" },
        { label: "Rhizome", url: "https://rhizome.org/" },
    ],
  },
  origenes: {
    titulo: "Orígenes",
    periodo: "1950-1970",
    texto: "Las primeras relaciones entre arte, automatización y cibernética. El arte cinético introduce el movimiento real como lenguaje. Nicolas Schöffer desarrolla la idea del arte como sistema autorregulado. Nam June Paik inaugura el videoarte como nueva temporalidad visual.",
    referentes: ["Julio Le Parc", "Nicolas Schöffer", "Nam June Paik"],
    conexiones: ["La pantalla", "Cibernética", "Arte cinético"],
  },
  pantalla: {
    titulo: "La pantalla como territorio",
    periodo: "1970-1990",
    texto: "La pantalla emerge como nuevo soporte artístico. El videoarte explora el tiempo, la memoria y la percepción. La computadora aparece como herramienta creativa. Las primeras interfaces abren el diálogo entre humano y máquina.",
    referentes: ["Bill Viola", "Vera Molnár", "Steina Vasulka"],
    conexiones: ["Orígenes", "Internet", "Arte computacional"],
  },
  internet: {
    titulo: "Internet y no linealidad",
    periodo: "1990-2000",
    texto: "El hipertexto redefine la narrativa. El Net Art convierte la red en territorio artístico. La navegación fragmentada propuesta por Manovich inaugura una nueva estética de la información y la no linealidad.",
    referentes: ["Olia Lialina", "Jodi.org", "Lev Manovich"],
    conexiones: ["La pantalla", "Algoritmo", "Hiperficción"],
  },
  algoritmo: {
    titulo: "Algoritmo y generación",
    periodo: "2000-2010",
    texto: "El código se convierte en medio expresivo. El arte generativo explora sistemas autónomos, el azar computacional y la emergencia. Casey Reas y Processing democratizan la creación algorítmica.",
    referentes: ["Casey Reas", "Ben Fry", "Manfred Mohr"],
    conexiones: ["Internet", "Interacción", "Arte generativo"],
  },
  interaccion: {
    titulo: "Interacción y experiencia",
    periodo: "2010-2020",
    texto: "El cuerpo y los sensores se integran en la obra. La participación del espectador se vuelve constitutiva. teamLab lleva la instalación interactiva a escala monumental. El espectador se convierte en co-autor.",
    referentes: ["teamLab", "Random International", "Rafael Lozano-Hemmer"],
    conexiones: ["Algoritmo", "Presente", "Instalación interactiva"],
  },
  presente: {
    titulo: "Presente expandido",
    periodo: "2020-hoy",
    texto: "La inteligencia artificial, el bioarte, la realidad inmersiva y el arte de datos definen el momento actual. Las fronteras entre lo físico y lo digital se disuelven. El artista dialoga con sistemas que tienen agencia propia.",
    referentes: ["Refik Anadol", "Holly Herndon", "Memo Akten"],
    conexiones: ["Interacción", "IA generativa"],
  },
};

export default function CartografiaPage() {
  const [nodoActivo, setNodoActivo] = useState<string>("central");
  const [nodosVisitados, setNodosVisitados] = useState<Set<string>>(new Set(["central"]));

  const handleNodoClick = (id: string) => {
    setNodoActivo(id);
    setNodosVisitados((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const contenido = CONTENIDO[nodoActivo];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B0D10",
        color: "#F5F3EF",
        fontFamily: "var(--font-body, sans-serif)",
      }}
    >
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 32px",
          borderBottom: "0.5px solid #1A2030",
          background: "rgba(11,13,16,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#8B949E",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            textDecoration: "none",
          }}
        >
          ← laura
        </Link>
        <span
          style={{
            color: "#4A90E2",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
          }}
        >
          cartografía / arte electrónico
        </span>
      </nav>

      <div className="page-layout">
        <div className="mapa-panel">
          <NodeMap
            nodoActivo={nodoActivo}
            nodosVisitados={nodosVisitados}
            onNodoClick={handleNodoClick}
          />
        </div>

        <div className="contenido-panel">
          {contenido && (
            <div key={nodoActivo}>
              {contenido.periodo && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#4A90E2",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {contenido.periodo}
                </p>
              )}

              <h1
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 300,
                  fontSize: 36,
                  lineHeight: 1.2,
                  color: "#F5F3EF",
                  marginBottom: 24,
                }}
              >
                {contenido.titulo}
              </h1>

              <p
                style={{
                  fontSize: 15,
                  color: "#8B949E",
                  lineHeight: 1.8,
                  marginBottom: 32,
                }}
              >
                {contenido.texto}
              </p>

              {contenido.referentes.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "#4A90E2",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    Referentes
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {contenido.referentes.map((r) => (
                      <span
                        key={r}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 20,
                          border: "0.5px solid #2A3A4A",
                          color: "#8B949E",
                        }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {contenido.conexiones.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "#5CE1B9",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    Conecta con
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {contenido.conexiones.map((c) => (
                      <span
                        key={c}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 20,
                          border: "0.5px solid #1A3028",
                          color: "#5CE1B9",
                          background: "#0D1A18",
                        }}
                      >
                        → {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {contenido.fuentes && contenido.fuentes.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8B949E", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 12 }}>
                    Fuentes
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {contenido.fuentes.map((f) => (
                        <a
                        key={f.url}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#4A90E2", textDecoration: "none", borderBottom: "0.5px solid #1A3050" }}
                        >
                        ↗ {f.label}
                        </a>
                    ))}
                    </div>
                </div>
                )}

              <div
                style={{
                  marginTop: 48,
                  paddingTop: 24,
                  borderTop: "0.5px solid #1A2030",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "#2A3A4A",
                    letterSpacing: "0.08em",
                  }}
                >
                  {nodosVisitados.size} / {Object.keys(CONTENIDO).length} nodos explorados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
