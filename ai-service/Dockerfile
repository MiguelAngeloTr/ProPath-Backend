# Use the official Node.js image as the base image
FROM node:22-alpine

# Instalar dependencias necesarias para compilación de módulos nativos
RUN apk update --no-cache && \
    apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Command to run the application
CMD ["node", "dist/main"]