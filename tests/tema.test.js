import { describe, it, expect, beforeEach, vi } from 'vitest';
import { aplicarTema, temaActual, toggleTema } from '../public/js/tema.js';

// jsdom no siempre expone un localStorage funcional, así que usamos uno mínimo en memoria.
function crearLocalStorageMock() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
}

describe('tema.js', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', crearLocalStorageMock());
    document.documentElement.removeAttribute('data-theme');
  });

  describe('aplicarTema', () => {
    it('setea data-theme en <html> y lo persiste en localStorage', () => {
      aplicarTema('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('tema')).toBe('dark');
    });
  });

  describe('temaActual', () => {
    it('devuelve el tema del atributo data-theme', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(temaActual()).toBe('dark');
    });

    it('devuelve "light" por defecto cuando no hay data-theme', () => {
      expect(temaActual()).toBe('light');
    });
  });

  describe('toggleTema', () => {
    it('de claro pasa a oscuro, lo devuelve y lo persiste', () => {
      aplicarTema('light');
      const nuevo = toggleTema();
      expect(nuevo).toBe('dark');
      expect(temaActual()).toBe('dark');
      expect(localStorage.getItem('tema')).toBe('dark');
    });

    it('de oscuro vuelve a claro', () => {
      aplicarTema('dark');
      expect(toggleTema()).toBe('light');
      expect(temaActual()).toBe('light');
    });

    it('dos toggles seguidos vuelven al tema inicial', () => {
      aplicarTema('light');
      toggleTema();
      toggleTema();
      expect(temaActual()).toBe('light');
    });
  });
});
