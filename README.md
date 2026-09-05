# Plan de Implementación — Red WiFi Mesh (Landing Page)

Landing page estática que acompaña al documento técnico
`assets/plan_implementacion_wifi_posada.pdf`. Sin frameworks, sin paso de build:
HTML + CSS + JS plano, listo para desplegar por Git.

## Estructura

```
├── index.html          # Toda la página (una sola vista, con anclas por sección)
├── css/styles.css      # Sistema de diseño (tokens, tipografía, componentes)
├── js/main.js           # Reveal on scroll, acordeón de etapas, contador de stats, menú móvil
├── assets/
│   └── plan_implementacion_wifi_posada.pdf   # Documento descargable desde la página
├── netlify.toml         # Config de despliegue para Netlify
└── vercel.json          # Config de despliegue para Vercel
```

No hay `package.json` ni dependencias — es HTML/CSS/JS servido tal cual.

## Personalización rápida

- **Colores:** todos los tokens de color están en `:root` al inicio de `css/styles.css`
  (`--blue-600`, `--blue-400`, `--mint-400`, etc.). Cambiarlos ahí se propaga a toda la página.
  Ajustar tono de "azul medicina": empieza modificando `--blue-600` y `--blue-400` primero
  y usando gradientes similares en `--ink-*` para mantener el contraste.
- **PDF:** si regeneras el documento técnico, simplemente reemplaza el archivo en
  `assets/` manteniendo el mismo nombre (o actualiza las rutas `href` en `index.html`).

## Despliegue: GitHub → Netlify o Vercel (automático)

### 1. Subir a GitHub

```bash
cd wifi-landing
git init
git add .
git commit -m "Landing page: plan de implementación red WiFi"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

### 2A. Conectar con Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Elige **GitHub** y autoriza el acceso al repositorio.
3. Netlify detecta `netlify.toml` automáticamente:
   - Build command: _(vacío — no hay build)_
   - Publish directory: `.`
4. **Deploy site**. Cada `git push` a `main` vuelve a desplegar automáticamente.

### 2B. Conectar con Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) → importa el repositorio de GitHub.
2. Vercel detecta `vercel.json` (proyecto estático, sin framework). Deja los campos de
   build por defecto (vacíos).
3. **Deploy**. Cada `git push` a `main` (o a la rama configurada) genera un nuevo deploy,
   con preview automático en cada Pull Request.

### Dominio propio

Tanto Netlify como Vercel permiten añadir un dominio propio desde el panel del sitio
(**Domain settings**) una vez desplegado — útil si quieres mostrar la propuesta bajo tu
propio dominio en vez de `*.netlify.app` / `*.vercel.app`.

## Notas técnicas

- Tipografías vía Google Fonts CDN (Space Grotesk, IBM Plex Sans, IBM Plex Mono) —
  requiere conexión a internet en el navegador del cliente; no necesita build local.
- Animaciones respetan `prefers-reduced-motion`.
- El diagrama de topología y el trazo tipo "electrocardiograma" del hero son SVG puro
  (sin imágenes rasterizadas), por lo que escalan sin pérdida de calidad.
- Sin analítica ni cookies de terceros incluidas por defecto.
