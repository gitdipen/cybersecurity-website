# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy backend package.json and package-lock.json first to leverage Docker cache
# Assumes backend/ is a subfolder in your project root
COPY backend/package.json backend/package-lock.json ./backend/

# Install backend dependencies
RUN npm install --prefix ./backend --production # --production for smaller image

# Copy the rest of the backend code
COPY backend/ ./backend/

# Copy your frontend static assets (HTML, CSS, JS folders)
# Adjust this based on where your frontend files are:
# If in root:
COPY index.html ./
COPY css/ ./css/
COPY js/ ./js/
# OR if you moved them to a 'frontend' folder:
# COPY frontend/ ./frontend/

# Expose the port your Node.js server listens on
EXPOSE 8081

# Command to run the Node.js server
CMD ["node", "backend/server.js"]