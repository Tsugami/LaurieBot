FROM node:12.2.0-alpine

# set working directory
RUN mkdir -p /app
WORKDIR /app

# install and cache app dependencies
COPY package.json /app
COPY yarn.lock /app
COPY nodemon.json /app
COPY tsconfig.json /app
COPY assets /app/assets

RUN yarn install

EXPOSE 3333

# start app
CMD ["yarn", "dev"]