"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/arte-electronico");
  }, [router]);

  // Mostrar algo mientras redirige
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