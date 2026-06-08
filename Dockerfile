FROM nginx:alpine

# Servir los estáticos del cliente. La config default de nginx alcanza.
COPY public/ /usr/share/nginx/html/

EXPOSE 80
