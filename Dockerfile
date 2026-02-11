# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
ENV HOST=0.0.0.0
COPY . .
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
