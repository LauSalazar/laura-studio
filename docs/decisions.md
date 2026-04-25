# Decisiones de arquitectura

Registro de decisiones técnicas y de diseño del proyecto.

---

## 2025 — Setup inicial

### Stack
- **Next.js 14 App Router** sobre Pages Router: mejor soporte para RSC, layouts anidados y metadata API para SEO.
- **React Three Fiber** sobre Three.js vanilla: integración más natural con el árbol de componentes React y mejor DX.
- **MDX para contenido**: evitar un CMS externo en la fase inicial. Fácil de versionar en Git junto al código.
- **Tailwind CSS**: velocidad de desarrollo sobre expresividad. Sin CSS Modules salvo para estilos muy específicos de canvas/WebGL.

### Diseño
- Fondo `#F5F4F1` (arena) en vez de blanco puro: reduce fatiga visual y hace destacar las piezas de arte.
- Tres acentos (púrpura, teal, azul) mapeados a las tres influencias estéticas: geometría, naturaleza, cosmos.
- Tipografía en weight 300 para títulos: transmite ligereza y sofisticación sin competir con el arte.

### Versionado
- Trunk-based simplificado: `main` → `dev` → `feat/*`
- Tags por fecha (`v2025.MM`) en vez de semver: más natural para un portafolio que evoluciona por rediseños.
- Conventional Commits para historial legible a largo plazo.
