// Pantalla del ticket. Lee la venta recién creada de sessionStorage ('ultimaVenta'),
// la muestra, permite descargarla en PDF y finalizar (limpia el estado y vuelve al inicio).
import { mountHeader, setCartBadge } from './nav.js';

mountHeader('');
setCartBadge(0); // el carrito quedó vacío tras la compra

const venta = leerVenta();
if (!venta) {
  // sin venta (entró directo o ya finalizó): volver al inicio
  window.location.href = 'index.html';
} else {
  renderTicket(venta);
  document.getElementById('boton-pdf').addEventListener('click', () => descargarPdf(venta));
  document.getElementById('boton-finalizar').addEventListener('click', () => {
    sessionStorage.clear(); // limpia carrito, usuario y la venta
    window.location.href = 'index.html';
  });
}

function leerVenta() {
  try {
    return JSON.parse(sessionStorage.getItem('ultimaVenta'));
  } catch (error) {
    return null;
  }
}

function formatearPrecio(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderTicket(venta) {
  const items = venta.items
    .map(
      (item) => `
      <div class="ticket__item">
        <div class="ticket__item-info">
          <span class="material-symbols-outlined ticket__item-icon">local_car_wash</span>
          <div>
            <p class="ticket__item-nombre">${item.producto.nombre}</p>
            <p class="ticket__item-detalle">${item.cantidad} x ${formatearPrecio(item.precioUnitario)}</p>
          </div>
        </div>
        <span class="ticket__item-subtotal">${formatearPrecio(item.precioUnitario * item.cantidad)}</span>
      </div>`
    )
    .join('');

  document.getElementById('ticket').innerHTML = `
    <div class="ticket__head">
      <div>
        <p class="ticket__numero">TICKET #${String(venta.id).padStart(4, '0')}</p>
        <p class="ticket__fecha">${formatearFecha(venta.createdAt)}</p>
      </div>
      <div class="ticket__cliente">
        <p class="ticket__cliente-label">Cliente</p>
        <p class="ticket__cliente-nombre">${venta.usuario.nombre}</p>
      </div>
    </div>
    <div class="ticket__items">${items}</div>
    <div class="ticket__total">
      <span>Total</span>
      <span class="ticket__total-monto">${formatearPrecio(venta.precioTotal)}</span>
    </div>`;
}

function descargarPdf(venta) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16);
  doc.text('AutoLavado Express', 20, y);
  y += 8;
  doc.setFontSize(11);
  doc.text(`Ticket #${String(venta.id).padStart(4, '0')}`, 20, y);
  y += 6;
  doc.text(`Fecha: ${formatearFecha(venta.createdAt)}`, 20, y);
  y += 6;
  doc.text(`Cliente: ${venta.usuario.nombre}`, 20, y);
  y += 10;
  venta.items.forEach((item) => {
    doc.text(`${item.producto.nombre}   ${item.cantidad} x ${formatearPrecio(item.precioUnitario)}`, 20, y);
    doc.text(formatearPrecio(item.precioUnitario * item.cantidad), 190, y, { align: 'right' });
    y += 6;
  });
  y += 4;
  doc.setFontSize(13);
  doc.text('Total', 20, y);
  doc.text(formatearPrecio(venta.precioTotal), 190, y, { align: 'right' });
  doc.save(`ticket-${venta.id}-${venta.usuario.nombre}.pdf`);
}
