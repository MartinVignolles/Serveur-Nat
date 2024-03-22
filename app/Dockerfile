# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /usr/src/app

# Install net-tools (containing netstat) using apk
RUN apk --update add net-tools
RUN apk update && apk add iputils 
RUN apk add --no-cache sed

# Ajoutez le script authorizer dans le conteneur
ADD authorizer.sh /authorizer.sh

# Assurez-vous que le script a les bonnes permissions
RUN chmod +x /authorizer.sh

# Mettez à jour les paquets et installez openssh-server
RUN apk update && apk add openssh
RUN mkdir /root/.ssh

RUN ssh-keygen -A

# Copiez la clé publique dans le conteneur
COPY ./ssh-keys/id_rsa.pub /root/.ssh/authorized_keys

# Configurer SSH (exemple basique)
RUN echo "root:Docker!" | chpasswd

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# Exposer le port SSH (le port 22 est le port par défaut pour SSH)
EXPOSE 22

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 5000

RUN sed -i '/^#PubkeyAuthentication yes/s/^#//' /etc/ssh/sshd_config

# the command that starts our app
CMD ["/usr/sbin/sshd", "-D"]
