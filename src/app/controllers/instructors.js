const db = require('../../config/db.js');
const { date, age } = require('../../lib/utils.js');
const Instructor = require('../models/Instructor');

module.exports = {
  index(req, res) {
    // As informações da url:
    //filter é a palavra procurada
    // page é a pagina que estamos
    // limit é o limite de iten s de cada pagina
    let { filter, page, limit } = req.query;

    // se nao mudarmos a pagina na url, a pagina vai ser a primeira
    // ja que no momento que entramos no site nao mudamos a pagina
    // mesma coisa para o limite
    page = page || 1;
    limit = limit || 2;

    // Logica para pular a pagina de acordo com o limite e pagina
    // Ex: pagina 1, limite 2, offset = 0
    // pagina 2, limite 2, offset = 2
    // pagina 3, limite 2, offset = 4
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(instructors) {
        const pagination = {
          total(){
            return instructors[0] ? total = Math.ceil(instructors[0].total / limit) : total = 0
          },
          page,
          limit
        };

        return res.render('instructors/index.njk', { instructors, pagination, filter });
      }
    };

    Instructor.paginate(params);
  },
  create(req, res) {
    return res.render('instructors/create.njk');
  },
  post(req, res) {
    // Pega todos os nomes de cada campo
    // do objeto req.body
    const keys = Object.keys(req.body);

    // Faz um loop para verificar se por exemplo,
    // o campo req.body.name está vazio e retorna
    // uma mensagem
    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Preencha todos os campos');
      }
    }

    // Passamos o req.body do nosso formulario
    // E a função que recebe os dados e mudamos o nome
    // para instructors e usamos o id para redirecionar
    Instructor.create(req.body, function (instructor) {
      return res.redirect(`/instructors/${instructor.id}`);
    });
  },

  show(req, res) {
    Instructor.find(req.params.id, function (instructor) {
      if (!instructor) return res.send('Instructor not found!');

      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.split(',');
      instructor.created_at = date(instructor.created_at).format;

      return res.render('instructors/show.njk', { instructor });
    });
  },

  edit(req, res) {
    const id = req.params.id;

    Instructor.find(id, function (instructor) {
      if (!instructor) return res.send('Instructor not found!');

      instructor.birth = date(instructor.birth).iso;

      return res.render('instructors/edit.njk', { instructor });
    });
  },

  put(req, res) {
    // Pega todos os nomes de cada campo
    // do objeto req.body
    const keys = Object.keys(req.body);

    // Faz um loop para verificar se por exemplo,
    // o campo req.body.name está vazio e retorna
    // uma mensagem
    for (let key of keys) {
      if (req.body[key] == '') {
        return res.send('Preencha todos os campos');
      }
    }

    Instructor.update(req.body, function () {
      return res.redirect(`/instructors/${req.body.id}`);
    });
  },

  delete(req, res) {
    Instructor.delete(req.body.id, function () {
      return res.redirect('/instructors');
    });
  }
};
