// Toggle de tema claro/oscuro, persistido en localStorage (clave 'tema').
// El script inline del <head> ya aplica el tema antes de pintar (anti-flash);
// acá solo manejamos el cambio manual y la lectura del estado actual.
const CLAVE = 'tema';

// Aplica un tema ('light' | 'dark'): lo setea en <html> y lo persiste.
export function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  try {
    localStorage.setItem(CLAVE, tema);
  } catch (e) {}
}

// Tema actual, leído del atributo que el script inline ya dejó en <html>.
export function temaActual() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// Alterna claro <-> oscuro y devuelve el nuevo tema (para actualizar el ícono).
export function toggleTema() {
  const nuevo = temaActual() === 'dark' ? 'light' : 'dark';
  aplicarTema(nuevo);
  return nuevo;
}
