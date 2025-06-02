# Use a lightweight Nginx base image
FROM nginx:alpine

# Copy your static website files into the Nginx default web directory
# Assuming your index.html, css/, and js/ are directly in the root of your repo
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose the port Nginx listens on (default is 80)
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]