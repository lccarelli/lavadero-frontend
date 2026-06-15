// Wrapper de fetch a la API del backend.
// El navegador del cliente le pega al host => URL es localhost:3000
export const API_URL = 'http://localhost:3000/api';

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

export function health() {
  return request(`${BASE_URL}/health`);
}

// TK-F-01: lista las categorías (devuelve un array de { id, nombre, descripcion }).
export function getCategorias() {
  return get('/categorias');
}

// TK-F-02: lista productos paginados. Devuelve { data, pagination }.
export function getProductos({ categoria, activo = true, page = 1, limit = 8 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (categoria) params.set('categoria', categoria);
  if (activo) params.set('activo', 'true');
  return get(`/productos?${params.toString()}`);
}
