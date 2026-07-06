// Pantalla de detalle de un producto. Lee el id de la URL (?id=N), pide el producto
// al backend y lo muestra; permite elegir cantidad y agregarlo al carrito.
import { mountHeader, setCartBadge } from './nav.js';
import { getProducto, urlImagen } from './api.js';
import { formatearPrecio } from './formato.js';
import { agregarAlCarrito, cantidadDeItems } from './carrito.js';

const ICONO_CATEGORIA = { Lavados: 'local_car_wash', Accesorios: 'category' };
const contenedor = document.getElementById('detalle');

mountHeader('productos');
setCartBadge(cantidadDeItems());

const id = new URLSearchParams(location.search).get('id');
let cantidad = 1;

if (!id) {
  contenedor.innerHTML = mensaje('No se indicó el producto.');
} else {
  contenedor.innerHTML = '<p class="grid-msg">Cargando...</p>';
  getProducto(id)
    .then(renderDetalle)
    .catch((error) => {
      contenedor.innerHTML = mensaje(error.message || 'No se pudo cargar el producto.');
    });
}

function mensaje(texto) {
  return `<p class="grid-msg">${texto} <a href="productos.html">Ver productos</a></p>`;
}

function renderDetalle(producto) {
  const categoria = producto.categoria?.nombre;
  const media = producto.imagen
    ? `<img src="${urlImagen(producto.imagen)}" alt="${producto.nombre}">`
    : `<span class="material-symbols-outlined detalle__icon">${ICONO_CATEGORIA[categoria] || 'local_car_wash'}</span>`;

  contenedor.innerHTML = `
    <div class="detalle__grid">
      <div class="detalle__media">${media}</div>
      <div class="detalle__info">
        ${categoria ? `<span class="detalle__chip">${categoria}</span>` : ''}
        <h1 class="detalle__title">${producto.nombre}</h1>
        <div class="detalle__card">
          <span class="detalle__price">${formatearPrecio(producto.precio)}</span>
          <p class="detalle__desc">${producto.descripcion || ''}</p>
        </div>
        <div class="detalle__cantidad">
          <span class="detalle__cantidad-label">Cantidad</span>
          <div class="qty-control">
            <button class="qty-control__btn" type="button" data-accion="restar" aria-label="Restar uno">
              <span class="material-symbols-outlined">remove</span>
            </button>
            <span class="qty-control__valor" id="cantidad">1</span>
            <button class="qty-control__btn qty-control__btn--mas" type="button" data-accion="sumar" aria-label="Sumar uno">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
        <button class="btn-primary" id="boton-agregar" type="button">
          <span class="material-symbols-outlined">shopping_basket</span> Agregar al carrito
        </button>
      </div>
    </div>`;

  const valorEl = document.getElementById('cantidad');
  contenedor.querySelector('[data-accion="sumar"]').addEventListener('click', () => {
    cantidad += 1;
    valorEl.textContent = cantidad;
  });
  contenedor.querySelector('[data-accion="restar"]').addEventListener('click', () => {
    if (cantidad > 1) {
      cantidad -= 1;
      valorEl.textContent = cantidad;
    }
  });
  document.getElementById('boton-agregar').addEventListener('click', () => {
    agregarAlCarrito(
      { id: producto.id, nombre: producto.nombre, precio: producto.precio, categoria, imagen: producto.imagen },
      cantidad
    );
    setCartBadge(cantidadDeItems());
    window.location.href = 'carrito.html';
  });
}
