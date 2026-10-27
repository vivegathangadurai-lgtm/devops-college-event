# Base image: tiny Linux (Alpine) with Nginx web server already installed
FROM nginx:alpine

# Remove Nginx's default welcome page so only our site is served
RUN rm -rf /usr/share/nginx/html/*

# Copy our website files into Nginx's web root folder
COPY site/ /usr/share/nginx/html/

# Copy our custom Nginx configuration (replaces the default server config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that the container listens on port 80 (does not publish it by itself)
EXPOSE 80

# The nginx:alpine base image already starts Nginx in the foreground,
# so no CMD is needed here.
