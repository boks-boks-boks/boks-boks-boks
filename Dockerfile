FROM node:24.4-bookworm AS builder

WORKDIR /app

COPY package.json ./ 
COPY package-lock.json ./
RUN npm install
COPY . ./

RUN npm run build

FROM node:24.4-bookworm AS deployer

RUN apt-get remove -y wget || true && apt-get autoremove -y

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .

RUN npm install --omit=devs

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]
