# laura-studio — Contexto del proyecto

## Quién soy
Laura — artista digital y desarrolladora. Este portafolio muestra mi trabajo en arte generativo, experimentos artísticos, proyectos 3D y creación de contenido digital artístico. Estoy construyendo mi estilo personal, con influencias de geometría y matemáticas, naturaleza orgánica y lo espacial/cósmico.

## Stack tecnológico
- **Framework**: Next.js 14 (App Router)
- **3D / WebGL**: React Three Fiber (R3F) + Three.js
- **Animaciones**: Framer Motion
- **Estilos**: Tailwind CSS
- **Contenido**: MDX (proyectos como archivos markdown)
- **Deploy**: Vercel
- **Media**: Cloudinary (imágenes y videos)

## Estructura del proyecto
```
src/
  app/
    page.tsx              # Hero principal con pieza interactiva
    work/                 # Galería de proyectos
    project/[slug]/       # Detalle de cada proyecto
    about/                # Historia, herramientas, proceso
    contact/              # Contacto
  components/
    hero/                 # Componente hero (3D/generativo)
    gallery/              # Grid de proyectos
    layout/               # Navbar, footer, etc.
    ui/                   # Componentes reutilizables
  lib/                    # Utilidades, helpers
  styles/                 # Estilos globales
public/
  fonts/
  images/
  videos/
docs/                     # Documentación interna del proyecto
```

## Sistema de diseño
- **Fondo**: `#F5F4F1` (gris arena, no blanco puro)
- **Texto principal**: `#1A1916`
- **Texto secundario**: `#888780`
- **Borde**: `#D3D1C7`
- **Acento cosmos**: `#7F77DD` / `#AFA9EC`
- **Acento orgánico**: `#1D9E75` / `#5DCAA5`
- **Acento espacial**: `#378ADD`
- **Tipografía títulos**: Gabarito o DM Sans (weight 300)
- **Tipografía cuerpo**: Inter o IBM Plex Sans
- **Escala de espaciado**: 8px base (8, 16, 32, 64, 128)

## Convenciones de código
- **Lenguaje**: TypeScript estricto
- **Componentes**: Functional components con hooks
- **Nombrado de archivos**: kebab-case para archivos, PascalCase para componentes
- **Imports**: Absolutos usando `@/` como alias de `src/`
- **Estilos**: Tailwind utility classes, sin CSS modules salvo excepciones justificadas

## Convenciones de Git
- **Ramas**: `main` (producción) → `dev` (integración) → `feat/nombre`
- **Nunca** commitear directo a `main`
- **Commits**: Conventional Commits
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `content:` nuevo proyecto o contenido
  - `style:` cambios visuales / CSS
  - `chore:` dependencias, configuración
- **Tags**: versionado por fecha `v2025.MM` en cada release importante

## Prioridades del proyecto
1. Velocidad de desarrollo — no sobre-ingeniería
2. Diseño impactante — el arte es el protagonista
3. SEO — metadatos Open Graph por proyecto
4. Fácil de mantener — contenido en MDX, no CMS externo

## Notas importantes
- El hero debe ser una **experiencia interactiva**, no una imagen estática
- Las previews de proyectos usan **video autoplay** (sin sonido) cuando es posible
- Los assets 3D y videos son pesados — usar **lazy loading** y **Suspense** siempre
- Cada proyecto tiene su página de detalle con: demo embed, video, descripción técnica y tags
- El portafolio está en **español e inglés** (i18n a futuro, por ahora inglés)

## Localización
- Laura está basada en **Medellín, Colombia**
- Zona horaria: `America/Bogota` (UTC-5)
- Disponible para proyectos remotos
