FROM node:18-alpine as build

ARG VITE_APP_VERSION="0.0.0"
ENV VITE_APP_VERSION=$VITE_APP_VERSION

RUN apk add --no-cache jq

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Compacts JSON boards files
RUN for file in /app/public/boards/*.json; do \
    mv "$file" "${file}.full" && \
    jq -c . < "${file}.full" > "${file}" && \
    rm "${file}.full"; \
done

RUN yarn build

FROM httpd:alpine

COPY --from=build /app/dist /usr/local/apache2/htdocs

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]
