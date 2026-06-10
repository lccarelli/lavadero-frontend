// TK-F-01: al cargar la página, trae las categorías del backend.
// Por ahora solo las logea en consola para verificar la integración end-to-end.
// El render de tabs/cards llega en TK-F-02.
import { getCategorias } from './api.js';

getCategorias()
  .then((categorias) => {
    console.log('Categorías:', categorias);
  })
  .catch((err) => {
    console.error('No se pudieron cargar las categorías:', err.message);
  });
