# Portafolio — Nicolás Zorrilla

Sitio web personal hecho en **HTML, CSS y JavaScript puro**. Sin frameworks,
sin paso de compilación. Se edita y se publica directo.

## Estructura

```
index.html    → toda la página (textos, secciones, estructura)
script.js     → interactividad (tema, menú, carrusel, efectos)
assets/       → imágenes (en WebP, livianas)
  ├── pp-lime.webp, pp-violet.webp → foto de perfil (tema oscuro / claro)
  ├── favicon.png, favicon.ico     → ícono de la pestaña
  └── logos/                       → logotipos del carrusel
optimizar-imagenes.sh → convierte imágenes nuevas a WebP
.nojekyll     → le dice a GitHub Pages que sirva los archivos tal cual
```

Los estilos (colores, fuentes) viven dentro del `<style type="text/tailwindcss">`
en `index.html`. Se usa **Tailwind CSS** cargado por CDN (una etiqueta `<script>`
en el `<head>`), así que no hay que instalar ni compilar nada.

## Cómo editar

Todo el contenido está escrito directo en `index.html`:

- **Textos, títulos, descripción** → buscá la sección y cambiá el texto.
- **Proyectos** → sección `<!-- PROYECTOS -->`. Cada proyecto es un `<article>`:
  cambiá título, descripción, etiquetas y el enlace (`href`).
- **Logotipos** → sección `<!-- LOGOTIPOS -->`. Cada logo es un `<article>`:
  cambiá la imagen (`src`), el título, el número (`ID / 0X`) y las etiquetas.
  Los clones para el bucle del carrusel los agrega el JavaScript solo.
- **Contacto** → cambiá email, teléfono y GitHub en la sección `<!-- CONTACTO -->`.
- **Colores** → en el `<style>` del `<head>`, dentro de `:root` (tema oscuro)
  y `:root[data-theme='light']` (tema claro).

## Imágenes (WebP)

Las imágenes están en **WebP**: misma calidad que PNG pero pesan ~90% menos
(las imágenes del sitio bajaron de ~3.5MB a ~0.5MB). Lo soportan todos los
navegadores modernos.

Para agregar o cambiar una imagen:

1. Poné la imagen (`.png` o `.jpg`) en `assets/` (fotos) o `assets/logos/` (logos).
2. Corré `./optimizar-imagenes.sh` → crea el `.webp` al lado.
3. En `index.html`, apuntá el `src` de la imagen al `.webp` nuevo.
4. Borrá el `.png`/`.jpg` original (ya no se usa).

Necesitás **ImageMagick** instalado (`sudo pacman -S imagemagick`).

## Ver el sitio en tu computadora

Abrí `index.html` en el navegador. Para que todo funcione igual que online,
mejor levantá un servidor local simple, por ejemplo:

```bash
python3 -m http.server
```

Y entrá a `http://localhost:8000`.

## Publicar en GitHub Pages

No hay build. GitHub Pages sirve los archivos directo desde la rama:

1. Subí los cambios: `git add . && git commit -m "..." && git push`
2. En GitHub → **Settings → Pages**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / carpeta `/ (root)`
3. Guardá. En un minuto queda online en:
   `https://dgonzalez211.github.io/Portfolio-NZ/`

Cada `git push` a `main` actualiza el sitio automáticamente.
