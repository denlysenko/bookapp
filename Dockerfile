FROM node:12.13.1-alpine
LABEL author="denlysenko"
WORKDIR /var/www/bookapp-api
COPY package.json .
COPY package-lock.json .
COPY libs/api/config/src/lib/.env.production ./libs/api/config/src/lib/.env
COPY libs/api/graphql/src/lib/schemas/ ./libs/api/graphql/src/lib/schemas/
RUN npm install --production
COPY bookapp-adminsdk.json .
COPY dist/apps/api/ .
ENV NODE_ENV production
EXPOSE 3333
CMD ["node", "main.js"]