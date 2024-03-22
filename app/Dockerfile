# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /usr/src/app

# Install net-tools (containing netstat) using apk
RUN apk --update add net-tools
RUN apk update && apk add iputils 
RUN apk add --no-cache sed

ADD authorizer.sh /authorizer.sh

# Assurez-vous que le script a les bonnes permissions
RUN chmod +x /authorizer.sh

# Mettez à jour les paquets et installez openssh-server
RUN apk update && apk add openssh
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

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 5000
EXPOSE 22

# the command that starts our app
CMD ["node", "index.js", "/usr/sbin/sshd", "-D"]