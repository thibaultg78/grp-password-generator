FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose Vite port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]
