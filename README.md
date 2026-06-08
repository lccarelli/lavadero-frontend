# Frontend - Lavadero Autoservicio

Frontend del autoservicio del lavadero. **HTML/CSS/JS vanilla**, sin frameworks ni bundlers.
Se sirve con **nginx** y consume la API del backend con `fetch`.

## Estructura

```
public/
├── *.html          una pantalla = un archivo (index, productos, carrito, ticket, ...)
├── css/            base.css (reset/layout), theme.css (variables claro/oscuro), components.css
├── js/             módulos: api.js (fetch), carrito.js (sessionStorage), tema.js, nav.js
└── assets/         logo, favicon
tests/              tests con vitest + jsdom
```

## Correr en local (con Docker)

El frontend se levanta junto al backend desde el `docker-compose.yml` del repo
**lavadero-backend**. Cloná ambos repos como carpetas hermanas:

```
tp-lavadero/
├── lavadero-backend/    <- acá está el docker-compose.yml
└── lavadero-frontend/   <- este repo
```

Luego, desde `lavadero-backend/`:

```bash
docker-compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3000/api

## Tests

Se corren fuera de Docker (Node 18+):

```bash
npm install   # solo la primera vez
npm test
```

