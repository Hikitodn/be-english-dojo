FROM node:current-alpine AS builder

ENV NODE_ENV production

RUN apk add --no-cache tzdata && \
  echo 'Etc/UTC' > /etc/timezone

WORKDIR /usr/src/app

COPY entrypoint.sh /usr/src/app/entrypoint.sh
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN yarn run build

FROM node:current-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/prisma /app/prisma
COPY --from=builder /usr/src/app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder /usr/src/app/dist /app/dist
COPY --from=builder /usr/src/app/.pnp.cjs /app/.pnp.cjs
COPY --from=builder /usr/src/app/.yarnrc.yml /app/.yarnrc.yml
COPY --from=builder /usr/src/app/.yarn /app/.yarn
COPY --from=builder /usr/src/app/package.json /app/package.json
COPY --from=builder /usr/src/app/yarn.lock /app/yarn.lock

EXPOSE 3000

ENV NODE_ENV production

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD [ "yarn", "run", "start:prod" ]
