# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /usr/src/app

# Update package lists and install net-tools (containing netstat) and other utilities
RUN apt-get update && \
    apt-get install -y net-tools iputils-ping sed openssh-server && \
    rm -rf /var/lib/apt/lists/*

ADD authorizer.sh /authorizer.sh

# Assurez-vous que le script a les bonnes permissions
RUN chmod +x /authorizer.sh
COPY ./monservice.service /etc/systemd/system/
RUN mkdir /root/.ssh
COPY ./ssh-keys/id_rsa.pub /root/.ssh/authorized_keys

# Configurer SSH (exemple basique)
RUN echo "root:Docker!" | chpasswd

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# Après avoir copié ou créé le fichier
RUN chown node:node /root/.ssh/authorized_keys
USER node
# our app is running on port 5000 within the container, so need to expose it
EXPOSE 5000
EXPOSE 22

# the command that starts our app
CMD ["node", "index.js"]
