const db = require('../../config/db');
const { age, date } = require('../../lib/utils.js');

module.exports = {
  // Metodo que seleciona da tabela todos os dados
  // Usamos como parametro uma função que será chamada
  // após seleciona no banco de dados
  all(callback) {
    db.query(`SELECT * FROM members`, function (err, results) {
      if (err) throw err;

      // Apos selecionar envias para a função
      // a rows da tabela
      callback(results.rows);
    });
  },

  create(data, callback) {
    const query = `
      INSERT INTO members(
        name,
        avatar_url,
        email,
        gender,
        birth,
        blood,
        weight,
        height,
        instructor_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;

    // Substituimos por data já que é
    // o nome que colocamos no parametro
    // eventuamente vai receber o req.body
    const values = [
      data.name,
      data.avatar_url,
      data.email,
      data.gender,
      date(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.instructor
    ];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      // Roda função que passa como parametro
      // os resultados do usario, [0] por no causo é
      // apenas um, já que estamos criando
      callback(results.rows[0]);
    });
  },

  find(id, callback) {
    db.query(
      `SELECT members.*, instructors.name AS instructor_name 
      FROM members 
      LEFT JOIN instructors ON (members.instructor_id = instructors.id)
      WHERE members.id = $1`,
      [id],
      function (err, results) {
        if (err) throw err;

        callback(results.rows[0]);
      }
    );
  },

  update(data, callback) {
    // Colocamos na query os dados que atualizamos na pagina de editar
    const query = `
      UPDATE members SET
      avatar_url=($1),
      name=($2),
      birth=($3),
      gender=($4),
      email=($5),
      blood=($6),
      weight=($7),
      height=($8),
      instructor_id=($9)
      WHERE id = $10
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
      data.id
    ];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      callback();
    });
  },

  delete(id, callback) {
    db.query(
      `DELETE FROM members WHERE id = $1`,
      [id],
      function (err, results) {
        if (err) throw err;

        callback();
      }
    );
  },

  instructorSelectOptions(callback) {
    db.query(`SELECT name,id FROM instructors`, function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  },

  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = '',
      filterQuery = '',
      totalQuery = ` (
      SELECT count(*) FROM members
    ) AS total`;

    // Se não house filtro apenas selecionar os instructors e contar os membros

    // Se houver filtro faz mesma coisa da query de cima e adiciona o where ilike
    if (filter) {
      filterQuery = `
      WHERE members.name ILIKE '%${filter}%'
      OR members.email ILIKE '%${filter}%'
      `;

      totalQuery = `(
          SELECT count(*) FROM members
          ${filterQuery}
      ) AS total`;
    }

    query = `SELECT members.*, ${totalQuery}
    FROM members
    ${filterQuery}
    LIMIT $1 OFFSET $2
    `;

    // Executamos passando nosso limite e nosso offset e retornar
    // os instructors
    db.query(query, [limit, offset], function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  }
};
