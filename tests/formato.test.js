import { describe, it, expect } from 'vitest';
import { formatearPrecio } from '../public/js/formato.js';

describe('formatearPrecio (pesos argentinos)', () => {
  it('agrega separador de miles', () => {
    expect(formatearPrecio(1234.5)).toBe('$1.234,50');
  });

  it('agrega separador de millones', () => {
    expect(formatearPrecio(1234567.89)).toBe('$1.234.567,89');
  });

  it('siempre muestra dos decimales', () => {
    expect(formatearPrecio(8)).toBe('$8,00');
  });

  it('tolera strings (DECIMAL viene como string del backend)', () => {
    expect(formatearPrecio('22.00')).toBe('$22,00');
  });
});
