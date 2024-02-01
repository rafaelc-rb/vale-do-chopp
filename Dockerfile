# Use uma imagem base do Node.js
FROM node:21.1.0

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /vale-do-chopp

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package.json ./

# Instale as dependências do projeto
RUN yarn

# Copie o restante do código-fonte para o diretório de trabalho
COPY . .

# Exponha a porta em que o servidor do seu aplicativo será executado
EXPOSE 3000

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["yarn", "dev"]
