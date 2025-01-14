#!/bin/sh

# migrate schema from prisma dir
yarn prisma migrate deploy

exec "$@"
