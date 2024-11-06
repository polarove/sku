# Stage 1: Build
FROM node:latest as build

WORKDIR /app

# Copy only package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./

RUN yarn install

# Copy the rest of the application code
COPY . .

RUN yarn build

# Stage 2: Production
FROM node:latest as production

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000

WORKDIR /app

# Copy built output from build stage
COPY --from=build /app/.output . 

CMD [ "node", "./server/index.mjs" ]