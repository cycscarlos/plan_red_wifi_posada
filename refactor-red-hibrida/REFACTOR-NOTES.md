# Landing simple — Red Híbrida TV/WiFi

**Fecha:** 24·11·2026
**Fuente:** `assets/docs/Red Hibrida_TV_WiFi-24112026.pdf` (3 páginas)
**Alcance:** copia aislada en `refactor-red-hibrida/`. Los archivos originales de la raíz siguen intactos.

## Qué quedó

- `index.html`: reemplazado por una landing **sencilla** que vacía el PDF en cinco bloques: Equipamiento, Mejora, APs, Esquema y VLANs, más el CTA de descarga. Mantiene el formato visual de la página anterior (nav, hero, stats, secciones, diagcards, CTA, footer) y el candado de licencia.
- `assets/css/styles.css`: se agregó el componente `.flow` (diagrama físico en HTML responsive, sin SVG) al final de la sección de diagramas.
- `assets/docs/Red-Hibrida-TV-WiFi.pdf`: copia URL-safe del PDF fuente; enlazada en el hero y en el CTA.
- `assets/js/main.js` y `assets/js/license.js`: intactos.
- `costos.html`, `assets/docs/Guia_Instalacion_Fisica_Backbone_Posada.docx` y el material de versiones anteriores quedan en la carpeta como material interno, sin enlaces desde la landing.

## Estructura de la página

1. **Hero:** “Cable en lugar de mesh. Menos latencia. Más estabilidad.” + 4 stats (3 APs, 5 switches, 60 W PoE+, 0 saltos mesh).
2. **01 · Equipamiento:** 6 tarjetas (GWN7801, 5× GWN7711, GWN7701P, GWN7660LR, 2× GWN7630LR, UTP Cat.6e).
3. **02 · La mejora:** el cable elimina la pérdida de ancho de banda por saltos inalámbricos; diagcard con enlace, latencia, gestión y roaming.
4. **03 · APs:** PoE+ del GWN7701P (4 puertos, 60 W, 3 APs ≈ 39 W); se retiran los inyectores y se desactiva el mesh en el GWN7660LR.
5. **04 · Esquema físico:** flujo GPON → GWN7801 → puertos 1–5 → 5× GWN7711 → TV; puerto 6 → GWN7701P → 3 APs.
6. **05 · VLANs:** hoy red plana con DHCP del GPON (192.168.5.x); con router VLAN (GWN7001) se activan VLAN 10 (TV) y VLAN 20 (APs) sin cambiar cableado.
7. **CTA:** descarga del PDF.

## Criterios aplicados

- **Mismo formato, contenido mínimo:** se eliminaron las 13 premisas, la guía de 5 pasos, la topología de 9 nodos, la sección In-Wall y el CTA de costos.
- **Corrección intencional:** los TV se alimentan a **110 V**; el cable UTP solo lleva datos. El PDF fuente dice “alimentados directo por PoE” y es un error.
- **VLANs condicionales:** el GPON actual no maneja VLAN; la separación lógica requiere un router con soporte VLAN antes del GWN7801.
- **Sin cifras de TV:** la landing simple no repite el conteo de 32; el PDF tampoco lo incluye.

## Verificación ejecutada

- HTML balanceado (parser), sin anclas huérfanas.
- 6 tarjetas de equipamiento, 4 stats, 5 diagcards, 6 nodos de flujo, 2 enlaces de descarga al PDF.
- `node --check` OK en `main.js`.
- Sin enlaces a `costos.html`.
- `git diff` de la raíz vacío: los originales no se tocaron.

## Pendientes y supuestos

1. **Prueba visual, licencia y pill:** las ejecuta el usuario en el navegador (escritorio y móvil).
2. **PDF de la guía:** el `.docx` interno está actualizado, pero su PDF sigue siendo el anterior; regenerarlo desde Word si se va a usar.
3. **`costos.html`:** permanece en la copia sin enlace. Para una publicación limpia, conviene retirarlo (y el material interno) de la carpeta publicada.
4. **Uplink GPON:** la landing simple no asigna puerto (el PDF no lo hace). La guía interna usa puerto 8 → GPON; confirmar con el handoff real.
5. **Conteo de TV:** si el cliente necesita el dato, agregarlo como nota; no está en la versión simple.

## Cómo probar

1. Abrir `refactor-red-hibrida/index.html` en el navegador.
2. Revisar nav de escritorio/móvil y el diagrama de flujo en móvil (debe apilar las dos ramas).
3. Activar la licencia y comprobar el pill de días.
4. Probar los dos botones “Descargar documento”.
