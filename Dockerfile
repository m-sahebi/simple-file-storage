FROM node:lts-slim

RUN apt update
RUN apt install dumb-init

WORKDIR /app

ENV NODE_ENV production
ENV PORT 9009
ENV MAX_FILE_SIZE 1000000

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod


ADD ./src ./
RUN pnpm install -r --offline --prod

EXPOSE 9009

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD [ "node", "./src/index.js" ]
