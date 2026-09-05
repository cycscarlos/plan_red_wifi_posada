# Memory

## Contexto de la sesión

- Proyecto: Plan de implementación de redes Wi-Fi Online para Posada Casa Manantial

## Última actividad (sesión cerrada)

- La landing pasó de "Propuesta de servicios (Fase 1/2)" a **"Plan Técnico de Red Mesh GWN"**,
  redactada desde `docs/Plan Técnico de Red.txt` (mismo diagnóstico, solución reestructurada por SSIDs + mesh 5 GHz).
- Secciones nuevas: Resumen · Topología (5 nodos mesh) · Plan de canales (2.4 y 5 GHz) ·
  Guía GWN (3 pasos en acordeón) · Expansión In-Wall · CTA con descarga.
- Se reutilizaron todos los componentes y el CSS de la versión anterior; `js/main.js` quedó intacto.
- Se añadió CSS nuevo: `.nodes`/`.nodecard` (topología) y `.band__row` (plan de canales).

## Estructura actual del repo (reorganización del usuario)

- `index.html` enlaza `assets/css/styles.css`, `assets/js/main.js` y `assets/docs/Plan-Tecnico-de-Red.pdf`.
- `index_v.Original.html` = respaldo de la landing anterior (rutas actualizadas).
- `assets/propuesta_fase1_fase2.pdf` (propuesta vieja) eliminado; el documento activo es `assets/docs/Plan-Tecnico-de-Red.pdf`.

## Notas

- Checkpoint previo: `43a87bf`. Push y verificación en producción: los ejecuta el usuario.

## Despliegue (resuelto en esta sesión)

- `origin` = https://github.com/cycscarlos/plan_red_wifi_posada.git
- Remote se integró con `--force-with-lease` (la historia vieja en remoto fue reemplazada por la local).
- GitHub Pages ahora publica vía **GitHub Actions**: `.github/workflows/pages.yml`
  (deploy estático de `main`). El Source en Settings → Pages quedó en "GitHub Actions".
- Cualquier push a `main` redeploya automáticamente.

---