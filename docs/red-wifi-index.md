## Diagnóstico Confirmado y Estrategia de Red

Solución de fondo para la saturación de 2.4 GHz en Smart TV

Fase 1

### Optimización de Software (Inmediata)

* **Segmentación de SSIDs:**
  `Clientes-Manantial` (5 GHz) para móviles/laptops y `TV-Manantial` (2.4 GHz) exclusiva para Smart TV.
* **Plan Manual de Canales:**
  Asignación fija (1, 6 y 11 en 20 MHz) desactivando la selección automática para evitar interferencias.
* **Depuración de Tasas Legacy:**
  Eliminación del protocolo 802.11b (tasa mínima 12 Mbps) para liberar tiempo de aire.
* **Validación con Datos:**
  Medición en horas de alta ocupación para verificar la reducción del buffering.

Fase 2

### Expansión In-Wall GWN7661 (Estructural)

* **Nodos In-Wall de Pasillo:**
  Instalación de APs GWN7661 conectados vía Mesh de 5 GHz en 1 solo salto a los GWN7630LR.
* **Conexión Cableada a Televisores:**
  Cableado UTP directo desde el switch interno del AP hacia 3 Smart TV adyacentes por puerto RJ45.
* **Cero Ruido Inalámbrico:**
  Retiro definitivo de los televisores de la banda de 2.4 GHz en las zonas intervenidas.
* **Streaming Continuo:**
  Garantía de cero interrupciones mediante enlace gigabit físico local.