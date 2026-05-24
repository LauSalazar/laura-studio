import { useEffect, useState } from "react";

export function useP5Loader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).p5) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.3/p5.min.js";
    script.async = true;
    script.onload = () => {
      // Verifica que window.p5 esté realmente disponible
      if ((window as any).p5) {
        setIsLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // no es necesario eliminarlo si quieres reutilizarlo en otras páginas
    };
  }, []);

  return isLoaded;
}