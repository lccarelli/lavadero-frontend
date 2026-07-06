// Pantalla de productos. Header + tabs (categorías reales del backend) + grilla
import { getCategorias, getProductos, urlImagen } from './api.js';
import { formatearPrecio } from './formato.js';
import { mountHeader, setCartBadge } from './nav.js';
import { obtenerUsuario, iniciarExpiracionPorInactividad } from './usuarioSesion.js';
import { agregarAlCarrito, cantidadDeItems } from './carrito.js';

const ICONO_CATEGORIA = { Lavados: 'local_car_wash', Accesorios: 'category' };
const TEMAS = ['cyan', 'rose', 'amber'];

// HTML reutilizable de una card. Usa la imagen del producto si existe; si no muestra un icono.
export function renderProductoCard({ id, nombre, descripcion, precio, imagen, tema, icon = 'local_car_wash' }) {
  const media = imagen
    ? `<img src="${urlImagen(imagen)}" alt="${nombre}">`
    : `<span class="material-symbols-outlined product-card__icon">${icon}</span>`;
  return `
  <article class="product-card product-card--${tema}">
    <a class="product-card__link" href="producto-detalle.html?id=${id}">
      <div class="product-card__media">${media}</div>
      <h3 class="product-card__title">${nombre}</h3>
    </a>
    <p class="product-card__desc">${descripcion}</p>
    <span class="product-card__price">${formatearPrecio(precio)}</span>
    <button class="btn-clay add-to-cart" type="button">
      <span class="material-symbols-outlined">add_circle</span> Añadir al carrito
    </button>
  </article>`;
}

const grid = document.getElementById('product-grid');
const tabs = document.getElementById('category-tabs');

// Feedback visual "¡Añadido!" en el botón.
function mostrarFeedback(boton) {
  const original = boton.innerHTML;
  boton.classList.add('is-added');
  boton.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Añadido!';
  setTimeout(() => {
    boton.classList.remove('is-added');
    boton.innerHTML = original;
  }, 1200);
}

// Recordamos la categoría actual para poder cambiar de página sin perderla.
let ctxCategoria = { id: null, nombre: null };
const POR_PAGINA = 6;

function pintarProductos(categoriaId, categoriaNombre, pagina = 1) {
  ctxCategoria = { id: categoriaId, nombre: categoriaNombre };
  grid.innerHTML = '<p class="grid-msg">Cargando...</p>';
  getProductos({ categoria: categoriaId, activo: true, page: pagina, limit: POR_PAGINA })
    .then((res) => {
      const items = res.data || [];
      if (!items.length) {
        grid.innerHTML = `<p class="grid-msg">No hay productos en ${categoriaNombre || 'esta categoría'} todavía.</p>`;
        pintarPaginacion(null);
        return;
      }
      grid.innerHTML = items
        .map((producto, indice) =>
          renderProductoCard({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: Number(producto.precio).toFixed(2),
            imagen: producto.imagen,
            tema: TEMAS[indice % TEMAS.length],
            icon: ICONO_CATEGORIA[categoriaNombre] || 'local_car_wash',
          })
        )
        .join('');
      grid.querySelectorAll('.add-to-cart').forEach((boton, indice) =>
        boton.addEventListener('click', () => {
          const producto = items[indice];
          agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            categoria: producto.categoria?.nombre,
            imagen: producto.imagen,
          });
          setCartBadge(cantidadDeItems());
          mostrarFeedback(boton);
        })
      );
      pintarPaginacion(res.pagination);
    })
    .catch((err) => {
      console.error('No se pudieron cargar los productos:', err.message);
      grid.innerHTML = '<p class="grid-msg">No se pudieron cargar los productos.</p>';
    });
}

// Controles de paginación (prev / info / next). La paginación la calcula el backend
// (findAndCountAll -> { data, pagination }); acá solo pedimos la página y pintamos.
function pintarPaginacion(pagination) {
  const cont = document.getElementById('pagination');
  if (!cont) return;
  if (!pagination || pagination.totalPages <= 1) {
    cont.innerHTML = '';
    return;
  }
  const { page, totalPages } = pagination;
  cont.innerHTML = `
    <button class="pagination__btn" type="button" data-accion="prev" ${page <= 1 ? 'disabled' : ''} aria-label="Anterior">
      <span class="material-symbols-outlined">chevron_left</span>
    </button>
    <span class="pagination__info">Página ${page} de ${totalPages}</span>
    <button class="pagination__btn" type="button" data-accion="next" ${page >= totalPages ? 'disabled' : ''} aria-label="Siguiente">
      <span class="material-symbols-outlined">chevron_right</span>
    </button>`;
  cont.querySelector('[data-accion="prev"]').addEventListener('click', () =>
    pintarProductos(ctxCategoria.id, ctxCategoria.nombre, page - 1)
  );
  cont.querySelector('[data-accion="next"]').addEventListener('click', () =>
    pintarProductos(ctxCategoria.id, ctxCategoria.nombre, page + 1)
  );
}

function pintarTabs(categorias) {
  tabs.innerHTML = categorias
    .map(
      (categoria, indice) => `
      <button class="segmented__btn${indice === 0 ? ' is-active' : ''}" type="button"
              data-id="${categoria.id}" data-nombre="${categoria.nombre}">
        <span class="material-symbols-outlined">${ICONO_CATEGORIA[categoria.nombre] || 'category'}</span>
        ${categoria.nombre}
      </button>`
    )
    .join('');
  tabs.querySelectorAll('.segmented__btn').forEach((boton) => {
    boton.addEventListener('click', () => {
      tabs.querySelectorAll('.segmented__btn').forEach((tab) => tab.classList.remove('is-active'));
      boton.classList.add('is-active');
      pintarProductos(boton.dataset.id, boton.dataset.nombre);
    });
  });
}

mountHeader('productos');
setCartBadge(cantidadDeItems());

// Saludo personalizado con el nombre del usuario (sesión con TTL de 5 min).
const usuario = obtenerUsuario();
if (usuario) {
  const tituloHero = document.getElementById('hero-title');
  if (tituloHero) tituloHero.textContent = `Hola ${usuario.nombre}, elegí tu lavado`;
}

// Si pasan 5 minutos sin actividad, se borra la sesión y vuelve a la bienvenida.
iniciarExpiracionPorInactividad(() => {
  window.location.href = 'index.html';
});

getCategorias()
  .then((categorias) => {
    if (!categorias.length) return;
    pintarTabs(categorias);
    pintarProductos(categorias[0].id, categorias[0].nombre);
  })
  .catch((err) => {
    console.error('No se pudieron cargar las categorías:', err.message);
    if (tabs) tabs.innerHTML = '<p class="grid-msg">No se pudo conectar con el servidor.</p>';
  });
