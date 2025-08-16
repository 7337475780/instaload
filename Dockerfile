# Use a modern Node.js base image (18 is fine, 20 works too)
FROM node:18-bullseye

# Install ffmpeg + python + yt-dlp
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip && \
    pip3 install yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose port Railway will use
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
