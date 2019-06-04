FROM node

# Create app directory
RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn install

ENV  PATH="${PATH}:/app/node_modules/.bin"

COPY . /app/

EXPOSE 3000

# start command
CMD [ "ts-node", "-r", "./apm.js", "./index.ts" ]