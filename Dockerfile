FROM node:lts-slim

RUN apt update
RUN apt install dumb-init

WORKDIR /app

RUN npm install -g pnpm

ARG PORT
ARG UPLOAD_MAX_FILE_SIZE

ENV NODE_ENV production
ENV PORT ${PORT}
ENV UPLOAD_MAX_FILE_SIZE ${UPLOAD_MAX_FILE_SIZE}

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod


ADD . ./
RUN pnpm install -r --offline --prod

EXPOSE 9009

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD [ "node", "./src/index.js" ]
