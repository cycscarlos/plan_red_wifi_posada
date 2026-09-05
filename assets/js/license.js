/* ==========================================================================
   LICENSE GATE - Posada Casa Manantial (producto: MANANTIAL)
   Candado de licencia por tiempo validado contra AuthCenter.
   Estilo: IIFE ES5, sin imports ni transpilación (igual que main.js).
   Sin BDD: la caché vive en localStorage del navegador.
   Política (espejo de AutoStock / authcenter-client):
     - Validación contra AuthCenter cada vez que la caché tiene > 24 h.
     - Caché reciente (< 24 h) y estado "activa" => acceso directo.
     - Gracia offline 72 h desde la última validación si el centro no responde.
     - Fail-closed: sin licencia, rechazada o fuera de gracia => candado.
   ========================================================================== */

(function (document, window) {
  "use strict";

  var AUTHCENTER_URL =
    "https://ijvevdplnovkewxifpmf.supabase.co/functions/v1/validate-license";
  var PRODUCTO = "MANANTIAL";
  var STORE_KEY = "manantial_licencia_v1";

  var DIA_MS = 24 * 3600 * 1000;
  var REVALIDAR_MS = DIA_MS; // revalidar cada 24 h
  var GRACIA_MS = 72 * 3600 * 1000; // 72 h de gracia offline

  /* ---------------- caché local (localStorage) ---------------- */
  function leerCache() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function escribirCache(campo, valor) {
    var cache = leerCache() || {};
    cache[campo] = valor;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(cache));
    } catch (e) {
      /* almacenamiento no disponible */
    }
  }

  /* ---------------- utilidades de fecha ---------------- */
  function diasRestantes(expiresAt) {
    if (!expiresAt) return null;
    var fin = Date.parse(String(expiresAt) + "T23:59:59Z");
    if (isNaN(fin)) return null;
    return Math.ceil((fin - Date.now()) / DIA_MS);
  }

  function fechaLegible(expiresAt) {
    if (!expiresAt) return "";
    var partes = String(expiresAt).split("-");
    if (partes.length !== 3) return "";
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  /* ---------------- llamada a AuthCenter ---------------- */
  // Resuelve { ok:true, json } | { ok:false, red:true, http }
  function validarRemotamente(licenseKey) {
    return fetch(AUTHCENTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        producto: PRODUCTO,
        license_key: licenseKey
      })
    })
      .then(function (res) {
        if (!res.ok) {
          return { ok: false, red: true, http: res.status };
        }
        return res
          .json()
          .then(function (json) {
            return { ok: true, json: json };
          })
          .catch(function () {
            return { ok: false, red: true, http: -1 };
          });
      })
      .catch(function () {
        return { ok: false, red: true, http: -1 };
      });
  }

  /* ---------------- mensajes por estado del servidor ---------------- */
  var MENSAJES = {
    formato_invalido:
      "La clave parece incompleta. Verifica el formato XXXX-XXXX-XXXX-XXXX-XXXX.",
    producto_invalido: "Código de producto inválido. Contacta a CYCS & Co.",
    producto_inactivo: "El producto está desactivado. Contacta a CYCS & Co.",
    firma_invalida: "Clave inválida. Verifícala e inténtalo de nuevo.",
    desconocida: "La clave no existe o no corresponde a este proyecto.",
    revocada: "La licencia fue revocada. Contacta a CYCS & Co.",
    pendiente: "La licencia aún no tiene fecha de inicio.",
    programada: "La licencia todavía no está activa (programada).",
    expirada: "La licencia ha expirado. Solicita una renovación.",
    error_red:
      "No se pudo validar la licencia. Revisa tu conexión e inténtalo de nuevo."
  };

  function mensajeEstado(estado) {
    return MENSAJES[estado] || "La licencia no pudo ser validada.";
  }

  /* ---------------- evaluación de acceso (fail-closed) ---------------- */
  function evaluarPermiso() {
    var ahora = Date.now();
    var cache = leerCache();

    if (!cache || !cache.license_key) {
      return Promise.resolve({
        permitido: false,
        razon: "sin_licencia",
        estado: null,
        expires_at: null
      });
    }

    var validadoEn = Date.parse(cache.validado_en || "");
    var validadoReciente = !isNaN(validadoEn) && ahora - validadoEn < REVALIDAR_MS;

    // Caché reciente y estado activa: acceso sin llamar al centro.
    if (validadoReciente && cache.ultimo_estado === "activa") {
      return Promise.resolve({
        permitido: true,
        razon: "activa_cache",
        estado: "activa",
        expires_at: cache.expires_at || null
      });
    }

    // Fuera de la ventana de 24 h: validar contra AuthCenter.
    return validarRemotamente(cache.license_key).then(function (res) {
      var expiresAt = res.json && res.json.expires_at ? res.json.expires_at : null;

      if (res.ok) {
        escribirCache("ultimo_estado", res.json.estado);
        escribirCache("validado_en", new Date().toISOString());

        if (res.json.estado === "activa") {
          return {
            permitido: true,
            razon: "activa",
            estado: "activa",
            expires_at: expiresAt
          };
        }
        return {
          permitido: false,
          razon: "rechazo_firme",
          estado: res.json.estado,
          expires_at: expiresAt
        };
      }

      // Centro no alcanzable: gracia 72 h desde la última validación.
      if (
        !isNaN(validadoEn) &&
        ahora - validadoEn <= GRACIA_MS &&
        cache.ultimo_estado === "activa"
      ) {
        return {
          permitido: true,
          razon: "gracia_offline",
          estado: "activa",
          expires_at: cache.expires_at || null
        };
      }
      return {
        permitido: false,
        razon: "offline_sin_gracia",
        estado: null,
        expires_at: null
      };
    });
  }

  /* ---------------- activación con clave del usuario ---------------- */
  function activarClave(key) {
    return validarRemotamente(key).then(function (res) {
      if (!res.ok) {
        return { ok: false, estado: "error_red" };
      }
      var json = res.json;
      var estado = json.estado || "desconocida";

      if (json.valida === true && estado === "activa") {
        escribirCache("license_key", key);
        escribirCache("expires_at", json.expires_at || null);
        escribirCache("ultimo_estado", "activa");
        escribirCache("validado_en", new Date().toISOString());
        return { ok: true, estado: "activa" };
      }

      escribirCache("ultimo_estado", estado);
      escribirCache("validado_en", new Date().toISOString());
      return { ok: false, estado: estado };
    });
  }

  /* ---------------- construcción del candado (overlay + modal) ---------------- */
  var overlay, inputEl, submitEl, statusEl, pillEl;

  function bloquearScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    document.body.style.overflow = on ? "hidden" : "";
  }

  function crearOverlay() {
    overlay = document.createElement("div");
    overlay.className = "license-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "license-title");

    var panel = document.createElement("div");
    panel.className = "license-panel";

    var eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Licencia de uso · " + PRODUCTO;

    var title = document.createElement("h2");
    title.id = "license-title";
    title.className = "license-panel__title";
    title.textContent = "Activar Licencia";

    var intro = document.createElement("p");
    intro.className = "license-panel__intro";
    intro.textContent =
      "Este proyecto se entrega bajo licencia de uso por tiempo. Para ver el plan técnico y sus costos, ingresa la clave que recibiste de CYCS & Co.";

    statusEl = document.createElement("p");
    statusEl.className = "license-panel__status";
    statusEl.setAttribute("role", "status");

    var form = document.createElement("form");
    form.className = "license-panel__form";
    form.setAttribute("novalidate", "");

    inputEl = document.createElement("input");
    inputEl.className = "license-panel__input";
    inputEl.type = "text";
    inputEl.name = "license_key";
    inputEl.placeholder = "XXXX-XXXX-XXXX-XXXX-XXXX";
    inputEl.autocomplete = "off";
    inputEl.spellcheck = false;
    inputEl.setAttribute("aria-label", "Clave de licencia");

    submitEl = document.createElement("button");
    submitEl.type = "submit";
    submitEl.className = "btn btn--primary license-panel__btn";
    submitEl.textContent = "Validar licencia";

    var nota = document.createElement("p");
    nota.className = "license-panel__note";
    nota.textContent =
      "La licencia se valida en línea contra el sistema de licencias de CYCS & Co.";

    form.appendChild(inputEl);
    form.appendChild(submitEl);
    panel.appendChild(eyebrow);
    panel.appendChild(title);
    panel.appendChild(intro);
    panel.appendChild(statusEl);
    panel.appendChild(form);
    panel.appendChild(nota);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var key = inputEl.value.trim().toUpperCase();
      if (!key) {
        setStatus("Escribe la clave para continuar.", true);
        inputEl.focus();
        return;
      }
      setValidando(true);
      activarClave(key).then(function (res) {
        setValidando(false);
        if (res.ok) {
          desbloquear();
          mostrarPill();
        } else {
          setStatus(mensajeEstado(res.estado), true);
          inputEl.focus();
          inputEl.select();
        }
      });
    });
  }

  function setStatus(texto, error) {
    statusEl.textContent = texto || "";
    statusEl.classList.toggle("license-panel__status--error", !!error);
  }

  function setValidando(on) {
    submitEl.disabled = on;
    submitEl.textContent = on ? "Validando…" : "Validar licencia";
    inputEl.readOnly = on;
  }

  function mostrarCandado() {
    ocultarPill();
    bloquearScroll(true);
    overlay.classList.remove("license-overlay--hidden");
    setTimeout(function () {
      try {
        inputEl.focus();
      } catch (e) {
        /* noop */
      }
    }, 50);
  }

  function desbloquear() {
    bloquearScroll(false);
    overlay.classList.add("license-overlay--hidden");
  }

  function mostrarPill(expiresAt) {
    if (!expiresAt) {
      var cache = leerCache();
      expiresAt = cache ? cache.expires_at : null;
    }

    if (pillEl && pillEl.parentNode) {
      pillEl.parentNode.removeChild(pillEl);
    }

    var dias = diasRestantes(expiresAt);
    var fecha = fechaLegible(expiresAt);
    var texto = "Licencia activa";
    if (dias !== null && dias > 0) {
      texto += " · " + dias + (dias === 1 ? " día" : " días");
    }
    if (fecha) {
      texto += " · expira " + fecha;
    }

    pillEl = document.createElement("div");
    pillEl.className = "license-pill";
    pillEl.setAttribute("role", "status");

    var dot = document.createElement("span");
    dot.className = "license-pill__dot";
    dot.setAttribute("aria-hidden", "true");

    var label = document.createElement("span");
    label.className = "license-pill__label";
    label.textContent = texto;

    pillEl.appendChild(dot);
    pillEl.appendChild(label);
    document.body.appendChild(pillEl);
  }

  function ocultarPill() {
    if (!pillEl || !pillEl.parentNode) return;
    pillEl.parentNode.removeChild(pillEl);
    pillEl = null;
  }

  /* ---------------- arranque ---------------- */
  function init() {
    crearOverlay();
    setStatus("Verificando licencia…", false);

    evaluarPermiso().then(function (res) {
      if (res.permitido) {
        desbloquear();
        mostrarPill(res.expires_at);
        return;
      }
      if (res.estado && res.estado !== "activa") {
        setStatus(mensajeEstado(res.estado), true);
      } else {
        setStatus("", false);
      }
      mostrarCandado();
    });
  }

  init();
})(document, window);