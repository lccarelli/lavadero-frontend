// Formatea un número como precio en pesos argentinos: separador de miles (.) y
// decimales (,). Ej: 1234567.5 -> "$1.234.567,50"
export function formatearPrecio(valor) {
  const numero = Number(valor) || 0;
  return `$${numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
