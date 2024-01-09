FROM node:lts-alpine

RUN apk add dumb-init

WORKDIR /app

RUN npm install -g pnpm

ARG PORT
ARG UPLOAD_MAX_FILE_SIZE

ENV NODE_ENV production
ENV PORT 9009
ENV UPLOAD_MAX_FILE_SIZE ${UPLOAD_MAX_FILE_SIZE}

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod


ADD . ./
RUN pnpm install -r --offline --prod
RUN pnpm build


EXPOSE 9009

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD [ "pnpm", "serve" ]
