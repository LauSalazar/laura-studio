# laura-studio

Portafolio personal de Laura — arte generativo, experimentos artísticos, proyectos 3D y creación de contenido digital.

## Stack

- [Next.js 14](https://nextjs.org/) — App Router
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D y WebGL
- [Framer Motion](https://www.framer.com/motion/) — Animaciones
- [Tailwind CSS](https://tailwindcss.com/) — Estilos
- [MDX](https://mdxjs.com/) — Contenido de proyectos
- [Vercel](https://vercel.com/) — Deploy

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura

```
src/
  app/          # Rutas (Next.js App Router)
  components/   # Componentes React
  lib/          # Utilidades y helpers
  styles/       # Estilos globales
public/         # Assets estáticos
docs/           # Documentación interna
```

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Producción — desplegada en Vercel |
| `dev` | Integración — preview en Vercel |
| `feat/*` | Features y experimentos |

## Convenciones de commits

```
feat: nueva funcionalidad
fix: corrección de bug
content: nuevo proyecto o contenido
style: cambios visuales
chore: dependencias, configuración
```

---

© Laura — Medellín, Colombia
