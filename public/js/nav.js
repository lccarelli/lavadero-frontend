// Header/nav compartido. Cualquier página con <header id="app-header"> lo usa.
// Reutilizable: el HTML del header vive acá, no se repite en cada .html.

const LINKS = [
  { href: 'index.html', label: 'Inicio', key: 'inicio' },
  { href: 'productos.html', label: 'Productos', key: 'productos' },
];

export function renderHeader({ active = '' } = {}) {
  const nav = LINKS.map(
    (link) => `<a href="${link.href}"${link.key === active ? ' aria-current="page"' : ''}>${link.label}</a>`
  ).join('');

  return `
  <div class="app-header__bar">
    <a class="brand" href="index.html">
      <span class="brand__logo"><span class="material-symbols-outlined">local_car_wash</span></span>
      <span class="brand__name">AutoLavado Express</span>
    </a>
    <nav class="app-nav">${nav}</nav>
    <div class="header-actions">
      <button class="icon-btn" aria-label="Carrito">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="cart-badge" id="cart-badge">0</span>
      </button>
    </div>
  </div>`;
}

// Inserta el header en la página. active = key del link a resaltar.
export function mountHeader(active) {
  const contenedor = document.getElementById('app-header');
  if (contenedor) contenedor.innerHTML = renderHeader({ active });
}

// TODO en TK-F-05; por ahora recibe el número a mostrar.)
export function setCartBadge(cantidad) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = cantidad;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 200);
}
