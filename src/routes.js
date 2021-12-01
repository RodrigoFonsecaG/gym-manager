// Exportamos o express
const express = require('express');



// Pegamos da const express somente o metodo para
// a criação de rotas
const routes = express.Router();

// Chamando as funções
const instructors = require('./app/controllers/instructors');
const members = require('./app/controllers/members');

// Criamos normalmente todas as rotas
routes.get('/', (req, res) => {
    return res.redirect("/instructors")
})

routes.get('/instructors', instructors.index)
routes.post("/instructors", instructors.post)
routes.get('/instructors/create', instructors.create)
routes.put("/instructors", instructors.put);
routes.delete("/instructors", instructors.delete);
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)





routes.get('/members', members.index)
routes.post("/members", members.post)
routes.get('/members/create', members.create)
routes.put("/members", members.put);
routes.delete("/members", members.delete);
routes.get('/members/:id', members.show)
routes.get('/members/:id/edit', members.edit)


// Exportamos para usar no server.js
module.exports = routes;

