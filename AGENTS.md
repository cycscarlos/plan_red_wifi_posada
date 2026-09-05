# AGENTS.md

## Qué es este repo
Landing page estática (plan de implementación de red Wi-Fi para Posada Casa Manantial).
Sin framework y sin build: HTML + CSS + JS vanilla servidos tal cual. No hay `package.json`,
tests, lint ni dev server. No buses ni lances comandos npm/pnpm.

## Reglas de trabajo obligatorias
- `opencode.json` carga `config_session/rules.md` y `config_session/memory.md` como
  instrucciones. Las reglas de `rules.md` son vinculantes: no cambiar código sin autorización
  explícita del usuario; el agente hace los commits (formato `checkpoint: <desc>`), pero el
  push y la verificación las ejecuta el usuario.
- `rules.md` pide leer `PRODUCT.md` y `DESIGN.md`; no existen todavía. Ignorarlos.

## Cómo verificar cambios
- Sintaxis JS: `node --check assets/js/main.js`. (`node --check index.js` de rules.md es viejo; no existe index.js.)
- Pruebas visuales: abrir `index.html` en el navegador; las ejecuta el usuario.

## Estructura y gotchas
- `index.html`: toda la página en un solo archivo; navegación por anclas por sección.
- Estilos y JS viven bajo `assets/`: `assets/css/styles.css` y `assets/js/main.js` (después de una
  reorganización del usuario todo lo entregado al sitio está bajo `assets/`).
- `assets/js/main.js`: IIFE ES5 (`var`, `"use strict"`), sin imports ni transpilación. Mantener ese estilo; no pasar a ES6+ modules.
- Menú móvil: `#navToggle` alterna `.is-open` en `#navMobile` (assets/js/main.js:14-25).
- Colores: tokens en `:root` al inicio de `assets/css/styles.css` (`--blue-600`, etc.); cambiarlos propaga a toda la página.
- El PDF del plan técnico es `assets/docs/Plan-Tecnico-de-Red.pdf`; es el destino de los botones
  "Descargar". El README habla de `netlify.toml`, `vercel.json` y
  `assets/plan_implementacion_wifi_posada.pdf`: no existen (README desactualizado).
- `index_v.Original.html` es respaldo de la landing anterior; la página activa es solo `index.html`.
- `trash/` son descartes gitignoreados; no tratar como código fuente.