FROM node:16-alpine AS builder
ARG PP_SPLUNK_HOST
ARG PP_SPLUNK_PORT
ARG PP_SPLUNK_SSL
ARG PP_SPLUNK_TOKEN
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN ./node_modules/webpack/bin/webpack.js -p

FROM node:16-alpine
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["serve", "-p", "3000", "-s", "."]