// TK-S-04: verifica la comunicación end-to-end con el backend (CORS incluido).
import { health } from './api.js';

const el = document.getElementById('status');

health()
  .then((data) => {
    if (el) el.textContent = `Backend OK · ${data.status} · ${data.timestamp}`;
  })
  .catch((err) => {
    if (el) el.textContent = `No se pudo conectar al backend: ${err.message}`;
  });
