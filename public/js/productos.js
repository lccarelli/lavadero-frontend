// Pantalla de productos. Header + tabs (categorías reales del backend) + grilla
import { getCategorias, getProductos } from './api.js';
import { mountHeader, setCartBadge } from './nav.js';
import { obtenerUsuario, iniciarExpiracionPorInactividad } from './usuarioSesion.js';
import { agregarAlCarrito, cantidadDeItems } from './carrito.js';

const ICONO_CATEGORIA = { Lavados: 'local_car_wash', Accesorios: 'category' };
const TEMAS = ['cyan', 'rose', 'amber'];

// HTML reutilizable de una card. Usa la imagen del producto si existe; si no muestra un icono.
export function renderProductoCard({ nombre, descripcion, precio, imagen, tema, icon = 'local_car_wash' }) {
  const media = imagen
    ? `<img src="${imagen}" alt="${nombre}">`
    : `<span class="material-symbols-outlined product-card__icon">${icon}</span>`;
  return `
  <article class="product-card product-card--${tema}">
    <div class="product-card__media">${media}</div>
    <h3 class="product-card__title">${nombre}</h3>
    <p class="product-card__desc">${descripcion}</p>
    <span class="product-card__price">$${precio}</span>
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

function pintarProductos(categoriaId, categoriaNombre) {
  grid.innerHTML = '<p class="grid-msg">Cargando...</p>';
  getProductos({ categoria: categoriaId, activo: true, limit: 50 })
    .then((res) => {
      const items = res.data || [];
      if (!items.length) {
        grid.innerHTML = `<p class="grid-msg">No hay productos en ${categoriaNombre || 'esta categoría'} todavía.</p>`;
        return;
      }
      grid.innerHTML = items
        .map((producto, indice) =>
          renderProductoCard({
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
          });
          setCartBadge(cantidadDeItems());
          mostrarFeedback(boton);
        })
      );
    })
    .catch((err) => {
      console.error('No se pudieron cargar los productos:', err.message);
      grid.innerHTML = '<p class="grid-msg">No se pudieron cargar los productos.</p>';
    });
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
