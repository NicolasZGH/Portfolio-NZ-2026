# Portfolio-NZ

Portafolio de **Nicolás Zorrilla** — diseñador gráfico, UI/UX y desarrollador front-end.

Migrado a **Astro 7** con arquitectura de islas: 0 KB de JS de framework, imágenes
optimizadas (WebP/AVIF responsive), fuentes self-hosted y animaciones GPU. Lighthouse
100/100/100/100 (Rendimiento · Accesibilidad · Buenas prácticas · SEO) en dark y light.

## Stack

- **Astro 7** — SSG, islas, `astro:assets` para optimización de imágenes.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — tokens de diseño temáticos vía `@theme`.
- **Fontsource** — Bricolage Grotesque, Inter y JetBrains Mono self-hosted.
- Animaciones vanilla (IntersectionObserver + transforms): reveal on scroll, botones
  magnéticos, tilt 3D, cursor glow, texto con gradiente animado.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321/Portfolio-NZ
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
```

## Estructura

```
src/
  data/site.ts        # contenido centralizado (ES): nav, logos, proyectos, contacto
  layouts/Base.astro  # <head>, SEO/OG/JSON-LD, no-flash theme, fuentes
  components/          # Header, Hero, Logos (carrusel), Projects, Contact, Footer
  scripts/            # ui.ts (tema, nav, reveal, efectos) · carousel.ts
  styles/global.css   # tokens, utilidades de firma, keyframes
  assets/             # imágenes optimizadas por astro:assets
```

## Despliegue

GitHub Pages vía Actions (`.github/workflows/deploy.yml`). El sitio se sirve en
`/Portfolio-NZ/` (configurado con `base` y `site` en `astro.config.mjs`).
En el repo: **Settings → Pages → Source: GitHub Actions**.
