const { date, age } = require('../../lib/utils.js');
const Member = require('../models/Member');

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
      callback(members) {
        const pagination = {
          total(){
            return members[0] ? total = Math.ceil(members[0].total / limit) : total = 0
          },
          page,
          limit
        };

        return res.render('members/index.njk', { members, pagination, filter });
      }
    };

    Member.paginate(params);
  },

  create(req, res) {
    Member.instructorSelectOptions(function (instructors) {
      console.log(instructors);
      return res.render('members/create.njk', { instructors });
    });
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
    // para members e usamos o id para redirecionar
    Member.create(req.body, function (member) {
      return res.redirect(`/members/${member.id}`);
    });
  },

  show(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) return res.send('Member not found!');

      member.age = age(member.birth);
      member.birthday = date(member.birth).birthday;

      return res.render('members/show.njk', { member });
    });
  },

  edit(req, res) {
    const id = req.params.id;

    Member.find(id, function (member) {
      if (!member) return res.send('Member not found!');

      member.birth = date(member.birth).iso;

      Member.instructorSelectOptions(function (instructors) {
        console.log(instructors);
        return res.render('members/edit.njk', { member, instructors });
      });
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

    Member.update(req.body, function () {
      return res.redirect(`/members/${req.body.id}`);
    });
  },

  delete(req, res) {
    Member.delete(req.body.id, function () {
      return res.redirect('/members');
    });
  }
};
