FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 BUILD TYPESCRIPT
RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"]
