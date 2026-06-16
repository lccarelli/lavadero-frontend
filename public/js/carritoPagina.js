// Pantalla del carrito. Renderiza el carrito (sessionStorage) y permite modificar
// cantidades, eliminar items y ver el total. "Finalizar compra" abre el modal de
// confirmación; el POST de la venta se conecta al hacer el backend de Venta (TK-F-05).
import { mountHeader, setCartBadge } from './nav.js';
import {
  obtenerCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  eliminarDelCarrito,
  totalCarrito,
  cantidadDeItems,
} from './carrito.js';

const ICONO_CATEGORIA = { Lavados: 'local_car_wash', Accesorios: 'category' };

mountHeader('');

const contenedor = document.getElementById('cart-layout');
const modal = document.getElementById('modal-confirmar');

function formatearPrecio(valor) {
  return `$${valor.toFixed(2)}`;
}

function renderItem(item) {
  const subtotal = item.precio * item.cantidad;
  return `
  <div class="cart-item" data-id="${item.id}">
    <div class="cart-item__media">
      <span class="material-symbols-outlined">${ICONO_CATEGORIA[item.categoria] || 'local_car_wash'}</span>
    </div>
    <div class="cart-item__info">
      <h3 class="cart-item__nombre">${item.nombre}</h3>
      ${item.categoria ? `<span class="cart-item__badge">${item.categoria}</span>` : ''}
    </div>
    <div class="qty-control">
      <button class="qty-control__btn" type="button" data-accion="restar" aria-label="Restar uno">
        <span class="material-symbols-outlined">remove</span>
      </button>
      <span class="qty-control__valor">${item.cantidad}</span>
      <button class="qty-control__btn qty-control__btn--mas" type="button" data-accion="sumar" aria-label="Sumar uno">
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>
    <div class="cart-item__subtotal">
      <span class="cart-item__subtotal-label">Subtotal</span>
      <span class="cart-item__subtotal-valor">${formatearPrecio(subtotal)}</span>
    </div>
    <button class="cart-item__eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">
      <span class="material-symbols-outlined">delete</span>
    </button>
  </div>`;
}

function renderVacio() {
  return `
  <div class="cart-empty">
    <span class="material-symbols-outlined cart-empty__icon">remove_shopping_cart</span>
    <p class="cart-empty__texto">Tu carrito está vacío.</p>
    <a class="btn-primary" href="productos.html">Ver productos</a>
  </div>`;
}

function renderResumen() {
  return `
  <aside class="cart-summary">
    <h2 class="cart-summary__titulo">Resumen</h2>
    <div class="cart-summary__total">
      <span>Total</span>
      <span class="cart-summary__monto">${formatearPrecio(totalCarrito())}</span>
    </div>
    <button class="btn-primary" id="boton-finalizar" type="button">
      Finalizar compra
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
    <a class="link-back" href="productos.html">
      <span class="material-symbols-outlined">arrow_back</span> Seguir comprando
    </a>
  </aside>`;
}

function render() {
  const carrito = obtenerCarrito();
  setCartBadge(cantidadDeItems());

  if (!carrito.length) {
    contenedor.innerHTML = renderVacio();
    return;
  }

  contenedor.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${carrito.map(renderItem).join('')}</div>
      ${renderResumen()}
    </div>`;

  contenedor.querySelectorAll('.cart-item').forEach((fila) => {
    const id = Number(fila.dataset.id);
    fila.querySelector('[data-accion="sumar"]').addEventListener('click', () => {
      const item = obtenerCarrito().find((i) => i.id === id);
      cambiarCantidad(id, item.cantidad + 1);
      render();
    });
    fila.querySelector('[data-accion="restar"]').addEventListener('click', () => {
      quitarDelCarrito(id);
      render();
    });
    fila.querySelector('[data-accion="eliminar"]').addEventListener('click', () => {
      eliminarDelCarrito(id);
      render();
    });
  });

  document.getElementById('boton-finalizar').addEventListener('click', abrirConfirmacion);
}

function abrirConfirmacion() {
  document.getElementById('modal-total').textContent = formatearPrecio(totalCarrito());
  modal.showModal();
}

modal.querySelector('[data-accion="cancelar"]').addEventListener('click', () => modal.close());
modal.querySelector('[data-accion="confirmar"]').addEventListener('click', () => {
  // TODO (TK-F-05 venta): POST /api/ventas con [{ producto_id, cantidad }], vaciar el
  // carrito y redirigir al ticket. Se conecta al armar el backend de Venta.
  modal.close();
});

render();
