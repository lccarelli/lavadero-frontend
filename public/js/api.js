// Wrapper de fetch a la API del backend.
// El navegador del cliente le pega al host (no al hostname interno del compose),
// por eso la URL es localhost:3000, no el nombre del servicio "backend".
export const API_URL = 'http://localhost:3000/api';

// La base sin /api, para endpoints que no cuelgan de /api (ej: /health).
const BASE_URL = API_URL.replace(/\/api$/, '');

async function request(path, options = {}) {
  const isAbsolute = /^https?:\/\//.test(path);
  const url = isAbsolute ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function get(path) {
  return request(path);
}

export function post(path, data) {
  return request(path, { method: 'POST', body: JSON.stringify(data) });
}

// Helper de setup: pega al /health del backend (fuera de /api).
export function health() {
  return request(`${BASE_URL}/health`);
}

// TK-F-01: lista las categorías (devuelve un array de { id, nombre, descripcion }).
export function getCategorias() {
  return get('/categorias');
}
