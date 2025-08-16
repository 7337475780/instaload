FROM node:18

# Install ffmpeg + python + yt-dlp
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip
RUN pip3 install yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
