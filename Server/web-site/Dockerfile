FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

RUN node -v
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm","start"]
