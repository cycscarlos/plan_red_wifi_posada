# Memory

## Contexto de la sesión

- Proyecto: Plan de implementación de redes Wi-Fi Online para Posada Casa Manantial

## Sesión actual: Landing simple en `refactor-red-hibrida/` (24·11·2026)

- El usuario autorizó una copia aislada en `refactor-red-hibrida/` y pidió **no tocar originales**.
- Primero se hizo un refactor complejo (commit `089393a`), pero el usuario lo encontró demasiado
  cargado: quería una **landing sencilla** basada en el PDF `Red Hibrida_TV_WiFi-24112026.pdf`
  (equipamiento, APs al GWN7701P, esquema físico y VLANs), con el mismo formato visual.
- Se reescribió `refactor-red-hibrida/index.html` (commit `91d7594`) con 5 secciones + CTA de
  descarga; se agregó el componente `.flow` en `assets/css/styles.css` (diagrama HTML responsive,
  las ramas se apilan en móvil). Se mantuvieron `main.js`, `license.js` y el candado.
- Corrección mantenida: los TV van a **110 V**; el cable UTP solo lleva datos (el PDF dice PoE por error).
- VLANs condicionales: hoy red plana con DHCP del GPON (192.168.5.x); con router VLAN (GWN7001)
  se activan VLAN 10 (TV, puertos 1–5) y VLAN 20 (APs, puerto 6) sin cambiar cableado.
- `costos.html`, el docx de guía y versiones anteriores quedan como material interno sin enlace.
- Verificado: HTML balanceado, anclas OK, 6 tarjetas, 4 stats, 5 diagcards, 6 nodos de flujo,
  2 enlaces al PDF, `node --check` OK, originales intactos. El usuario probó y aprobó sin cambios.
- Pendiente: push (usuario); si se publica la carpeta, retirar el material interno (`costos.html`,
  docx, xlsx) para no exponerlo por URL directa.

## Sesión previa: Solución híbrida (backbone + mesh 5 GHz) + costos $844.20 + reorganización docs

- **La solución es HÍBRIDA** (decisión del usuario, no "todo cable"): backbone UTP Cat.6e para TV
  fijos + la malla mesh 5 GHz que ya existe (GWN7660LR máster / GWN7630LR Terraza y Piso 2) +
  segmentación SSID/VLAN. Mensaje recalibrado en landing y docx: sin protagonismo del número de TV
  (el conteo 31→32 queda SOLO como dato técnico de contexto).
- Inventario autorizado (desde `assets/docs/Habitaciones-TV.xlsx` del usuario): **29 unidades / 32 TV**
  (22 habitaciones + 7 apartamentos + 3 áreas de servicio). El 32.º TV = 2 pantallas en el
  apartamento principal del Piso 2. El usuario pidió **cero referencias a personas** en documentos
  profesionales (nada de "dueño"/"propietario": se usa "apartamento principal").
- **Equipamiento definitivo (sin PoE en switchs; APs con su inyector 110 VAC local)**:
  core **GWN7801 ×1** (8 GE + 2 SFP) · acceso **GWN7711 ×6 @ $26.00** (PB, P1, P2-A, P2-B, Oficina,
  UP-Cocina) · in-wall **GWN7661 ×2** (Tour 3 TV, Piscina 2 TV + 1 puerto libre) · switch básico
  **GWN7700** en el apartamento principal (2 TV) · máster GWN7660LR + mesh GWN7630LR (existentes).
  Los AP mesh **nunca** se alimentan de un switch.
- **Costos.xlsx del usuario (costos3) → `costos.html` actualizado**: GWN7801 ×1 $175.50 · GWN7711 ×6
  $26.00 c/u = $156.00 · GWN7661 ×2 $181.35 c/u = $362.70 · Bobina Cat.6e $100.00 · Accesorios $50.00
  → **Subtotal $844.20** · Mano de obra **A convenir**. Fecha de vigencia 05·09·2026.
- Arquitectura: **core 7/8 puertos usados** (1 ISP · 2 máster trunk · 3 PB · 4 P1 · 5 P2-A · 6 P2-B ·
  7 Oficina · 8 reserva). **UP-Cocina no va al core**: cuelga en cascada del GWN7711 de Oficina.
  Los 2 TV re-parcheados de P2 van al GWN7711 de P2 (no al core).
- **Premisas 01–13** (docx + landing). Premisa 01 = "Solución híbrida: dos vías de tráfico". Se
  eliminó la expansión in-wall "2+2" (quedan 2 GWN7661 definitivos).
- **Reorganización del usuario**: los respaldos/versiones viejas van a
  `assets/docs/Versiones-anteriores/` (Costos_reales.xlsx, Opinión de IA Gemini.txt,
  Plan-tecnico-red-wifi.pdf viejo, Plan-tecnico-red-wifi_v.Original.pdf, Tabla_productos.json).
  `.gitignore` cubre `assets/docs/**/Tabla_productos.json` (evidencia, no se commitea).
  El PDF vigente `assets/docs/Plan-tecnico-red-wifi.pdf` lo regenera el usuario desde el docx (Word).
- El docx se edita vía zip→XML→zip (generador Node en `C:\Users\zcoder\AppData\Local\Temp\opencode\build\gen.js`,
  estilos Ttulo1/Ttulo2/Compact/FirstParagraph + tablas `Table`); luego el usuario regenera el PDF.
- Landing `index.html`: hero híbrido ("Cable para los TV fijos. Mesh 5 GHz para el resto. El aire
  segmentado."), stats sin conteo de TV (1800 m² · 2 SSID · 2 vías · 5 GHz), premisas 01–13,
  topología "Cable y mesh 5 GHz: dos vías, un plan", sección in-wall Tour/Piscina. `costos.html`
  con CTA "Costos de referencia".

## Sesión previa: Candado de licencia AuthCenter (producto MANANTIAL) + pill de días

- La landing y `costos.html` quedan **protegidas** con licencia por tiempo validada contra
  AuthCenter (emisor central de licencias), **sin BDD local**: caché en `localStorage`.
- **Nuevo `assets/js/license.js`** (IIFE ES5, como `main.js`): overlay opaco + modal
  "Activar Licencia" (clave → `POST validate-license`), revalidación cada 24 h, gracia
  offline 72 h, fail-closed. Se carga al inicio de `<body>` en ambas páginas (caché compartida).
- **Pill fija discreta** (`.license-pill`, top: 84px para no tapar el nav 72px): muestra
  `Licencia activa · N días · expira DD/MM/YYYY`; se oculta con el candado.
- Producto **MANANTIAL creado en AuthCenter** (activo=true, 05·09·2026) + secreto
  `LICENSE_SECRET_MANANTIAL` (hex64) configurado en Supabase + clave de prueba emitida y
  probada con éxito por el usuario. URL de validación usada:
  `https://ijvevdplnovkewxifpmf.supabase.co/functions/v1/validate-license`.
- `assets/docs/Tabla_productos.json` (evidencia del alta) **gitignoreado** (no se commitea).
- **Límite aceptado por el usuario:** candado 100% cliente = eludible por URL directa del PDF
  (GitHub Pages); es gestión de acceso, no cifrado. "Nada es gratis": sin vista libre.

## Sesión actual: Premisas de diseño (11) incorporadas a informe y landing

- El usuario confirmó la síntesis de las 7 premisas y pidió cerrar ambigüedades:
  se incorporaron **11 reglas vinculantes** (01–11) en la landing y en el informe.
- Decisiones técnicas cerradas: **bandas fijas sin band steering** (SSID única por banda),
  **canales fijos 1/6/11 a 20 MHz** en 2.4G, **canal 36 único co-canal** en 5G (condición del
  mesh) con **802.11k/v activo** en Clientes, **802.11k/v/r OFF** en TV, **expansión in-wall 2+2**
  (2 GWN7661 iniciales + 2 solo si la medición en Fase 1 lo justifica), **potencia mínima en
  GWN7661** (2.4G radio OFF, 5G ~10–12 dBm solo como puente mesh; los TV van por LAN RJ45),
  Hide SSID + Client Isolation en TV-Manantial, sin tasas legacy (mín 12 Mbps OFDM),
  Multicast→Unicast y validación de cobertura 5G en campo.
- Landing (`index.html`): nueva sección **02 · Premisas de diseño** (grid `.principles` con
  `.principle__icon--num`), anteriores secciones renumeradas 03–06, nav ampliado con "Premisas",
  lead de Topología corregido, tablas de canales con GWN7661 "Radio OFF"/"~10–12 dBm",
  Guía Pasos 1 y 2 con banda fija explícita, tarjetas In-Wall con potencia mínima y "Arranque 2 + 2".

## Estructura actual del repo (reorganización del usuario)

- `index.html` enlaza `assets/css/styles.css`, `assets/js/main.js` y
  `assets/docs/Plan-tecnico-red-wifi.pdf`.
- El informe fuente ya **no es el `.md`**: el usuario eliminó `Plan-tecnico-red-wifi.md` y designó
  **`assets/docs/Plan-tecnico-red-wifi.docx` como fuente editable** del informe; el `.pdf` se
  regenera desde el `.docx`. Verdad vigente desde commit `2e33890` (baja del `.md`).
- Se eliminaron `Plan-Tecnico-de-Red.pdf`, `Plan Técnico de Red.txt` e `index_v.Original.html`.
- `assets/js/main.js` sigue intacto (IIFE ES5, no tocar).
- `assets/docs/Opinión de IA Gemini.txt`: opinión de IA externa = base de la mejora con switch.

## Sesión actual: Switch GWN7801P + Segmentación L2 (recomendación Gemini)

- Incorporado al informe (docx/pdf, verificado internamente) y a la landing:
  switch GWN7801P definitivo en Fase 1 (matriz de inventario + topología, 8× PoE+ 120W, 2× SFP);
  **Premisa 11 pasa a DEFINITIVA** (VLAN 10 = Clientes/5 GHz · VLAN 20 = TV/2.4 GHz + LAN GWN7661 ·
  VLAN 1 = gestión; mDNS TV confinado en VLAN 20, con **nota de casting**);
  **Paso 0** en la guía (VLANes, Access/Uplink al router, Trunk 802.1Q al máster, Storm Control en
  VLAN 20, vínculo de SSIDs); **contingencia de canal**: si 36–40 saturado por APs vecinos, el
  co-canal mesh se mueve a 149/153 (40 MHz) — nota en premisa 03 y plan de canales.
- Landing: tarjeta ámbar `GWN7801P · Core·L2` en topología (`.nodecard__tag--core`), diagcard con
  "Switch core", guía con Paso 00, premisas 03/11 actualizadas, nota de validación del canal.

## Sesión actual: Página de costos independiente (agnóstica a costos)

- La landing queda **100% agnóstica de costos**; se creó `costos.html` (raíz, misma identidad visual,
  reúsa `assets/css/styles.css` + `assets/js/main.js`) con **CTA "Costos de referencia"** en la
  sección final de la landing (sub-total de equipamiento sin leyenda "sin mano de obra": solo "USD").
- Reglas de contenido: montos **solo en USD + fecha de vigencia** (05·09·2026); equivalencia en Bs
  **solo por contacto** (inflación en $ y Bs). Desglose = **Equipamiento** (con sub-total) +
  **Mano de obra → "A convenir"**. Nada más.
- Equipamiento cotizado (desde `assets/docs/Costos.xlsx` del usuario): AP GWN7661 ×2 @ $139.50
  (= $279.00) · Switch GWN7801P ×1 @ $208.50 · Bobina UTP Cat.6e @ $100.00 → **Subtotal $587.50**.
  Mano de obra: **A convenir**. Los AP **GWN7660LR/GWN7630LR ya existen y operan → no se cotizan**.
- Sin CTA de cotización directo en la página de costos: solo informa; el contacto se gestiona aparte.
- `.gitignore` ahora ignora también `assets/docs/Tabla_productos.json`; `Costos.xlsx` queda trackeado.

## Notas

- Checkpoints: `43a87bf`, `e290496`, `933ed9e`, `53c93a4`, `cff0e50` (diseño backbone + GWN7711 ×6 +
  cobertura 32 TV + cascada zona trasera). Finales: `2e33890`, `35ca8e4`, `5c5e871`, `a60f861`,
  `7e1edec`, `b5aab6a`, `67b26df` (candado + pill) y el de esta sesión (solución híbrida + costos
  $844.20 + reorganización `Versiones-anteriores/`). Push y verificación en producción: el usuario.

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