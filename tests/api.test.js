import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, API_URL } from '../public/js/api.js';

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
