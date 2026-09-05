# Memory

## Contexto de la sesión

- Proyecto: Plan de implementación de redes Wi-Fi Online para Posada Casa Manantial

## Sesión actual: Premisas de diseño (11) incorporadas a informe y landing

- El usuario confirmó la síntesis de las 7 premisas y pidió cerrar ambigüedades:
  se incorporaron **11 reglas vinculantes** (01–11) en la landing y en el informe.
- Decisiones técnicas cerradas: **bandas fijas sin band steering** (SSID única por banda),
  **canales fijos 1/6/11 a 20 MHz** en 2.4G, **canal 36 único co-canal** en 5G (condición del
  mesh) con **802.11k/v activo** en Clientes, **802.11k/v/r OFF** en TV, **expansión in-wall 2+2**
  (2 GWN7661 iniciales + 2 solo si la medición en Fase 1 lo justifica), **potencia mínima en
  GWN7661** (2.4G radio OFF, 5G ~10–12 dBm solo como puente mesh; los TV van por LAN RJ45),
  Hide SSID + Client Isolation en TV-Manantial, sin tasas legacy (mín 12 Mbps OFDM),
  Multicast→Unicast, validación de cobertura 5G en campo, y VLAN opcional.
- Landing (`index.html`): nueva sección **02 · Premisas de diseño** (grid `.principles` con
  `.principle__icon--num`), anteriores secciones renumeradas 03–06, nav ampliado con "Premisas",
  lead de Topología corregido, tablas de canales con GWN7661 "Radio OFF"/"~10–12 dBm",
  Guía Pasos 1 y 2 con banda fija explícita, tarjetas In-Wall con potencia mínima y "Arranque 2 + 2".

## Estructura actual del repo (reorganización del usuario)

- `index.html` enlaza `assets/css/styles.css`, `assets/js/main.js` y
  `assets/docs/Plan-tecnico-red-wifi.pdf`.
- El informe fuente ahora es `assets/docs/Plan-tecnico-red-wifi.md` (+`.docx` y `.pdf` generados
  por el usuario desde ese texto). Se eliminaron `Plan-Tecnico-de-Red.pdf`, `Plan Técnico de Red.txt`
  e `index_v.Original.html`.
- El `.md` es el texto editable; el `.pdf`/`.docx` los regenera el usuario (no los edito).
- `assets/js/main.js` sigue intacto (IIFE ES5, no tocar).

## Notas

- Checkpoints: `43a87bf` y `e290496`. Push y verificación en producción: los ejecuta el usuario.

## Despliegue (resuelto en esta sesión)

- `origin` = https://github.com/cycscarlos/plan_red_wifi_posada.git
- Remote se integró con `--force-with-lease` (la historia vieja en remoto fue reemplazada por la local).
- GitHub Pages ahora publica vía **GitHub Actions**: `.github/workflows/pages.yml`
  (deploy estático de `main`). El Source en Settings → Pages quedó en "GitHub Actions".
- Cualquier push a `main` redeploya automáticamente.
- **Gotcha de upstream:** tras la integración forzada, `main` quedó **sin upstream registrado**;
  `git push` daba "no upstream branch". Solución: `git push --set-upstream origin main`
  (una sola vez); desde ahí `git push` normal funciona.

---