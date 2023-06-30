# Copyright (c) 2023 CodeNotary, Inc. All rights reserved.
# This software is released under GPL3.
# The full license information can be found under:
# https://www.gnu.org/licenses/gpl-3.0.en.html

# immudb documentation base stage
FROM node:18-slim as builder
LABEL immudb Docs
RUN apt-get update && apt-get -y install default-jre-headless
WORKDIR /src
COPY ./*package*.json ./
RUN npm install
COPY . .
RUN yarn
RUN yarn build

# immudb documentation production stage
FROM nginx:stable-alpine as production-stage
LABEL immudb Docs
COPY --from=builder /src/build /usr/share/nginx/html/
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
