FROM node:24.10.0-bullseye AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build -- api

FROM node:24.10.0-bullseye-slim AS final
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/dist/apps/api .
RUN npm install --production
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "main.js"]
