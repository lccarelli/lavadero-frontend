import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, API_URL, urlImagen } from '../public/js/api.js';

describe('api.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('arma la URL con la base de la API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await get('/categorias');

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/categorias`,
      expect.objectContaining({ headers: expect.any(Object) }),
    );
  });

  it('lanza error si la respuesta no es ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'No encontrado' }),
    }));

    await expect(get('/productos/999')).rejects.toThrow('No encontrado');
  });
});

describe('urlImagen', () => {
  it('prefija el path relativo con el origen del backend', () => {
    expect(urlImagen('/uploads/foto.jpg')).toBe('http://localhost:3000/uploads/foto.jpg');
  });

  it('deja las URLs absolutas como están', () => {
    expect(urlImagen('https://cdn.com/foto.jpg')).toBe('https://cdn.com/foto.jpg');
  });

  it('devuelve string vacío si no hay imagen', () => {
    expect(urlImagen(null)).toBe('');
    expect(urlImagen('')).toBe('');
  });
});
