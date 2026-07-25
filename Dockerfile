FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node server.ts ./
COPY --chown=node:node public ./public
COPY --chown=node:node assets ./assets

USER node
EXPOSE 80
ENV PORT=80
ENV HOST="0.0.0.0"
CMD ["node", "--experimental-transform-types", "server.ts"]
