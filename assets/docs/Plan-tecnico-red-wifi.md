# Plan Técnico de Ingeniería de Redes

- **Cliente:** Posada Casa Manantial (Chichiriviche, Falcón, Venezuela)
- **Infraestructura:** 1.800 m², a 50 m del mar | 31 Smart TV (Google OS / Android TV)
- **Elaborado por:** Ing. Carlos Colmenares A. — CYCS & Co. Ingeniería de Redes

---

## 1. Resumen Ejecutivo y Diagnóstico Confirmado

El problema principal no radica en una falta de cobertura general ni en fallas del proveedor de
Internet (ISP). Las pruebas de campo aislaron la causa raíz: **31 Smart TV con tarjetas Wi-Fi
genéricas (limitadas exclusivamente a 2.4 GHz) compitiendo por solo 3 canales sin solape
(1, 6 y 11) bajo selección automática de canal**.

La solución estructura el aire en **dos SSID segmentadas** y un **despliegue condicional en dos
fases**:

- **SSID `Clientes-Manantial`:** operación **exclusiva en 5 GHz** para smartphones y laptops.
- **SSID `TV-Manantial`:** operación **exclusiva en 2.4 GHz**, dedicada únicamente a los Smart TV
  que no puedan ser cableados.
- **Fase 1 (Software):** plan manual de canales, ancho de canal de 20 MHz, eliminación de tasas
  legacy (802.11b) y parámetros avanzados, sobre la infraestructura actual.
- **Fase 2 (Hardware / In-Wall):** despliegue de APs GWN7661 en extremos de pasillos para cablear
  de forma directa los TV adyacentes por puerto RJ45, derivando el tráfico a un salto inalámbrico
  en 5 GHz hacia los APs GWN7630LR.

---

## 2. Premisas de Diseño (definitivas y vinculantes)

Estas reglas **cierran cualquier ambigüedad** y son de cumplimiento **obligatorio** en la
implementación. Lo que no esté aquí, no se asume.

| # | Premisa |
|---|---------|
| **01** | **Dos SSID · bandas fijas.** `TV-Manantial` solo en 2.4 GHz; `Clientes-Manantial` solo en 5 GHz. Sin band steering ni cambio de banda entre frecuencias. |
| **02** | **Canales fijos en 2.4 GHz:** 1 / 6 / 11, uno por AP, bajo plan manual. **Ancho de canal 20 MHz** (el menor disponible, el que menos se solapa con las tres celdas). Sin canal automático. |
| **03** | **5 GHz: canal 36 único y co-canal** para el backhaul mesh y los clientes. Esta es la condición de diseño de la malla: canales distintos por AP romperían el enlace mesh. Fast roaming **802.11k/v activo** en `Clientes-Manantial` para la movilidad de móviles. |
| **04** | **Sin roaming en `TV-Manantial`:** **802.11k/v/r desactivado** — los TV son fijos y no deben sondear saltos de AP. |
| **05** | **Expansión In-Wall 2 + 2:** se despliegan **2 GWN7661** (6 TV cableados). Se autorizan **2 unidades más, y solo** si la medición tras la Fase 1 las justifica. Nunca por adelantado. |
| **06** | **Potencia mínima en los GWN7661:** **2.4 GHz apagado** (radio OFF) y 5 GHz al **mínimo que sostenga el enlace (~10–12 dBm)** para no ensuciar el espectro. Los TV conectados a este AP van por los **puertos LAN RJ45, no por Wi-Fi**; el 5 GHz solo actúa como puente mesh hacia la malla. |
| **07** | **`TV-Manantial` oculta (Hide SSID) + Client Isolation:** solo lo ven los TV autorizados y los TV no se comunican entre sí. |
| **08** | **Sin tasas legacy en 2.4 GHz:** se desactivan 1 / 2 / 5.5 / 11 Mbps (802.11b/CCK) y se fija la **tasa mínima en 12 Mbps (OFDM)** — un cliente lento y lejano no puede congelar el tiempo de aire. |
| **09** | **Multicast → Unicast activado:** se elimina el broadcast inútil en el streaming de TV. |
| **10** | **Validación en campo obligatoria:** medir cobertura **5G interior** de `Clientes-Manantial` (banda fija). **Plan B si una zona no alcanza:** AP adicional, sin cambiar las bandas fijas. |
| **11** | **Endurecimiento opcional:** separación por **VLAN** entre huéspedes (`Clientes-Manantial`) y TV si se desea aislarlos por red (no incluido en el alcance base). |

---

## 3. Matriz de Inventario y Topología Mesh

| Equipo AP | Rol en la Red | Form Factor / Antenas | Conectividad de Backhaul |
|---|---|---|---|
| **GWN7660LR** | AP Máster (Controlador) | Exterior Long Range (2×2:2) | Cableado Gigabit PoE+ al Switch del ISP |
| **GWN7630LR (Nodo 1)** | AP Esclavo Exterior (Terraza) | Exterior Long Range (4×4:4) | Inalámbrico Mesh 5 GHz (1 salto al Máster) |
| **GWN7630LR (Nodo 2)** | AP Esclavo Exterior (Piso 2) | Exterior Long Range (4×4:4) | Inalámbrico Mesh 5 GHz (1 salto al Máster) |
| **GWN7661 (Extensión 1)** | In-Wall / Switch Pasillo A | Interior de Pared (2×2:2) | Mesh 5 GHz (1 salto a GWN7630LR) + 3 TV cableados RJ45 |
| **GWN7661 (Extensión 2)** | In-Wall / Switch Pasillo B | Interior de Pared (2×2:2) | Mesh 5 GHz (1 salto a GWN7630LR) + 3 TV cableados RJ45 |

> **Nota:** las extensiones 3 y 4 (GWN7661 adicionales) son **opcionales** y dependen del resultado
> de la medición tras la Fase 1 (premisa 05).

---

## 4. Plan de Asignación de Canales y Potencias

### A. Banda de 2.4 GHz — SSID `TV-Manantial`

**Ancho de canal: 20 MHz (estricto).** Sin selección automática.

| Punto de Acceso | Canal Fijo (2.4 GHz) | Tx Power | Uso / Propósito |
|---|---|---|---|
| GWN7660LR (Máster) | Canal 1 | Medium-High (~18 dBm) | Cobertura TV zona central |
| GWN7630LR (Terraza) | Canal 6 | Medium-High (~18 dBm) | Cobertura TV zona terraza |
| GWN7630LR (Piso 2) | Canal 11 | Medium-High (~18 dBm) | Cobertura TV zona alta |
| GWN7661 (Pasillos) | **Radio 2.4 GHz APAGADO** | — | Los TV adyacentes van por cable RJ45 |

### B. Banda de 5 GHz — SSID `Clientes-Manantial` + Backhaul Mesh

**Ancho de canal: 40 MHz** (balance óptimo entre penetración y throughput).
**Canal único: 36** — co-canal, condición del mesh (premisa 03).

| Punto de Acceso | Canal Fijo (5 GHz) | Tx Power | Uso / Propósito |
|---|---|---|---|
| GWN7660LR (Máster) | Canal 36 (UNII-1) | High (~23 dBm) | Backhaul mesh + clientes móviles |
| GWN7630LR (Terraza) | Canal 36 (co-canal) | High (~22 dBm) | Enlace mesh + clientes móviles |
| GWN7630LR (Piso 2) | Canal 36 (co-canal) | High (~22 dBm) | Enlace mesh + clientes móviles |
| GWN7661 (Pasillos) | Canal 36 (auto-mesh) | **Mínimo (~10–12 dBm)** | Salto único mesh + potencia mínima |

---

## 5. Guía Paso a Paso para la Configuración en Grandstream GWN

### Paso 1 — SSIDs y segmentación

1. Ingrese al panel del GWN7660LR (Máster) o a GWN Cloud.
2. Vaya a **Network Group > Wi-Fi Basic Settings**.
3. **SSID 1 — `Clientes-Manantial`:**
   - SSID Band: **5 GHz Only** (banda fija — no se permite la opción 2.4G/5G ni band steering).
   - WPA Key: clave de huéspedes.
   - Enable 802.11k/v (Fast Roaming): **Activado** (premisa 03).
4. **SSID 2 — `TV-Manantial`:**
   - SSID Band: **2.4 GHz Only** (banda fija).
   - Hide SSID: **Habilitado** (premisa 07).
   - Client Isolation: **Habilitado** (premisa 07).
   - Enable 802.11k/v/r: **Desactivado** — los TV son fijos (premisa 04).

### Paso 2 — Ajuste físico de radios y canales

1. Vaya a **Access Points** > seleccione el AP > **Configuration**.
2. **Radio 2.4G:**
   - Channel Width: **20 MHz** (premisa 02).
   - Channel: Canal 1 (Máster), 6 (Terraza), 11 (Piso 2) — **sin canal automático**.
   - Tx Power: Custom > **18 dBm**.
3. **Radio 5G:**
   - Channel Width: **40 MHz**.
   - Channel: **Canal 36 fijo** (co-canal del mesh, premisa 03).
   - Tx Power: Custom > **22–23 dBm** (APs Long Range).
4. **GWN7661 (In-Wall):** radio 2.4 GHz **apagado** y 5 GHz al **mínimo** (~10–12 dBm, premisa 06).

### Paso 3 — Depuración de tasas legacy y parámetros avanzados

1. Vaya a **Wi-Fi Settings > Advanced Settings**.
2. **Multicast to Unicast: Habilitado** (premisa 09).
3. **Supported Data Rates (2.4 GHz):** desactivar 1, 2, 5.5 y 11 Mbps (CCK / 802.11b) y fijar la
   tasa mínima obligatoria en **12 Mbps (OFDM)** (premisa 08).
4. **Minimum RSSI:** -80 dBm en 2.4 GHz · -75 dBm en 5 GHz.

---

## 6. Estrategia de Implementación de los APs GWN7661 In-Wall

- **Ubicación:** extremos de pasillos o áreas alejadas de los APs Long Range.
- **Alimentación:** inyector PoE conectado a un puerto WAN/PoE-In local.
- **Enlace:** el AP descubre al Máster y establece mesh de **salto único en 5 GHz** con el
  GWN7630LR más cercano, a **potencia mínima** (premisa 06).
- **Cableado:** hasta **3 Smart TV** por unidad vía puertos LAN Gigabit (UTP estándar).
- **En los TV:** se deshabilita la interfaz Wi-Fi y se activa Ethernet.
- **Radio 2.4 GHz del GWN7661: apagada** (premisa 06).
- **Resultado:** el 100% del tráfico de los TV de esa zona sale por cable: cero ruido en 2.4 GHz
  y streaming continuo.
- **Cantidad:** 2 unidades en el alcance base; **2 opcionales** solo si la medición tras la
  Fase 1 las justifica (premisa 05). La Fase 2 no se cotiza, compra ni ejecuta por adelantado.

---

## 7. Validación en Campo y Endurecimiento

1. **Cobertura 5G interior:** medir `Clientes-Manantial` en habitaciones y pasillos con banda
   fija. **Plan B:** AP adicional en la zona floja (sin modificar las bandas fijas).
2. **Cierre por datos:** repetir las pruebas en los mismos puntos documentados (antes / después).
3. **Endurecimiento opcional:** separación por **VLAN** entre huéspedes y TV si se requiere
   mayor aislamiento (fuera del alcance base).