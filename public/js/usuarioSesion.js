// Sesión del usuario (tipo cliente) con TTL deslizante de 5 minutos.
// - Se guarda en sessionStorage (se borra al cerrar la pestaña, coherente con autoservicio).
// - Cada lectura/interacción renueva el TTL (deslizante).
// - Si pasan 5 minutos sin actividad, se borra (expiración perezosa al leer + timer de inactividad).

const CLAVE = 'usuario';
const TTL_MS = 5 * 60 * 1000; // 5 minutos

export function guardarUsuario({ id, nombre }) {
  const dato = { id, nombre, expiraEn: Date.now() + TTL_MS };
  sessionStorage.setItem(CLAVE, JSON.stringify(dato));
}

export function limpiarUsuario() {
  sessionStorage.removeItem(CLAVE);
}

// Devuelve { id, nombre } si la sesión está vigente; null si no existe o expiró.
// Si está vigente, renueva el TTL (deslizante).
export function obtenerUsuario() {
  const crudo = sessionStorage.getItem(CLAVE);
  if (!crudo) return null;

  let dato;
  try {
    dato = JSON.parse(crudo);
  } catch (error) {
    limpiarUsuario();
    return null;
  }

  if (!dato || Date.now() > dato.expiraEn) {
    limpiarUsuario();
    return null;
  }

  guardarUsuario({ id: dato.id, nombre: dato.nombre }); // renueva el TTL
  return { id: dato.id, nombre: dato.nombre };
}

// Borra la sesión si pasan 5 minutos sin actividad (aunque la pantalla quede abierta).
// Se reinicia con cada interacción. alExpirar se ejecuta cuando se borra.
export function iniciarExpiracionPorInactividad(alExpirar) {
  let temporizador;

  const reiniciar = () => {
    clearTimeout(temporizador);
    if (!sessionStorage.getItem(CLAVE)) return;
    temporizador = setTimeout(() => {
      limpiarUsuario();
      if (typeof alExpirar === 'function') alExpirar();
    }, TTL_MS);
  };

  ['click', 'keydown', 'mousemove', 'touchstart'].forEach((evento) =>
    document.addEventListener(evento, reiniciar, { passive: true })
  );
  reiniciar();
}
