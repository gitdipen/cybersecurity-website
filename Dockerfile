# Use an official Nginx base image
FROM nginx:alpine

# Copy the static website files into the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]