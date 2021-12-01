const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override')

const server = express();

// Habilitando uso do req.body
server.use(express.urlencoded({extended: true}));


// Configurando a pasta public
server.use(express.static("public"));

//Configuração do method override
// OBS: Usar antes das rotas
server.use(methodOverride('_method'))

// Usando as rotas importadas
// do arquivo routes.js
server.use(routes)




//Configuramos para o nunjucks saber qual a pagina que está nossos htmls
// E posteriormente podermos usar o render somente com o nome do nosso html
nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000);