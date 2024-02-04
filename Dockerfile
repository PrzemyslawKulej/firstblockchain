FROM node:20.9-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm install
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["npm", "run", "node_1"]



