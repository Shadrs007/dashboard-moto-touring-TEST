FROM nginx:alpine

# Copy static website files to nginx directory
COPY . /usr/share/nginx/html

# Expose port 80 for Coolify reverse proxy (Traefik)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
