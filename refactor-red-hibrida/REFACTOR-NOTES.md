# Notas de refactorización — Red Híbrida TV/WiFi

**Fecha:** 24·11·2026
**Base:** `assets/docs/Plan-de-refactorizacion-2026-11-24.md` + `Red Hibrida_TV_WiFi-24112026.pdf`
**Alcance:** copia aislada en `refactor-red-hibrida/`. Los archivos originales de la raíz no se modificaron.

## Cambios aplicados en la copia

- `index.html`: refactor completo (head, nav sin In-Wall, hero, stats, resumen, premisas 01–13, topología, canales, guía 00–04, CTA). Se eliminó la sección y el ancla In-Wall.
- `assets/docs/Guia_Instalacion_Fisica_Backbone_Posada.docx`: BOM, verificaciones, mapa de puertos, secuencia (fases A–G) y pruebas actualizados a GWN7701P + 5× GWN7711 + APs cableados.
- `assets/docs/Red-Hibrida-TV-WiFi.pdf`: copia URL-safe del PDF fuente; enlazada en los dos botones de descarga.
- `assets/docs/Versiones-anteriores/`: `Plan-tecnico-red-wifi.docx` y `.pdf` archivados.
- `costos.html`: copiado sin cambios y desvinculado de la landing (BOM viejo, fuera de alcance).
- `assets/css/styles.css`, `assets/js/main.js` y `assets/js/license.js`: intactos.

## Decisiones del usuario

- Subcarpeta: `refactor-red-hibrida/`.
- Enlace de descarga: opción A (PDF de síntesis con nombre URL-safe).
- CTA "Costos de referencia": retirado de la landing.
- GWN7001: router VLAN opcional/futuro; VLAN 10/20 condicionales.
- `Plan-tecnico-red-wifi.*`: archivado en esta fase.
- Conteo de TV: 32 (mapa §6 del plan).

## Verificación ejecutada

- `node --check` OK en `main.js` y `license.js`.
- HTML balanceado (parser), sin anclas huérfanas, 13 premisas, 5 pasos, 9 nodos de topología.
- Sin términos obsoletos en `index.html`: `mesh`, `GWN7661`, `GWN7700`, `inyector`, `in-wall`, `costos.html`.
- `.docx`: ZIP válido, XML parseable, 3 tablas y 27 pasos; sin términos obsoletos.
- PDF copiado con hash idéntico al fuente.
- `git status`: solo `refactor-red-hibrida/` como nuevo; sin diff en los originales.

## Pendientes y supuestos

1. **Uplink GPON:** el plan no asigna puerto (deja 7–8 como reserva). Se usó **puerto 8 → GPON** y puerto 7 reserva; confirmar con el handoff real (si es SFP, usar SFP1).
2. **PDF de la guía:** el usuario debe regenerarlo desde Word. El PDF copiado sigue siendo el anterior.
3. **costos.html:** conserva el BOM viejo; actualizar en una fase posterior si se vuelve a enlazar.
4. **Prueba visual, licencia y pill:** las ejecuta el usuario en navegador.
5. **Tour/Piscina:** validar recorridos ≤ 90 m y capacidad (3 puertos libres en total).
6. **Mapa §6:** cuenta el apartamento principal como 1 TV. Si son 2 pantallas, rebalancear P2-B.

## Cómo probar

1. Abrir `refactor-red-hibrida/index.html` en el navegador.
2. Revisar nav de escritorio/móvil, candado de licencia, pill de días y ambos botones de descarga.
3. Abrir el `.docx` en Word y revisar las tablas de verificaciones y de puertos.
4. Regenerar el PDF de la guía desde Word.

> `config_session/memory.md` no se modificó por la restricción de no tocar archivos originales.
