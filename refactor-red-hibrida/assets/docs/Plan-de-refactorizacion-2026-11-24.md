# Plan de refactorización — Red Híbrida TV/WiFi

**Proyecto:** Posada Casa Manantial — landing + documentos técnicos
**Fecha:** 24·11·2026
**Fuente autoritativa:** `assets/docs/Red Hibrida_TV_WiFi-24112026.pdf` (3 páginas, síntesis final)
**Estado:** propuesta para revisión. **No se ha modificado código ni documentos.**

---

## 1. Objetivo

Alinear el proyecto con la síntesis final del 24·11·2026:

1. Sustituir la malla inalámbrica por **backhaul cableado** a los 3 APs existentes, alimentados por un switch **GWN7701P** (PoE+).
2. Retirar los **3 inyectores PoE** individuales.
3. Reducir el BOM a **5× GWN7711 + 1× GWN7701P**, eliminando los **2× GWN7661 in-wall** y el **GWN7700**.
4. Corregir la narrativa de **VLANs**: red plana (VLAN 1) mientras el GPON entregue DHCP; VLAN 10/20 solo al insertar un router con soporte VLAN (GWN7001) antes del GWN7801.
5. Corregir el dato técnico de alimentación: **los TV se alimentan de 110 V, nunca por PoE**.

---

## 2. Alcance

### Dentro de esta fase

| Archivo | Acción |
|---|---|
| `index.html` | Refactor de contenido por secciones (hero, stats, resumen, premisas, topología, canales, guía, CTA, nav). |
| `assets/docs/Guia_Instalacion_Fisica_Backbone_Posada.docx` | Reescribir BOM, mapa de puertos, secuencia y pruebas. El usuario regenera el `.pdf` desde Word. |
| `assets/docs/Red Hibrida_TV_WiFi-24112026.pdf` | Fuente de verdad. **No se edita.** |

### Fuera de esta fase

| Archivo | Motivo |
|---|---|
| `costos.html` | El usuario indicó **sin costos**. Queda desalineado; ver §9. |
| `assets/docs/Plan-tecnico-red-wifi.docx/.pdf` | Documento anterior. No se toca; queda obsoleto frente a la síntesis. Ver §9. |
| `assets/css/styles.css` | No se requieren clases nuevas: se reutilizan `nodecard__tag--core`, `--master`, `band`, `principles`, `stage`, `stats`, `diagcard`. |
| `assets/js/main.js` | Sin cambios funcionales; los selectores actuales siguen sirviendo. |
| `assets/js/license.js` | Sin cambios; el candado y el pill de días no dependen del contenido. |
| `README.md` | Ya está desactualizado; no es parte del encargo. |
| `index_v.Original.html`, `trash/` | Respaldos/descartes. |

---

## 3. Delta de arquitectura (actual → síntesis)

### 3.1 Equipamiento

| Equipo | Actual | Nuevo (PDF) | Cambio |
|---|---:|---:|---|
| GWN7801 | 1 (core L2, sin PoE) | 1 (core) | Se mantiene. El PDF lo llama “Router y Switch”; ver nota §3.4. |
| GWN7711 | 6 | 5 | −1: desaparece la switch dedicada de UP-Cocina. |
| GWN7661 in-wall | 2 | 0 | −2: Tour y Piscina pasan a cable por GWN7711. |
| GWN7700 | 1 | 0 | −1: el apartamento principal se cablea a P2-B. |
| GWN7701P | 0 | 1 | +1: PoE+ 4 puertos, presupuesto 60 W. |
| GWN7660LR | 1 (máster) | 1 (máster) | Se mantiene; pasa a backhaul cableado. |
| GWN7630LR | 2 (esclavos) | 2 (esclavos) | Se mantienen; pasan a backhaul cableado. |
| Inyectores PoE | 3 | 0 | −3: los alimenta el GWN7701P. |

### 3.2 Esquema físico

```
GPON ISP (ARCOFER)
        │
   GWN7801 (core)
        ├── puertos 1–5 ──→ 5× GWN7711 ──→ TVs (110 V, datos por RJ45)
        └── puerto 6 ─────→ GWN7701P (PoE+ 60 W)
                                   └──→ GWN7660LR (máster) + 2× GWN7630LR (esclavos)
```

- **Puertos 1–5 del GWN7801:** PB, P1, P2-A, P2-B, Oficina.
- **Puerto 6:** GWN7701P → 3 APs cableados.
- **Puertos 7–8:** reserva.
- **GWN7701P:** 4 puertos PoE+ (802.3af/at), 60 W totales; 3 APs ≈ 39 W → sobra presupuesto. Se retiran los 3 inyectores.
- **Mesh:** se desactiva en el GWN7660LR tras cablear. Se conservan gestión centralizada y roaming.
- **TVs:** alimentación 110 V; el cable solo lleva datos.

### 3.3 VLANs (narrativa condicional)

| Escenario | Qué ocurre |
|---|---|
| **Hoy** (sin router VLAN entre GPON y GWN7801) | El GPON entrega DHCP (192.168.5.x) y no maneja múltiples VLAN. Toda la red opera en **VLAN 1 plana**. TVs y clientes Wi‑Fi salen a Internet sin problema. |
| **Con router VLAN** (GWN7001 antes del GWN7801) | Se activan **VLAN 10 (TV)** en puertos 1–5 del core y **VLAN 20 (APs)** en el puerto 6. No se cambia ningún cable. |

### 3.4 Nota de coherencia

El PDF lista “GWN7801 (Router y Switch)”, pero su propia sección 3 exige un **router con soporte VLAN (GWN7001)** antes del GWN7801. En la landing se describirá el GWN7801 como **switch core** y se dejará el GWN7001 como router opcional/futuro, para no prometer funciones que el equipo no cumple.

---

## 4. Refactor de `index.html`

### 4.1 Mapa de secciones

| Sección actual | Acción |
|---|---|
| `<head>` (title/description) | Actualizar a red híbrida con backbone cableado y APs cableados. |
| Nav (desktop/móvil) | Quitar **In-Wall**; conservar Resumen, Premisas, Topología, Canales, Guía. |
| Hero | Nuevo mensaje: cable para TVs y APs; mesh fuera; aire solo para huéspedes. |
| Stats | `1.800 m²` · `5` switches GWN7711 · `3` APs cableados · `0` saltos mesh. |
| Resumen / diagnóstico | Mantener causa raíz; actualizar solución y `diagcard`. |
| Premisas (13) | Reescribir 01–13 (§4.2). |
| Topología | Nuevo diagrama de nodos (§4.3). |
| Canales | Quitar filas de GWN7661; ajustar 5 GHz sin restricción de co‑canal mesh. |
| Guía (Pasos 00–03) | Reescribir con GWN7701P, mesh off y VLAN condicional (§4.4). |
| In-Wall (sección 06) | **Eliminar** junto con su ancla del nav. |
| CTA final | Actualizar copy y enlace de descarga (§8). |
| Footer | Sin cambios. |

### 4.2 Nuevas premisas (01–13)

1. **Todo lo fijo va por cable:** TVs por GWN7711 y APs por GWN7701P. La malla deja de transportar datos.
2. **Backbone UTP Cat.6e:** 5 switches de acceso GWN7711 para TV + 1 GWN7701P para APs.
3. **APs alimentados por GWN7701P:** PoE+ 60 W, 3 APs ≈ 39 W; se retiran los 3 inyectores. Los GWN7711 no alimentan APs.
4. **Dos SSID con bandas fijas:** TV-Manantial en 2.4 GHz; Clientes-Manantial en 5 GHz.
5. **2.4 GHz:** canales fijos 1/6/11 a 20 MHz (contingencia para TV por Wi‑Fi).
6. **5 GHz:** canal 36 (o 149/153 si el sitio lo exige) para clientes; sin restricción de co‑canal mesh porque los APs van cableados.
7. **Sin roaming en TV-Manantial:** 802.11k/v/r desactivado (contingencia).
8. **APs existentes cableados:** GWN7660LR máster + 2× GWN7630LR esclavos; mesh desactivada; gestión centralizada y roaming se mantienen.
9. **TV-Manantial oculta + Client Isolation** (contingencia).
10. **Sin tasas legacy:** mínimo 12 Mbps OFDM.
11. **Multicast → Unicast** habilitado.
12. **VLAN condicional:** VLAN 1 plana con el GPON; VLAN 10 (TV) / VLAN 20 (APs) solo al insertar un router VLAN (GWN7001) antes del GWN7801. Sin cambiar cableado.
13. **5 switches por zona:** PB, P1, P2‑A, P2‑B y Oficina; Tour/Piscina y UP‑Cocina se pliegan a la switch más cercana. TVs a 110 V.

### 4.3 Nuevos nodos de topología

| Nodo | Contenido |
|---|---|
| **GWN7801 · Core** | Puertos 1–5 → GWN7711; puerto 6 → GWN7701P; 7–8 reserva. VLAN condicional. |
| **GWN7711 · PB** | 6 TV PB + 1 TV Piscina = 7. |
| **GWN7711 · P1** | 6 TV P1 + 1 TV Piscina = 7. |
| **GWN7711 · P2‑A** | 5 TV Piso 2 + 2 TV Tour = 7. |
| **GWN7711 · P2‑B** | 4 TV Piso 2 + 1 apartamento principal + 1 TV Tour = 6 (1 libre). |
| **GWN7711 · Oficina** | 3 TV Oficina/Admin/Sala Social + 2 TV UP‑Cocina = 5 (2 libres). |
| **GWN7701P · PoE+** | 4 puertos PoE+ · 60 W · alimenta 3 APs · sin inyectores. |
| **GWN7660LR · Máster** | Cableado al GWN7701P; mesh off; controlador. |
| **GWN7630LR · Terraza y Piso 2** | Cableados al GWN7701P; mesh off; roaming. |

> El mapa exacto de Tour/Piscina queda **sujeto a validación de recorridos (≤ 90 m)**. Ver §12.

### 4.4 Guía de configuración (nuevos pasos)

- **Paso 00 — Core y switches:** puertos 1–5 Access VLAN 10 y puerto 6 Access VLAN 20 **solo si existe router VLAN**; si no, VLAN 1 plana. RSTP y Storm Control. GWN7701P alimenta los APs; retirar inyectores.
- **Paso 01 — SSIDs:** Clientes-Manantial 5 GHz; TV-Manantial 2.4 GHz (contingencia) con Hide SSID + Client Isolation.
- **Paso 02 — Radios y canales:** 2.4 GHz 1/6/11 a 20 MHz; 5 GHz canal 36 a 40 MHz; sin filas de in‑wall.
- **Paso 03 — Avanzados:** Multicast→Unicast, tasas legacy off, RSSI mínimo.
- **Paso 04 (nuevo) — Mesh off:** desactivar mesh en el GWN7660LR; verificar en GWN.Cloud que los 3 APs siguen Online, con gestión centralizada y roaming.

---

## 5. Refactor de `Guia_Instalacion_Fisica_Backbone_Posada`

### 5.1 Cambios de contenido

| Bloque | Cambio |
|---|---|
| Encabezado / equipos nuevos | `1× GWN7801` · `5× GWN7711` · `1× GWN7701P` · bobina Cat.6e. Quitar GWN7661 y GWN7700. |
| Equipos existentes | GWN7660LR + 2× GWN7630LR, ahora **cableados** al GWN7701P. |
| Verificaciones previas | Quitar el chequeo de inyectores; agregar PoE+ (60 W / 39 W), alimentación 110 V de TVs y router VLAN opcional. |
| Mapa de puertos | Core 1–5 → GWN7711; 6 → GWN7701P → 3 APs; 7–8 reserva. Quitar filas de in‑wall. |
| Troncales | 6 enlaces: 5 core→GWN7711 + 1 core→GWN7701P. |
| TV | 32 tendidos: 27 por GWN7711 + 5 plegados (Tour/Piscina según §12). |
| Secuencia | Reemplazar Fase E (in‑wall) por “APs cableados y mesh off”. |
| Pruebas bloqueantes | Punto 4 (VLAN) igual; punto 5 pasa a “3 APs cableados, mesh off, roaming OK”. |
| Cierre | Confirmar 32/32 TV por cable y APs cableados; sin referencia a inyectores. |

### 5.2 Nota de producción

El `.docx` es la fuente editable. El usuario regenera el `.pdf` desde Word (no hay LibreOffice en el entorno). El plan no genera el PDF final.

---

## 6. Mapa propuesto de 32 TV en 5 switches

| Switch | TVs | Total | Puertos |
|---|---|---:|---|
| GWN7711 PB | 6 habitaciones PB + 1 Piscina | 7 | Uplink 1; TV 2–8 |
| GWN7711 P1 | 6 habitaciones P1 + 1 Piscina | 7 | Uplink 1; TV 2–8 |
| GWN7711 P2‑A | 5 habitaciones P2 + 2 Tour | 7 | Uplink 1; TV 2–8 |
| GWN7711 P2‑B | 4 habitaciones P2 + 1 apartamento principal + 1 Tour | 6 | Uplink 1; TV 2–7; 1 libre |
| GWN7711 Oficina | 3 Oficina/Admin/Sala Social + 2 UP‑Cocina | 5 | Uplink 1; TV 2–6; 2 libres |
| **Total** | | **32** | Capacidad 35 (7 por switch) |

**Advertencia:** la capacidad es ajustada (3 puertos libres). Si un tendido Tour/Piscina supera 90 m o no es viable, hay que rebalancear zonas o evaluar una excepción (segunda switch/cascada), lo que contradiría el esquema de 5 switches del PDF.

---

## 7. Cambios en CSS/JS

- **CSS:** ninguno obligatorio. Se reutilizan las clases existentes. Si se quiere distinguir el GWN7701P, usar `nodecard__tag--master` (verde) o `--core` (ámbar).
- **JS:** ninguno. `main.js` enlaza acordeones `.stage`, nav móvil y reveals por selector; quitar la sección In‑Wall no rompe nada.
- **Licencia:** `license.js` intacto; el overlay y el pill siguen funcionando.

---

## 8. Enlace de descarga y documento vigente

Situación actual: los botones “Descargar plan” apuntan a `assets/docs/Plan-tecnico-red-wifi.pdf`, que quedará obsoleto.

Opciones para tu decisión:

- **A (recomendada):** enlazar los botones al PDF fuente `Red Hibrida_TV_WiFi-24112026.pdf` (copiarlo a un nombre URL‑safe, p. ej. `Red-Hibrida-TV-WiFi.pdf`, sin espacios).
- **B:** reemplazar el contenido de `Plan-tecnico-red-wifi.pdf` por la síntesis, archivando el anterior en `Versiones-anteriores/`.
- **C:** dejar el enlace actual (quedaría inconsistente con la landing).

---

## 9. Deuda fuera de alcance (visible)

- `costos.html` conserva el BOM viejo (GWN7661, GWN7711 ×6, $844.20). Al no tocarlo, la landing no debe prometer costos nuevos. **Recomendación:** quitar o desactivar el CTA “Costos de referencia” en `index.html` hasta actualizar costos (decisión en §13).
- `Plan-tecnico-red-wifi.docx/.pdf` describe mesh, in‑wall y VLAN definitivas. Queda superado por la síntesis; conviene archivarlo en `Versiones-anteriores/` en una fase posterior.
- `README.md` sigue describiendo Netlify/Vercel y rutas inexistentes; no se toca.

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Capacidad de 5 GWN7711 (7 TV c/u) | Alto: 32 TV caben con solo 3 puertos libres | Validar mapa y recorridos en sitio antes de tender; rebalancear si falla. |
| Tour/Piscina sin in‑wall | Alto: requieren tendedero nuevo y ≤ 90 m | Medir recorridos; si no es viable, detenerse y decidir excepción con el usuario. |
| VLANs no activables con GPON | Medio: la landing no debe prometer segmentación | Redactar VLAN como condicional y dejar el GWN7001 como opción futura. |
| “GWN7801 Router y Switch” en el PDF | Medio: confusión de rol | Describirlo como switch core; router VLAN (GWN7001) aparte. |
| GWN7701P: 4 puertos PoE+, 60 W | Medio: verificar datasheet | Confirmar modelo/presupuesto; 3 APs ≈ 39 W deja margen. |
| TVs “alimentados por PoE” | Alto: error técnico | Redactar 110 V + datos RJ45 en landing y guía. |
| Documentos viejos inconsistentes | Medio | Archivarlos o desvincularlos (§8, §9). |
| Pérdida de licencia/pill | Bajo | No se toca `license.js`; verificación visual final. |

---

## 11. Secuencia de implementación (cuando autorices)

1. **Checkpoint** `checkpoint: pre-refactor red híbrida (síntesis 24-11-2026)`.
2. Refactor de `index.html` (hero → CTA, quitar In‑Wall, actualizar nav).
3. Actualizar `Guia_Instalacion_Fisica_Backbone_Posada.docx`.
4. Ajustar enlace(s) de descarga según §8.
5. Verificación técnica: `node --check assets/js/main.js` (sin cambios), revisión de anclas/nav, ausencia de términos obsoletos (`mesh`, `GWN7661`, `GWN7700`, `inyector`).
6. **Tú** regeneras el PDF de la guía desde Word y haces la prueba visual en navegador.
7. Actualizar `config_session/memory.md` y commit final.

---

## 12. Criterios de aceptación

- `index.html` no menciona mesh como transporte, ni GWN7661, ni GWN7700, ni inyectores PoE, ni VLANs definitivas.
- La landing refleja: GWN7801 core · 5× GWN7711 · 1× GWN7701P · 3 APs cableados · TVs a 110 V.
- La guía coincide con el BOM y el mapa de puertos.
- El nav y el menú móvil funcionan sin la sección In‑Wall.
- El candado de licencia y el pill de días siguen operativos.
- No se modifica `costos.html`, `styles.css` ni el JS funcional.

---

## 13. Decisiones abiertas para tu revisión

1. **Enlace de descarga:** ¿opción A, B o C de §8?
2. **CTA “Costos de referencia”:** ¿se quita de la landing mientras `costos.html` esté desactualizado?
3. **Mapa Tour/Piscina:** ¿apruebas el reparto de §6 o prefieres otro?
4. **`Plan-tecnico-red-wifi.*`:** ¿se archiva en `Versiones-anteriores/` en esta fase o después?
5. **GWN7001:** ¿se menciona como router VLAN opcional/futuro o se omite de la landing?
