// Estado del carrito en sessionStorage (clave 'carrito').
// Cada item es un snapshot del producto: { id, nombre, precio, categoria, cantidad }.
// El total se muestra acá solo para el usuario; al crear la venta el backend recalcula
// con los precios reales (el front manda solo [{ producto_id, cantidad }]).

const CLAVE = 'carrito';

export function obtenerCarrito() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE)) || [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(items) {
  sessionStorage.setItem(CLAVE, JSON.stringify(items));
}

// Agrega el producto; si ya estaba en el carrito, le suma 1 a la cantidad.
export function agregarAlCarrito(producto, cantidad = 1) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      categoria: producto.categoria,
      cantidad,
    });
  }
  guardarCarrito(carrito);
}

// Resta 1 a la cantidad; si llega a 0, saca el item del carrito.
export function quitarDelCarrito(productoId) {
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === productoId);
  if (!item) return;
  item.cantidad -= 1;
  guardarCarrito(item.cantidad <= 0 ? carrito.filter((i) => i.id !== productoId) : carrito);
}

// Setea la cantidad exacta de un item (mínimo 1).
export function cambiarCantidad(productoId, cantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === productoId);
  if (!item) return;
  item.cantidad = Math.max(1, cantidad);
  guardarCarrito(carrito);
}

// Saca el item entero del carrito.
export function eliminarDelCarrito(productoId) {
  guardarCarrito(obtenerCarrito().filter((i) => i.id !== productoId));
}

// Suma de precio * cantidad (para mostrar el total).
export function totalCarrito() {
  return obtenerCarrito().reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

// Suma de cantidades (para el badge del header).
export function cantidadDeItems() {
  return obtenerCarrito().reduce((suma, item) => suma + item.cantidad, 0);
}

export function vaciarCarrito() {
  sessionStorage.removeItem(CLAVE);
}
